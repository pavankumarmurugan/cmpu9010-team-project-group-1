import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SQLDataServiceModule } from '../../src/infrastructure/frameworks/data-services/sql-data-services.module';
import { ControllersModule } from '../../src/infrastructure/controllers/controllers.module';

import { BcryptService } from '../../src/infrastructure/frameworks/bcrypt/bcrypt.service';
import { UserDtoConvertor } from '../../src/core/convertors/user/user-dto.convertor';
import { CartItemModel } from 'src/infrastructure/frameworks/data-services/model/cart-items.model';
import { CartModel } from 'src/infrastructure/frameworks/data-services/model/cart.model';
import { ProductCategoryModel } from 'src/infrastructure/frameworks/data-services/model/product-category.model';
import { ProductInventoryModel } from 'src/infrastructure/frameworks/data-services/model/product-inventory.model';
import { ProductModel } from 'src/infrastructure/frameworks/data-services/model/product.model';
import { UserModel } from 'src/infrastructure/frameworks/data-services/model/user.model';
import { RefreshTokenGuard } from 'src/infrastructure/guards/auth/refreshToken.guard';
import { RefreshTokenUpdateInterceptor } from 'src/infrastructure/interceptors/refresh-token-update.interceptor';
import { DataSource } from 'typeorm';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({}),

        ConfigModule.forRoot({}),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: +process.env.DATABASE_PORT,
          username: process.env.DATABASE_USERNAME,
          database: process.env.DATABASE_NAME,
          entities: [
            UserModel,
            ProductCategoryModel,
            ProductInventoryModel,
            ProductModel,
            CartItemModel,
            CartModel,
          ],
          password: process.env.DATABASE_PASSWORD,
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
        }),
        TypeOrmModule.forFeature([
          UserModel,
          ProductCategoryModel,
          ProductInventoryModel,
          ProductModel,
          CartItemModel,
          CartModel,
        ]),
        JwtModule.register({}),
        SQLDataServiceModule,
        ControllersModule,
      ],
      providers: [
        RefreshTokenUpdateInterceptor,
        RefreshTokenGuard,
        BcryptService,
        UserDtoConvertor,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);

    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    await app.init();
  });

  beforeEach(async () => {
    await dataSource.query('BEGIN');
  });

  afterEach(async () => {
    await dataSource.query('ROLLBACK');
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
    if (app) {
      await app.close();
    }
  });

  describe('Authentication', () => {
    it('/auth/login (POST) - should login successfully with valid credentials', async () => {
      const loginCredentials = {
        username: 'string',
        password: 'string',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginCredentials)
        .expect(201);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data).toHaveProperty('userId');
      expect(response.body.data).toHaveProperty(
        'username',
        loginCredentials.username,
      );
      expect(response.body.data).toHaveProperty('role');
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
});
