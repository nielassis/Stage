import {
  PrismaClient,
  TenantStatus,
  UserRole,
  DocumentType,
  OsStatus,
  OsStageStatus,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seed do banco de dados...');

  // 1. Criar o Tenant da WS Comunicação
  const wsTenant = await prisma.tenant.upsert({
    where: { name: 'WS Comunicação' },
    update: {},
    create: {
      name: 'WS Comunicação',
      email: 'contato@wscomunicacao.com.br', // Email mais adequado para o tenant
      status: TenantStatus.ACTIVE,
      cnpj: '08.378.712/0001-50',
    },
  });
  console.log(`Tenant criado: ${wsTenant.name} (ID: ${wsTenant.id})`);

  // 2. Criar um usuário ADMIN para o Tenant da WS Comunicação
  const adminPassword = await bcrypt.hash('Admin@123', 10); // Senha segura para o admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@wscomunicacao.com.br' },
    update: {},
    create: {
      name: 'WS Admin',
      email: 'admin@wscomunicacao.com.br',
      password: adminPassword,
      role: UserRole.ADMIN,
      tenantId: wsTenant.id,
    },
  });
  console.log(`Usuário ADMIN criado: ${adminUser.name} (ID: ${adminUser.id})`);

  // 3. Criar usuários COLLABORATOR para o Tenant da WS Comunicação
  const collaboratorPassword = await bcrypt.hash('Colab@123', 10);
  const collaborators = [];
  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: collaboratorPassword,
        role: UserRole.COLLABORATOR,
        tenantId: wsTenant.id,
      },
    });
    collaborators.push(user);
  }
  console.log(`Criados ${collaborators.length} usuários COLLABORATOR.`);

  // 4. Criar Clientes para o Tenant da WS Comunicação
  const customers = [];
  for (let i = 0; i < 50; i++) {
    // Criar 50 clientes
    const customer = await prisma.customer.create({
      data: {
        tenantId: wsTenant.id,
        name: faker.company.name(),
        email: faker.internet.email(),
        document: faker.number
          .int({ min: 10000000000, max: 99999999999 })
          .toString(), // Simula CPF ou CNPJ simples
        documentType: i % 2 === 0 ? DocumentType.CPF : DocumentType.CNPJ, // Alterna entre CPF e CNPJ
      },
    });
    customers.push(customer);
  }
  console.log(`Criados ${customers.length} clientes.`);

  // 5. Criar Ordens de Serviço (OS) e Etapas de OS para cada cliente
  for (const customer of customers) {
    const numOs = faker.number.int({ min: 1, max: 5 }); // Cada cliente terá entre 1 e 5 OSs
    for (let i = 0; i < numOs; i++) {
      const responsible =
        collaborators[
          faker.number.int({ min: 0, max: collaborators.length - 1 })
        ];
      const os = await prisma.os.create({
        data: {
          customerId: customer.id,
          tenantId: wsTenant.id,
          responsibleId: responsible.id,
          name: `OS para ${customer.name} - ${faker.commerce.productName()}`,
          description: faker.commerce.productDescription(),
          amountCents: faker.number.int({ min: 10000, max: 10000000 }), // Valor entre R$100.00 e R$100,000.00
          status: faker.helpers.arrayElement([
            OsStatus.IN_PROGRESS,
            OsStatus.CLOSED,
            OsStatus.CANCELLED,
          ]),
          users: {
            connect: [
              { id: responsible.id },
              {
                id: collaborators[
                  faker.number.int({ min: 0, max: collaborators.length - 1 })
                ].id,
              },
            ],
          },
        },
      });

      // Criar etapas para cada OS
      const numStages = faker.number.int({ min: 2, max: 4 }); // Cada OS terá entre 2 e 4 etapas
      for (let j = 0; j < numStages; j++) {
        await prisma.osStage.create({
          data: {
            osId: os.id,
            tenantId: wsTenant.id,
            name: `Etapa ${j + 1}: ${faker.lorem.words(2)}`,
            description: faker.lorem.sentence(),
            status: faker.helpers.arrayElement([
              OsStageStatus.OPEN,
              OsStageStatus.PENDING_APPROVAL,
              OsStageStatus.COMPLETED,
            ]),
            notes: faker.lorem.paragraph(),
            approvedBy:
              j === numStages - 1 && os.status === OsStatus.CLOSED
                ? adminUser.id
                : null, // A última etapa pode ser aprovada se a OS estiver fechada
            approvedAt:
              j === numStages - 1 && os.status === OsStatus.CLOSED
                ? faker.date.recent()
                : null,
          },
        });
      }
    }
  }
  console.log(`Criadas Ordens de Serviço e suas etapas.`);

  console.log('Seed do banco de dados concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
