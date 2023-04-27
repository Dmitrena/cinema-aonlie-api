import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const CurrentUserSub = createParamDecorator(
  (data: undefined, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user;
    if (!user) return null;
    return user['sub'];
  },
);
