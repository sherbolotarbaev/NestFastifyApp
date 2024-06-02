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

  const { url, method, routerPath } = request;

  const ip =
    request.headers['x-real-ip'] ||
    request.headers['x-forwarded-for'] ||
    request.socket.remoteAddress ||
    '';
  const ipAddress = Array.isArray(ip) ? ip[0] : ip;

  if (url.match(/favicon.ico$/) || url.match(/manifest.json$/))
    return reply.code(204).send();

  console.log(
    `--- [REQUEST] ---
IP: ${ipAddress}
METHOD: ${method}
PATH: ${routerPath}
DATE: ${new Date()}
-----------------`,
  );

  done();
});
