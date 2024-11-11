import { ForbiddenException } from '@nestjs/common';
import { OriginMiddleware } from 'src/infrastructure/middleware/origin.middleware';

describe('OriginMiddleware', () => {
  let middleware: OriginMiddleware;

  beforeEach(() => {
    process.env.NODE_ENV = 'production';
    process.env.WHITELISTED_ORIGINS = 'http://localhost:5001';
    middleware = new OriginMiddleware();
  });

  it('should allow a request from a whitelisted host', () => {
    const req = {
      headers: { host: 'localhost:5001' },
      get: jest.fn().mockReturnValue('http://localhost:5001'),
    } as any;
    const res = {} as any;
    const next = jest.fn();

    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should throw ForbiddenException for a non-whitelisted origin', () => {
    const req = {
      headers: { origin: 'http://non-whitelisted.com' },
      get: jest.fn().mockReturnValue('http://non-whitelisted.com'),
    } as any;
    const res = {} as any;
    const next = jest.fn();

    expect(() => middleware.use(req, res, next)).toThrow(ForbiddenException);
    expect(next).not.toHaveBeenCalled();
  });

  it('should throw ForbiddenException for an invalid origin format', () => {
    const req = {
      headers: { origin: 'invalid-origin' },
      get: jest.fn().mockReturnValue('invalid-origin'),
    } as any;
    const res = {} as any;
    const next = jest.fn();

    expect(() => middleware.use(req, res, next)).toThrow(ForbiddenException);
    expect(next).not.toHaveBeenCalled();
  });

  it('should allow a request in development mode', () => {
    process.env.NODE_ENV = 'development';
    middleware = new OriginMiddleware();

    const req = {
      headers: { origin: 'http://localhost:5001' },
      get: jest.fn().mockReturnValue('http://localhost:5001'),
    } as any;
    const res = {} as any;
    const next = jest.fn();

    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
