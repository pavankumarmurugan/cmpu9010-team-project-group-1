import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { UserDtoConvertor } from '../../src/core/convertors/user/user-dto.convertor';
import { BcryptService } from '../../src/infrastructure/frameworks/bcrypt/bcrypt.service';
import { RefreshTokenGuard } from 'src/infrastructure/guards/auth/refreshToken.guard';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ControllersModule } from 'src/infrastructure/controllers/controllers.module';
import { CartItemModel } from 'src/infrastructure/frameworks/data-services/model/cart-items.model';
import { CartModel } from 'src/infrastructure/frameworks/data-services/model/cart.model';
import { ProductCategoryModel } from 'src/infrastructure/frameworks/data-services/model/product-category.model';
import { ProductInventoryModel } from 'src/infrastructure/frameworks/data-services/model/product-inventory.model';
import { ProductModel } from 'src/infrastructure/frameworks/data-services/model/product.model';
import { UserModel } from 'src/infrastructure/frameworks/data-services/model/user.model';
import { SQLDataServiceModule } from 'src/infrastructure/frameworks/data-services/sql-data-services.module';
import { RefreshTokenUpdateInterceptor } from 'src/infrastructure/interceptors/refresh-token-update.interceptor';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { ChatModel } from 'src/infrastructure/frameworks/data-services/model/chat.model';
import { FriendsRequestsModel } from 'src/infrastructure/frameworks/data-services/model/friend-request.model';
import { FriendsModel } from 'src/infrastructure/frameworks/data-services/model/friends.model';
import { ImageClusterModel } from 'src/infrastructure/frameworks/data-services/model/image-clusters.model';
import { LikesModel } from 'src/infrastructure/frameworks/data-services/model/likes.model';
import { v4 as uuid } from 'uuid';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let accessToken: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
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
            LikesModel,
            ChatModel,
            ImageClusterModel,
            FriendsRequestsModel,
            FriendsModel,
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
          LikesModel,
          ChatModel,
          ImageClusterModel,
          FriendsRequestsModel,
          FriendsModel,
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

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'string',
        password: 'string',
      })
      .expect(201);

    accessToken = loginResponse.body.data.token;
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

  it('/users/get-my-profile (GET) should return the user profile when authenticated', async () => {
    try {
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
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).toHaveProperty('dob');
    } catch (error) {
      console.error('Test Error:', error);
      throw error;
    }
  });

  it('/users/update-password (PATCH) should update the user password when authenticated', async () => {
    try {
      await request(app.getHttpServer())
        .patch('/users/update-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          password: 'string',
        })
        .expect(200);
    } catch (error) {
      console.error('Test Error:', error);
      throw error;
    }
  });

  it('/users/update (PATCH) should update the user profile when authenticated', async () => {
    try {
      await request(app.getHttpServer())
        .patch('/users/update')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          firstname: 'string',
          lastname: 'string',
          email: 'test@gmail.com',
        })
        .expect(200);
    } catch (error) {
      console.error('Test Error:', error);
      throw error;
    }
  });

  it('/users/search/:query (GET) - should search for users by query string', async () => {
    const query = 'str';

    const response = await request(app.getHttpServer())
      .get(`/users/search/${query}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);

    response.body.data.forEach((user) => {
      expect(user).toHaveProperty('firstname');
      expect(user).toHaveProperty('lastname');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('userId');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('profilePic');

      expect(typeof user.firstname).toBe('string');
      expect(typeof user.lastname).toBe('string');
      expect(typeof user.username).toBe('string');
      expect(typeof user.userId).toBe('number');
      expect(user.role).toBe('user');

      if (user.profilePic) {
        expect(typeof user.profilePic).toBe('string');
      } else {
        expect(user.profilePic).toBeNull();
      }
    });
  });

  it('/users/create (POST) - should create a new user and return user details', async () => {
    const newUser = {
      username: uuid(),
      firstname: 'TestFirstName',
      lastname: 'TestLastName',
      password: 'TestPassword',
      role: 'user',
    };

    const response = await request(app.getHttpServer())
      .post('/users/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newUser)
      .expect(201);

    expect(response.body).toHaveProperty('data');

    const userData = response.body.data;
    expect(userData).toHaveProperty('firstname', newUser.firstname);
    expect(userData).toHaveProperty('lastname', newUser.lastname);
    expect(userData).toHaveProperty('username', newUser.username);
    expect(userData).toHaveProperty('userId');
    expect(typeof userData.userId).toBe('number');
    expect(userData).toHaveProperty('refreshToken');
    expect(userData).toHaveProperty('token');

    expect(typeof userData.refreshToken).toBe('string');
    expect(typeof userData.token).toBe('string');

    const createdUserId = userData.userId;

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'admin',
      })
      .expect(201);

    const adminAccessToken = loginResponse.body.data.token;

    await request(app.getHttpServer())
      .delete(`/users/delete/${createdUserId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);
  });
});
