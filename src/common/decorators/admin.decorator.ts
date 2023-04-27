import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';

type TypeRole = 'admin' | 'user' | undefined;

export const AdminDecorator = (role: TypeRole = 'user') =>
  applyDecorators(role == 'admin' ? UseGuards(AdminGuard) : UseGuards());
