import {
    call,
    cancel,
    cancelled,
    delay,
    fork,
    put,
    select,
    take,
    takeEvery,
} from 'redux-saga/effects';
import { buffers, eventChannel, channel } from 'redux-saga';
import {
    actionsByType,
    powerManagementRequestAction,
    syncRequestAction,
} from 'pium-pium-engine';
import { v4 as uuidv4 } from 'uuid';
import { selectPlayerId, setPlayerId } from '../reducers/playerReducer';

const WsKeepAlivePeriod = 5 * 60 * 1000;
const WebsocketFailedConnectionBackoff = 500;
const wssURL = 'ws://localhost:3001/game';

function createWebsocketChannel(ws) {
    return eventChannel((emitter) => {
        let opened = false;
        let closed = false;

        ws.onopen = () => {
            opened = true;
            emitter({
                type: 'OPEN',
            });
        };

        ws.onclose = () => {
            closed = true;
            emitter({
                type: 'CLOSE',
            });
        };

        ws.onmessage = (messageEvent) => {
            emitter({
                type: 'MESSAGE',
                messageEvent,
            });
        };
        ws.onerror = () => {
            emitter({
                type: 'ERROR',
            });
        };
        return () => {
            console.log('Cleaning up websocket', { opened, closed });
            if (opened && !closed) {
                ws.close();
            }
        };
    }, buffers.expanding());
}

function* keepAlive(ws) {
    while (true) {
        ws.send(JSON.stringify({ type: 'heartbeat' }));
        yield delay(WsKeepAlivePeriod);
    }
}

function* sendMessage(ws, channel) {
    while (true) {
        let message = yield take(channel);
        if (typeof message === 'object') {
            message = JSON.stringify(message);
        }
        ws.send(message);
    }
}

export function* handleMessageEvent(messageEvent) {
    try {
        const parsed = JSON.parse(messageEvent.data);
        if (parsed?.type) {
            yield put(actionsByType[parsed.type](parsed.payload));
        } else {
            console.warn('Got raw message', parsed);
        }
    } catch (err) {
        console.warn('Error parsing messsage', messageEvent.data, err);
    }
}

function* wsConnection(txChannel) {
    while (true) {
        let playerId = yield select(selectPlayerId);
        if (!playerId) {
            playerId = uuidv4();
            yield put(setPlayerId({ playerId }));
        }
        const ws = new WebSocket(`${wssURL}?playerId=${playerId}`);

        const rxChannel = createWebsocketChannel(ws);

        try {
            let keepAliveTask = null;
            let txTask = null;
            let isAlive = true;

            while (isAlive) {
                const event = yield take(rxChannel);

                if (event.type === 'OPEN') {
                    console.debug('Websocket connected');
                    keepAliveTask = yield fork(keepAlive, ws);
                    txTask = yield fork(sendMessage, ws, txChannel);
                    yield put(syncRequestAction());
                } else if (event.type === 'MESSAGE') {
                    yield call(handleMessageEvent, event.messageEvent);
                } else {
                    isAlive = false;
                }
            }

            if (keepAliveTask) {
                console.debug('Websocket disconnected');
                yield cancel(keepAliveTask);
                yield cancel(txTask);
            } else {
                // Socket failed to connect. Wait before retrying
                yield delay(WebsocketFailedConnectionBackoff);
            }
        } finally {
            if (yield cancelled()) {
                rxChannel.close();
                txChannel.close();
            }
        }
    }
}

export default function* pushMessages() {
    console.debug('Starting backend ws connection');
    const txChannel = channel();
    yield fork(wsConnection, txChannel);
    yield takeEvery(
        (action) => action.type.endsWith('Request'),
        function* sendThroughWS(action) {
            yield put(txChannel, action);
        }
    );
}
