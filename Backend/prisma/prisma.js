const { PrismaClient } = require('../src/generated/prisma');
const { withAccelerate } = require('../node_modules/@prisma/extension-accelerate');

let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // (Opional logging)
  }).$extends(withAccelerate());
}

prisma = global.prisma;

module.exports = prisma;
