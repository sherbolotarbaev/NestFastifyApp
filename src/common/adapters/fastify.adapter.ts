import { Logger } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { userAgent } from '~/utils/user-agent';

const app: FastifyAdapter = new FastifyAdapter({
  trustProxy: true,
  // logger: {
  //   level: 'debug',
  // },
  // forceCloseConnections: true,
});

export { app as fastifyApp };

app.getInstance().addHook('onRequest', (request, reply, done) => {
  const { origin } = request.headers;
  if (!origin) request.headers.origin = request.headers.host;

  const { url } = request;

  if (url.match(/favicon.ico$/) || url.match(/manifest.json$/)) {
    reply.code(204).send();
    return;
  }

  request['startTime'] = Date.now();

  done();
});

app.getInstance().addHook('onResponse', (request, reply, done) => {
  const responseTime = Date.now() - request['startTime'] || 0;
  const { method, originalUrl, headers } = request;
  const { statusCode } = reply;
  const ip =
    request.headers['x-real-ip'] ||
    request.headers['x-forwarded-for'] ||
    request.socket.remoteAddress ||
    '';
  const ipAddress = Array.isArray(ip) ? ip[0] : ip;

  const ua = userAgent({ headers });

  const logger = new Logger(ipAddress);
  logger.log(
    `${method} ${originalUrl} ${statusCode} ${responseTime}ms | ${ua.os.name} ${ua.os.version} | Bot: ${ua.isBot}`,
  );

  done();
});
