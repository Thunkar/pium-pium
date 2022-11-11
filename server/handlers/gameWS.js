import { processMessage, seatPlayer, unseatPlayer } from '../game/sequencer.js';

const clients = {};

export const handleClient = async (connection, request) => {
    const playerId = request.query.playerId;
    clients[playerId] = connection;
    connection.socket.on('message', (message) => {
        processMessage(message, playerId);
    });
    connection.socket.on('close', () => {
        delete clients[playerId];
        unseatPlayer(playerId);
    });
    seatPlayer(playerId);
};

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
