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
import { GroupModel } from 'src/infrastructure/frameworks/data-services/model/group.model';
import { GroupMembersModel } from 'src/infrastructure/frameworks/data-services/model/group-members.model';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';

describe('GroupMembersController (e2e)', () => {
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

  it('should add a member to a group and then delete the member', async () => {
    const addMemberDto = {
      groupId: 22, // Assuming this group exists
      userId: 141, // Assuming this user exists and is eligible to join the group
    };

    // Step 1: Add a member to the group
    const createResponse = await request(app.getHttpServer())
      .post('/group-members/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Content-Type', 'application/json')
      .send(addMemberDto)
      .expect(201);

    // Validate the creation response
    expect(createResponse.body).toHaveProperty('data');
    const memberData = createResponse.body.data;
    const membershipId = memberData.membershipId;

    expect(memberData).toHaveProperty('groupId', addMemberDto.groupId);
    expect(memberData).toHaveProperty('userId', addMemberDto.userId);
    expect(memberData).toHaveProperty('membershipId'); // Unique identifier for the membership
    expect(memberData).toHaveProperty('joinedAt'); // Should have a timestamp for when the member joined

    // Step 2: Delete the added member from the group
    const deleteResponse = await request(app.getHttpServer())
      .delete(`/group-members/delete/${membershipId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    // Validate deletion response
    expect(deleteResponse.body).toHaveProperty('data', null);
    expect(deleteResponse.body).toHaveProperty(
      'message',
      MESSAGES.GROUP_MEMBERS.DELETE.SUCCESS,
    );
  });
});
