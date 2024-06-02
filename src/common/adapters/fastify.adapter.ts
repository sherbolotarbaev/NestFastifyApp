import { FastifyAdapter } from '@nestjs/platform-fastify';

const app: FastifyAdapter = new FastifyAdapter({
  trustProxy: true,
  logger: false,
  // forceCloseConnections: true,
});

export { app as fastifyApp };

app.getInstance().addHook('onRequest', (request, reply, done) => {
  const { origin } = request.headers;
  if (!origin) request.headers.origin = request.headers.host;

  const { url } = request;

  if (url.match(/favicon.ico$/) || url.match(/manifest.json$/))
    return reply.code(204).send();

  done();
});
