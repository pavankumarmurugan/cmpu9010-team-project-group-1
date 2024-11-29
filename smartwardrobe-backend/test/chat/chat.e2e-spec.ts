import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControllersModule } from 'src/infrastructure/controllers/controllers.module';
import { CartItemModel } from 'src/infrastructure/frameworks/data-services/model/cart-items.model';
import { CartModel } from 'src/infrastructure/frameworks/data-services/model/cart.model';
import { ProductCategoryModel } from 'src/infrastructure/frameworks/data-services/model/product-category.model';
import { ProductInventoryModel } from 'src/infrastructure/frameworks/data-services/model/product-inventory.model';
import { ProductModel } from 'src/infrastructure/frameworks/data-services/model/product.model';
import { UserModel } from 'src/infrastructure/frameworks/data-services/model/user.model';
import { SQLDataServiceModule } from 'src/infrastructure/frameworks/data-services/sql-data-services.module';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { ChatModel } from 'src/infrastructure/frameworks/data-services/model/chat.model';
import { FriendsRequestsModel } from 'src/infrastructure/frameworks/data-services/model/friend-request.model';
import { FriendsModel } from 'src/infrastructure/frameworks/data-services/model/friends.model';
import { ImageClusterModel } from 'src/infrastructure/frameworks/data-services/model/image-clusters.model';
import { LikesModel } from 'src/infrastructure/frameworks/data-services/model/likes.model';
import { GroupMembersModel } from 'src/infrastructure/frameworks/data-services/model/group-members.model';
import { GroupModel } from 'src/infrastructure/frameworks/data-services/model/group.model';
import { ProductSubcategoryModel } from 'src/infrastructure/frameworks/data-services/model/product-subcategory.model';
import { UserLikedModels } from 'src/infrastructure/frameworks/data-services/model/user-liked-models';
import { VtoImageSearchModel } from 'src/infrastructure/frameworks/data-services/model/vto.model';

describe('ChatController (e2e)', () => {
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
            GroupModel,
            GroupMembersModel,
            VtoImageSearchModel,
            UserLikedModels,
            ProductSubcategoryModel,
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

  it('should create, update, and delete a chat message with a friend', async () => {
    const friendId = 141;

    const createMessageDto = {
      receiverId: friendId,
      message: 'Hello, how are you?',
      messageType: 'text',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/chat/create/send-message-to-friend')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Content-Type', 'application/json')
      .send(createMessageDto)
      .expect(201);

    expect(createResponse.body).toHaveProperty('data');
    const messageData = createResponse.body.data;
    const messageId = messageData.id;

    expect(messageData).toHaveProperty(
      'receiverId',
      createMessageDto.receiverId,
    );
    expect(messageData).toHaveProperty('message', createMessageDto.message);
    expect(messageData).toHaveProperty(
      'messageType',
      createMessageDto.messageType,
    );

    const updateMessageDto = {
      id: messageId,
      message: 'Okay?',
    };

    const updateResponse = await request(app.getHttpServer())
      .patch('/chat/update')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Content-Type', 'application/json')
      .send(updateMessageDto)
      .expect(200);

    expect(updateResponse.body).toHaveProperty('data', null);

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/chat/delete/${messageId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(deleteResponse.body).toHaveProperty('data', null);
  });

  it('/chat/get-all-my-chats-by-friend-id/:friendId (GET) - should retrieve all chat messages between user and friend', async () => {
    const friendId = 141;

    const getChatsResponse = await request(app.getHttpServer())
      .get(`/chat/get-all-my-chats-by-friend-id/${friendId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(getChatsResponse.body).toHaveProperty('data');
    const chats = getChatsResponse.body.data;
    expect(Array.isArray(chats)).toBe(true);
    expect(chats.length).toBeGreaterThan(0);

    chats.forEach((chat) => {
      expect(chat).toHaveProperty('senderId');
      expect(chat).toHaveProperty('receiverId', friendId);
      expect(chat).toHaveProperty('message');
      expect(chat).toHaveProperty('messageType');
      expect(chat).toHaveProperty('createdAt');
      expect(chat).toHaveProperty('groupId');
    });
  });

  it('/chat/get-one/:id (GET) - should retrieve a single chat message by ID', async () => {
    const messageId = 191;

    const response = await request(app.getHttpServer())
      .get(`/chat/get-one/${messageId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    const chatData = response.body.data;

    expect(chatData).toHaveProperty('id', messageId);
    expect(chatData).toHaveProperty('senderId');
    expect(chatData).toHaveProperty('receiverId');
    expect(chatData).toHaveProperty('message', 'Okay?');
    expect(chatData).toHaveProperty('messageType', 'text');
    expect(chatData).toHaveProperty('createdAt');
    expect(chatData).toHaveProperty('updatedAt');
    expect(chatData).toHaveProperty('groupId');
  });

  it('should send a message to a group', async () => {
    const sendMessageDto = {
      message: 'Hello, how are you?',
      messageType: 'text',
      groupId: 22,
    };

    const createResponse = await request(app.getHttpServer())
      .post('/chat/create/send-message-to-group')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Content-Type', 'application/json')
      .send(sendMessageDto)
      .expect(201);

    expect(createResponse.body).toHaveProperty('data');
    const messageData = createResponse.body.data;

    expect(messageData).toHaveProperty('message', sendMessageDto.message);
    expect(messageData).toHaveProperty(
      'messageType',
      sendMessageDto.messageType,
    );
    expect(messageData).toHaveProperty('groupId', sendMessageDto.groupId);
    expect(messageData).toHaveProperty('senderId');
    expect(messageData).toHaveProperty('receiverId', null);
    expect(messageData).toHaveProperty('id');

    const messageId = createResponse.body.data.id;

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/chat/delete/${messageId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(deleteResponse.body).toHaveProperty('data', null);
  });

  it('/chat/get-all-my-chats-by-group-id/:groupId (GET) - should retrieve all messages in the specified group', async () => {
    const groupId = 22;

    const response = await request(app.getHttpServer())
      .get(`/chat/get-all-my-chats-by-group-id/${groupId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    const chats = response.body.data;

    expect(Array.isArray(chats)).toBe(true);
    expect(chats.length).toBeGreaterThan(0);

    chats.forEach((chat) => {
      expect(chat).toHaveProperty('id');
      expect(chat).toHaveProperty('senderId');
      expect(chat).toHaveProperty('receiverId', null);
      expect(chat).toHaveProperty('message');
      expect(chat).toHaveProperty('messageType');
      expect(chat).toHaveProperty('groupId', groupId);
      expect(chat).toHaveProperty('createdAt');
      expect(chat).toHaveProperty('updatedAt');
      expect(chat).toHaveProperty('userDetails');

      const userDetails = chat.userDetails;
      expect(userDetails).toHaveProperty('firstname');
      expect(userDetails).toHaveProperty('lastname');
      expect(userDetails).toHaveProperty('username');
      expect(userDetails).toHaveProperty('userId');
      expect(userDetails).toHaveProperty('role');
      expect(userDetails).toHaveProperty('profilePic');

      if (userDetails.profilePic) {
        expect(typeof userDetails.profilePic).toBe('string');
      } else {
        expect(userDetails.profilePic).toBeNull();
      }
    });
  });
});
