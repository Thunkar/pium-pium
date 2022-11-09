import { processMessage, seatPlayer } from '../game/sequencer.js';

const clients = {};

export const handleClient = async (connection, request) => {
    const playerId = request.query.playerId;
    clients[playerId] = connection;
    connection.socket.on('message', (message) => {
        processMessage(message, playerId);
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
