import { seatPlayerAction, unseatPlayerAction } from 'pium-pium-engine';
import store from '../game/store.js';

const clients = {};

export const send = (playerId, message) => {
    if (typeof message === 'object') {
        message = JSON.stringify(message);
    }
    clients[playerId].socket.send(message);
};

export const broadcast = (message) => {
    for (const playerId in clients) {
        clients[playerId].socket.send(message);
    }
};

export const serverDispatch = async (action) => {
    store.dispatch(action);
    broadcast(JSON.stringify(action));
};

export const processMessage = (message, playerId) => {
    const JSONAction = JSON.parse(message.toString());
    JSONAction.payload = JSONAction.payload
        ? { ...JSONAction.payload, playerId }
        : { playerId };
    store.dispatch(JSONAction);
};

export const handleClient = async (connection, request) => {
    const playerId = request.query.playerId;
    clients[playerId] = connection;
    connection.socket.on('message', (message) => {
        processMessage(message, playerId);
    });
    connection.socket.on('close', () => {
        delete clients[playerId];
        store.dispatch(unseatPlayerAction({ playerId }));
    });
    store.dispatch(seatPlayerAction({ playerId }));
};
