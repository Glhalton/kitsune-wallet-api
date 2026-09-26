import { ValidationPipe } from '@nestjs/common';

/**
 * The single ValidationPipe configuration used by the app and by DTO specs.
 *
 * `whitelist` strips undeclared properties and `forbidNonWhitelisted` turns
 * them into a 400, so a body can never smuggle columns such as `id` or
 * `createdAt` into a Prisma write.
 */
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: false },
  });
}