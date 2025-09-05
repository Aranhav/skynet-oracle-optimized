'use strict';

module.exports = {
  async index(ctx) {
    ctx.body = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
    ctx.status = 200;
  },
};
