import {
  call,
  cancel,
  cancelled,
  delay,
  fork,
  put,
  take,
} from "redux-saga/effects";
import { buffers, eventChannel } from "redux-saga";
import { message } from "../reducers/gameSlice";

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
        type: "OPEN",
      });
    };

    ws.onclose = () => {
      closed = true;
      emitter({
        type: "CLOSE",
      });
    };

    ws.onmessage = (messageEvent) => {
      emitter({
        type: "MESSAGE",
        messageEvent,
      });
    };
    ws.onerror = () => {
        emitter({
            type: "ERROR"
        })
    }
    return () => {
      console.log("Cleaning up websocket", { opened, closed });
      if (opened && !closed) {
        ws.close();
      }
    };
  }, buffers.expanding());
}

function* keepAlive(ws) {
  while (true) {
    ws.send(JSON.stringify({ type: "heartbeat" }));
    yield delay(WsKeepAlivePeriod);
  }
}

export function* handleMessageEvent(messageEvent) {
  try {
    const parsed = JSON.parse(messageEvent.data);
    if (parsed?.type) {
      yield put(message(parsed.data));
    } else {
      console.warn("Got raw message", parsed);
    }
  } catch (err) {
    console.warn("Error parsing messsage", messageEvent.data, err);
  }
}

function* wsConnection() {
  while (true) {
    const ws = new WebSocket(wssURL);

    const channel = createWebsocketChannel(ws);

    try {
      let keepAliveTask = null;
      let isAlive = true;

      while (isAlive) {
        const event = yield take(channel);

        if (event.type === "OPEN") {
          console.debug("Websocket connected");
          keepAliveTask = yield fork(keepAlive, ws);
        } else if (event.type === "MESSAGE") {
          yield call(handleMessageEvent, event.messageEvent);
        } else {
          isAlive = false;
        }
      }

      if (keepAliveTask) {
        console.debug("Websocket disconnected");
        yield cancel(keepAliveTask);
      } else {
        // Socket failed to connect. Wait before retrying
        yield delay(WebsocketFailedConnectionBackoff);
      }
    } finally {
      if (yield cancelled()) {
        channel.close();
      }
    }
  }
}

export default function* pushMessages() {
    console.debug("Starting backend ws connection");
    yield fork(wsConnection);
}
