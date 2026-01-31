// src/scripts/seed.ts
import { prisma } from '../config/prisma';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcryptjs';

async function main() {
  console.log('🌱 Iniciando seed do banco...');

  // Criar tenant
  const tenant = await prisma.tenant.upsert({
    where: { email: 'tenant@stage.app' },
    update: {},
    create: {
      id: uuidv4(),
      name: 'Stage Tenant',
      email: 'tenant@stage.app',
      status: 'ACTIVE',
      cnpj: '12345678000199',
    },
  });

  // Senhas
  const adminPassword = 'granpixstage2026';

  const hashedAdminPassword = await hash(adminPassword, 10);

  // Usuário Admin
  const adminEmail = 'admin@stage.app';
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedAdminPassword },
    create: {
      id: uuidv4(),
      email: adminEmail,
      password: hashedAdminPassword,
      name: 'Admin Stage',
      createdAt: new Date(),
      role: 'ADMIN',
      tenantId: tenant.id,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
