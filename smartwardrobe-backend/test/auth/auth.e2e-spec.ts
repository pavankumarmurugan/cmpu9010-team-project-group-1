import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { IDataServices } from '../../src/core/abstracts';
import { AuthController } from '../../src/infrastructure/controllers/auth/auth.controller';
import { UserDtoConvertor } from '../../src/core/convertors/user/user-dto.convertor';
import { BcryptService } from '../../src/infrastructure/frameworks/bcrypt/bcrypt.service';
import { RefreshTokenUsecase } from '../../src/use-cases/auth/refresh-token.usecase';
import { JWTDataService } from '../../src/infrastructure/frameworks/jwt/jwt.data-service';
import { LoginUsecase } from 'src/use-cases/auth/login.usecase';
import { LogoutUsecase } from 'src/use-cases/auth/logout.usecase';
import { of } from 'rxjs';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { RefreshTokenGuard } from 'src/infrastructure/guards/auth/refreshToken.guard';
import { AccessTokenGuard } from 'src/infrastructure/guards/auth/accessToken.guard';
import { ResponseStatusTextEnum } from 'src/infrastructure/common/enum.ts/responseStatus.enum';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mockDataService = {
      users: {
        get: jest.fn().mockResolvedValue({ username: 'string' }),
        getAll: jest.fn().mockResolvedValue([]),
        getAllByProperties: jest.fn().mockResolvedValue([]),
        getAllByIdsIn: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue(true),
        deleteByProperties: jest.fn().mockResolvedValue(true),
        search: jest.fn().mockResolvedValue([]),
        filter: jest.fn().mockResolvedValue([]),
        getAllPaginated: jest.fn().mockResolvedValue({ data: [], total: 0 }),
      },
      productCategory: {
        get: jest.fn().mockResolvedValue({}),
        getAll: jest.fn().mockResolvedValue([]),
      },
      productInventory: {
        get: jest.fn().mockResolvedValue({}),
        getAll: jest.fn().mockResolvedValue([]),
      },
      product: {
        get: jest.fn().mockResolvedValue({}),
        getAll: jest.fn().mockResolvedValue([]),
      },
      cartItem: {
        get: jest.fn().mockResolvedValue({}),
        getAll: jest.fn().mockResolvedValue([]),
      },
      cart: {
        get: jest.fn().mockResolvedValue({}),
        getAll: jest.fn().mockResolvedValue([]),
      },
    };

    const mockJWTDataService = {
      generateToken: jest.fn().mockResolvedValue('mockAccessToken'),
      generateRefreshToken: jest.fn().mockResolvedValue('mockRefreshToken'),
    };

    const mockLoginUsecase: Partial<LoginUsecase> = {
      login: jest.fn().mockImplementation(() => {
        return of({
          data: {
            token: 'mockToken',
            userId: 2,
            username: 'string',
            refreshToken: 'mockRefreshToken',
            role: ROLES.USER,
          },
          statusCode: {
            code: 1,
            text: ResponseStatusTextEnum.SUCCESS,
          },
          message: MESSAGES.LOGIN.SUCCESS,
        });
      }),
    };

    const mockLogoutUsecase: Partial<LogoutUsecase> = {
      logout: jest.fn().mockResolvedValue([MESSAGES.LOGOUT.SUCCESS]),
    };

    const mockRefreshTokenUsecase = {
      refreshToken: jest.fn().mockResolvedValue({
        data: {
          token: 'mockAccessToken',
          refreshToken: 'mockRefreshToken',
        },
        statusCode: {
          code: 1,
          text: ResponseStatusTextEnum.SUCCESS,
        },
        message: MESSAGES.REFRESH_TOKEN.SUCCESS,
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: IDataServices,
          useValue: mockDataService,
        },
        {
          provide: JWTDataService,
          useValue: mockJWTDataService,
        },
        {
          provide: LoginUsecase,
          useValue: mockLoginUsecase,
        },
        {
          provide: LogoutUsecase,
          useValue: mockLogoutUsecase,
        },
        {
          provide: RefreshTokenUsecase,
          useValue: mockRefreshTokenUsecase,
        },
        UserDtoConvertor,
        BcryptService,
      ],
    })
      .overrideGuard(RefreshTokenGuard)
      .useValue({
        canActivate: (context) => {
          const request = context.switchToHttp().getRequest();
          request.user = { userId: 2 };
          return true;
        },
      })
      .overrideGuard(AccessTokenGuard)
      .useValue({
        canActivate: (context) => {
          const request = context.switchToHttp().getRequest();
          request.user = { userId: 2 };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) - should successfully log in and return user data and refresh token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'string',
        password: 'string',
      })
      .expect(201);

    expect(response.body).toHaveProperty('data.token');
    expect(response.body).toHaveProperty('data.userId', 2);
    expect(response.body).toHaveProperty('data.username', 'string');
    expect(response.body).toHaveProperty('data.refreshToken');
    expect(response.body).toHaveProperty('data.role', 'user');
    expect(response.body).toHaveProperty('statusCode');
    expect(response.body.statusCode).toEqual(
      expect.objectContaining({
        code: 1,
        text: ResponseStatusTextEnum.SUCCESS,
      }),
    );
    expect(response.body).toHaveProperty('message', MESSAGES.LOGIN.SUCCESS);
  });

  it('/auth/refresh (GET) - should successfully refresh token', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'string',
        password: 'string',
      })
      .expect(201);

    const refreshToken = loginResponse.body.data.refreshToken;

    const refreshResponse = await request(app.getHttpServer())
      .get('/auth/refresh')
      .set('Authorization', `Bearer ${refreshToken}`)
      .expect(200);

    expect(refreshResponse.body).toHaveProperty('data.token');
    expect(refreshResponse.body).toHaveProperty('data.refreshToken');
    expect(refreshResponse.body).toHaveProperty('statusCode');
    expect(refreshResponse.body.statusCode).toEqual(
      expect.objectContaining({
        code: 1,
        text: ResponseStatusTextEnum.SUCCESS,
      }),
    );
    expect(refreshResponse.body).toHaveProperty(
      'message',
      MESSAGES.REFRESH_TOKEN.SUCCESS,
    );
  });

  it('/auth/logout (POST) - should successfully log out the user', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'string',
        password: 'string',
      })
      .expect(201);

    const accessToken = loginResponse.body.data.token;

    const logoutResponse = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    expect(logoutResponse.body).toHaveProperty('data', null);
    expect(logoutResponse.body).toHaveProperty(
      'message',
      MESSAGES.LOGOUT.SUCCESS,
    );
  });
});
