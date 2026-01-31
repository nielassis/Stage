import { compare } from 'bcryptjs';
import { prisma } from '../../config/prisma';

import { sign } from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../../utils/error';
import { loginDTO } from './types';

export async function login(dto: loginDTO) {
  const { email, password } = dto;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError('Credenciais inválidas', 401);
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    throw new AppError('Credenciais inválidas', 401);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      updatedAt: new Date(),
    },
  });
  const payload = {
    userId: user.id,
    tenantId: user.tenantId,
    role: user.role,
  };

  const token = sign(payload, env.JWT_SECRET, {
    expiresIn: '7d',
    algorithm: 'HS256',
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
    },
  };
}
