import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { IDataServices } from '../../src/core/abstracts';
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
import { UserController } from 'src/infrastructure/controllers/user/user.controller';
import { UserUsecase } from 'src/use-cases/user/user.usecase';
import { AuthController } from 'src/infrastructure/controllers/auth/auth.controller';
import { RolesGuard } from 'src/infrastructure/guards/roles/roles.guard';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mockDataService = {
      users: {
        get: jest.fn().mockResolvedValue({}),
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

    const mockUserUsecase: Partial<UserUsecase> = {
      getMyProfile: jest.fn().mockImplementation(() => {
        return of({
          data: {
            firstname: 'string',
            lastname: 'string',
            username: 'string',
            userId: 2,
            role: ROLES.USER,
            email: null,
            dob: null,
          },
          statusCode: {
            code: 1,
            text: 'Success',
          },
          message: 'SUCCESSFULLY FETCHED USER',
        });
      }),
    };

    const mockLogoutUsecase: Partial<LogoutUsecase> = {
      logout: jest.fn().mockResolvedValue([MESSAGES.LOGOUT.SUCCESS]),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController, AuthController],
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
          provide: RefreshTokenUsecase,
          useValue: mockRefreshTokenUsecase,
        },
        {
          provide: UserUsecase,
          useValue: mockUserUsecase,
        },
        {
          provide: LogoutUsecase,
          useValue: mockLogoutUsecase,
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
          request.user = { userId: 2, role: ROLES.USER };
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: (context) => {
          const request = context.switchToHttp().getRequest();
          const userRole = request.user.role;
          return [ROLES.ADMIN, ROLES.OWNER, ROLES.USER].includes(userRole); // Simulate role check
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return the user profile when authenticated', async () => {
    try {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'string',
          password: 'string',
        })
        .expect(201);

      const accessToken = loginResponse.body.data.token;

      const response = await request(app.getHttpServer())
        .get('/users/get-my-profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('firstname', 'string');
      expect(response.body.data).toHaveProperty('lastname', 'string');
      expect(response.body.data).toHaveProperty('username', 'string');
      expect(response.body.data).toHaveProperty('userId', 2);
      expect(response.body.data).toHaveProperty('role', ROLES.USER);
      expect(response.body.data).toHaveProperty('email', null);
      expect(response.body.data).toHaveProperty('dob', null);

      // Check the statusCode and message properties
      expect(response.body).toHaveProperty('statusCode.code', 1);
      expect(response.body).toHaveProperty('statusCode.text', 'Success');
      expect(response.body).toHaveProperty(
        'message',
        MESSAGES.USER.GET.SUCCESS,
      );
    } catch (error) {
      console.error('Test Error:', error);
      throw error;
    }
  });
});
