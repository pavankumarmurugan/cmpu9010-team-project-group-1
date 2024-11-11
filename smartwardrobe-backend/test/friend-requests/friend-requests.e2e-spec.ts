import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import request from 'supertest';

import { ControllersModule } from 'src/infrastructure/controllers/controllers.module';
import { SQLDataServiceModule } from 'src/infrastructure/frameworks/data-services/sql-data-services.module';
import { UserModel } from 'src/infrastructure/frameworks/data-services/model/user.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemModel } from 'src/infrastructure/frameworks/data-services/model/cart-items.model';
import { CartModel } from 'src/infrastructure/frameworks/data-services/model/cart.model';
import { ChatModel } from 'src/infrastructure/frameworks/data-services/model/chat.model';
import { FriendsRequestsModel } from 'src/infrastructure/frameworks/data-services/model/friend-request.model';
import { FriendsModel } from 'src/infrastructure/frameworks/data-services/model/friends.model';
import { ImageClusterModel } from 'src/infrastructure/frameworks/data-services/model/image-clusters.model';
import { LikesModel } from 'src/infrastructure/frameworks/data-services/model/likes.model';
import { ProductCategoryModel } from 'src/infrastructure/frameworks/data-services/model/product-category.model';
import { ProductInventoryModel } from 'src/infrastructure/frameworks/data-services/model/product-inventory.model';
import { ProductModel } from 'src/infrastructure/frameworks/data-services/model/product.model';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';

describe('FriendRequestsController (e2e)', () => {
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
          password: process.env.DATABASE_PASSWORD,
          ssl: true,
          extra: { ssl: { rejectUnauthorized: false } },
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
        }),
        JwtModule.register({}),
        SQLDataServiceModule,
        ControllersModule,
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
      .send({ username: 'string', password: 'string' })
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

  it('/friend-requests/create (POST) - should create a friend request', async () => {
    const createDto = {
      receiverId: 141,
      status: 'pending',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/friend-requests/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Content-Type', 'application/json')
      .send(createDto)
      .expect(201);

    expect(createResponse.body).toHaveProperty('data');
    expect(createResponse.body.data).toHaveProperty(
      'receiverId',
      createDto.receiverId,
    );
    expect(createResponse.body.data).toHaveProperty('status', createDto.status);
    expect(createResponse.body.data).toHaveProperty('senderId');
    expect(createResponse.body.data).toHaveProperty('requestId');

    expect(typeof createResponse.body.data.senderId).toBe('number');
    expect(typeof createResponse.body.data.requestId).toBe('number');

    const requestId = createResponse.body.data.requestId;

    // Step 2: Accept the created friend request using the requestId
    const updateDto = {
      requestId,
    };

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'admin',
      })
      .expect(201);

    const adminAccessToken = loginResponse.body.data.token;

    const updateResponse = await request(app.getHttpServer())
      .patch('/friend-requests/update')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .set('Content-Type', 'application/json')
      .send(updateDto)
      .expect(200);

    expect(updateResponse.body).toHaveProperty('data', null);

    // Step 3: Retrieve friends to confirm the friendship was added
    const getFriendsResponse = await request(app.getHttpServer())
      .get('/friends/get-all-my-friends')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    // Validate the friends list includes the new friend
    expect(getFriendsResponse.body).toHaveProperty('data');
    const friends = getFriendsResponse.body.data;
    const friend = friends.find((f) => f.userId === createDto.receiverId);
    const friendId = friend.friendId;

    // Step 4: Delete the friend relationship
    const deleteFriendResponse = await request(app.getHttpServer())
      .delete(`/friends/delete/${friendId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    // Validate the friend deletion response
    expect(deleteFriendResponse.body).toHaveProperty('data', null);
  });

  it('/friend-requests/get-all-my-received-requests (GET) - should retrieve all received friend requests for the user', async () => {
    const response = await request(app.getHttpServer())
      .get('/friend-requests/get-all-my-received-requests')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    // Validate the response structure
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);

    // Check each friend request object in the response
    response.body.data.forEach((request) => {
      expect(request).toHaveProperty('requestId');
      expect(request).toHaveProperty('senderId');
      expect(request).toHaveProperty('receiverId');
      expect(request).toHaveProperty('status');
      expect(request).toHaveProperty('createdAt');
      expect(request).toHaveProperty('updatedAt');

      // Validate types for specific fields
      expect(typeof request.requestId).toBe('number');
      expect(typeof request.senderId).toBe('number');
      expect(typeof request.receiverId).toBe('number');
      expect(request.status).toBe('pending');
      expect(typeof request.createdAt).toBe('string');
      if (request.updatedAt !== null) {
        expect(typeof request.updatedAt).toBe('string');
      }

      // Validate nested user object in the response
      expect(request).toHaveProperty('user');
      const user = request.user;
      expect(user).toHaveProperty('firstname');
      expect(user).toHaveProperty('lastname');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('userId');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('profilePic');

      // Check types for user fields
      expect(typeof user.firstname).toBe('string');
      expect(typeof user.lastname).toBe('string');
      expect(typeof user.username).toBe('string');
      expect(typeof user.userId).toBe('number');
      expect(typeof user.role).toBe('string');
      if (user.profilePic !== null) {
        expect(typeof user.profilePic).toBe('string');
      }
    });
  });

  it('/friend-requests/delete/${requestId} (DELETE) - should delete a friend request', async () => {
    const createDto = {
      receiverId: 141,
      status: 'pending',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/friend-requests/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Content-Type', 'application/json')
      .send(createDto)
      .expect(201);

    expect(createResponse.body).toHaveProperty('data');
    expect(createResponse.body.data).toHaveProperty(
      'receiverId',
      createDto.receiverId,
    );
    expect(createResponse.body.data).toHaveProperty('status', createDto.status);
    expect(createResponse.body.data).toHaveProperty('senderId');
    expect(createResponse.body.data).toHaveProperty('requestId');

    expect(typeof createResponse.body.data.senderId).toBe('number');
    expect(typeof createResponse.body.data.requestId).toBe('number');

    const requestId = createResponse.body.data.requestId;

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/friend-requests/delete/${requestId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(deleteResponse.body).toHaveProperty('data', null);
  });

  it('/friend-requests/create (POST) - should throw an error for duplicate friend request and delete afterward', async () => {
    const createDto = { receiverId: 141, status: 'pending' };

    // First friend request creation should succeed
    const initialCreateResponse = await request(app.getHttpServer())
      .post('/friend-requests/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Content-Type', 'application/json')
      .send(createDto)
      .expect(201);

    expect(initialCreateResponse.body).toHaveProperty('data');
    const requestId = initialCreateResponse.body.data.requestId;

    // Attempt to create a duplicate friend request
    const duplicateResponse = await request(app.getHttpServer())
      .post('/friend-requests/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Content-Type', 'application/json')
      .send(createDto)
      .expect(409);

    expect(duplicateResponse.body.message).toBe(
      MESSAGES.FRIEND_REQUEST.CREATE.ALREADY,
    );

    // Clean up: Delete the original friend request
    const deleteResponse = await request(app.getHttpServer())
      .delete(`/friend-requests/delete/${requestId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    // Validate the friend request deletion response
    expect(deleteResponse.body).toHaveProperty('data', null);
  });
});
