export default function (fastify, _, done) {
    fastify.get('/', async (request, reply) => 'potato');
    done();
}
