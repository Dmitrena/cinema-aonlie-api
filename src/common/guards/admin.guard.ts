import { User } from './../../users/schemas/user.schema';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception';
import { Reflector } from '@nestjs/core';

export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;

    if (!user.isAdmin) throw new ForbiddenException('You have no rights!');

    return user.isAdmin;
  }
}
