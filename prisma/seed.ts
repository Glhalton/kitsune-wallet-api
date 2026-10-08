import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const admin = {
  name: 'Admin',
  email: 'admin@admin.com',
  password: 'admin',
};

const documentTypes = [
  { name: 'RG', description: 'Registro Geral' },
  { name: 'CNH', description: 'Carteira Nacional de Habilitação' },
  { name: 'Título de eleitor', description: 'Título eleitoral' },
];

/**
 * Safe to run repeatedly: rows that already exist are left untouched, so a
 * password changed after the first run is not reset.
 */
async function main() {
  const user = await prisma.user.upsert({
    where: { email: admin.email },
    update: {},
    create: {
      name: admin.name,
      email: admin.email,
      password: await bcrypt.hash(admin.password, 10),
    },
  });
  console.log(`Usuário: ${user.email} (id ${user.id})`);

  for (const documentType of documentTypes) {
    await prisma.documentType.upsert({
      where: { name: documentType.name },
      update: {},
      create: documentType,
    });
  }
  console.log(`Tipos de documento: ${documentTypes.length}`);
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
