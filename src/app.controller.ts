import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';

import type { FastifyReply } from 'fastify';

@Controller()
export class AppController {
  @Get()
  @HttpCode(HttpStatus.OK)
  async main(@Res() response: FastifyReply) {
    return response.status(HttpStatus.OK).send({
      message: 'success',
    });
  }
}
