const clients = {};

export const handleClient = async (connection, request) => {
    clients[request.id] = connection;
    connection.socket.on('message', () => {
        connection.socket.send(
            JSON.stringify({ type: 'MESSAGE', data: 'hi from server' })
        );
    });
};
