import Fastify from 'fastify';
import fs from 'fs/promises';
import ws from '@fastify/websocket';
import * as dotenv from 'dotenv';
import { setLogger } from './game/utils.js';

dotenv.config();

const fastify = Fastify({ logger: true });

setLogger(fastify.log);

fastify.register(ws);

const routes = await fs.readdir('./routes');
for (const route of routes) {
    const prefix = route.replace('.js', '');
    fastify.register(await import(`./routes/${route}`), { prefix });
}

await fastify.listen({ port: parseInt(process.env.PORT) });

fastify.log.info('Running');
