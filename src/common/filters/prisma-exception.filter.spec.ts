import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaExceptionFilter } from './prisma-exception.filter.js';

describe('PrismaExceptionFilter', () => {
  let filter: PrismaExceptionFilter;
  let response: {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
  };
  let host: ArgumentsHost;

  const knownRequestError = (code: string) =>
    new Prisma.PrismaClientKnownRequestError('database error', {
      code,
      clientVersion: '7.10.0',
    });

  beforeEach(() => {
    filter = new PrismaExceptionFilter();
    response = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    host = {
      switchToHttp: () => ({ getResponse: () => response }),
    } as unknown as ArgumentsHost;
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('maps P2025 to 404', () => {
    filter.catch(knownRequestError('P2025'), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Registro não encontrado',
    });
  });

  it('maps P2002 to 409', () => {
    filter.catch(knownRequestError('P2002'), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
  });

  it('maps P2003 to 400', () => {
    filter.catch(knownRequestError('P2003'), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
  });

  it('maps unknown codes to 500', () => {
    filter.catch(knownRequestError('P1001'), host);

    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });
});