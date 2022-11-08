import { handleClient } from '../handlers/gameWS.js';

export default function (fastify, _, done) {
    fastify.get('/', { websocket: true }, handleClient);
    done();
}
