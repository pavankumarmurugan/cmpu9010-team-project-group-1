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

describe('GroupController (e2e)', () => {
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

  it('should create, update, and delete a group', async () => {
    // Step 1: Create a group
    const createGroupDto = {
      groupName: 'Initial Group Name',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/group/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Content-Type', 'application/json')
      .send(createGroupDto)
      .expect(201);

    // Validate the creation response
    expect(createResponse.body).toHaveProperty('data');
    const groupData = createResponse.body.data;
    const groupId = groupData.groupId;

    expect(groupData).toHaveProperty('groupName', createGroupDto.groupName);
    expect(groupData).toHaveProperty('createdBy'); // Should be set to userId of the logged-in user
    expect(groupData).toHaveProperty('groupId');

    // Step 2: Update the group name
    const updateGroupDto = {
      groupId,
      groupName: 'Updated Group Name',
    };

    const updateResponse = await request(app.getHttpServer())
      .patch('/group/update')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Content-Type', 'application/json')
      .send(updateGroupDto)
      .expect(200);

    // Validate the update response
    expect(updateResponse.body).toHaveProperty('data');
    const updatedGroupData = updateResponse.body.data;

    expect(updatedGroupData).toHaveProperty('groupId', groupId);
    expect(updatedGroupData).toHaveProperty(
      'groupName',
      updateGroupDto.groupName,
    );
    expect(updatedGroupData).toHaveProperty('createdBy', groupData.createdBy);
    expect(updatedGroupData).toHaveProperty('updatedAt');
    expect(updatedGroupData).toHaveProperty('createdAt');

    // Step 3: Delete the updated group
    const deleteResponse = await request(app.getHttpServer())
      .delete(`/group/delete/${groupId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    // Validate deletion response
    expect(deleteResponse.body).toHaveProperty('data', null);
  });

  it('/group/get-one/:groupId (GET) - should retrieve a specific group by ID', async () => {
    const groupId = 22;

    // Step 1: Retrieve the group by ID
    const response = await request(app.getHttpServer())
      .get(`/group/get-one/${groupId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    // Step 2: Validate the response structure and data
    expect(response.body).toHaveProperty('data');
    const groupData = response.body.data;

    // Check that the returned group data matches expected properties
    expect(groupData).toHaveProperty('groupId', groupId);
    expect(groupData).toHaveProperty('groupName');
    expect(groupData).toHaveProperty('createdBy');
    expect(groupData).toHaveProperty('createdAt');
    expect(groupData).toHaveProperty('updatedAt');
  });

  it('/group/get-all-members-in-group/:groupId (GET) - should retrieve all members in the specified group', async () => {
    const groupId = 22; // Assuming this group ID exists

    // Step 1: Retrieve all members in the group by groupId
    const response = await request(app.getHttpServer())
      .get(`/group/get-all-members-in-group/${groupId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    // Step 2: Validate the response structure
    expect(response.body).toHaveProperty('data');
    const members = response.body.data;

    // Ensure 'data' is an array and contains at least one member
    expect(Array.isArray(members)).toBe(true);
    expect(members.length).toBeGreaterThan(0);

    // Step 3: Validate each member’s details
    members.forEach((member) => {
      expect(member).toHaveProperty('firstname');
      expect(member).toHaveProperty('lastname');
      expect(member).toHaveProperty('username');
      expect(member).toHaveProperty('userId');
      expect(member).toHaveProperty('role');
      expect(member).toHaveProperty('profilePic');

      // Check profilePic field is either a string URL or null
      if (member.profilePic) {
        expect(typeof member.profilePic).toBe('string');
      } else {
        expect(member.profilePic).toBeNull();
      }
    });
  });

  it('/group/get-my-groups (GET) - should retrieve all groups the user belongs to', async () => {
    // Step 1: Send a request to get all groups for the user
    const response = await request(app.getHttpServer())
      .get('/group/get-my-groups')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    // Step 2: Validate the response structure
    expect(response.body).toHaveProperty('data');
    const groups = response.body.data;

    // Ensure 'data' is an array and contains at least one group
    expect(Array.isArray(groups)).toBe(true);
    expect(groups.length).toBeGreaterThan(0);

    // Step 3: Validate each group details
    groups.forEach((group) => {
      expect(group).toHaveProperty('groupId');
      expect(group).toHaveProperty('groupName');
      expect(group).toHaveProperty('createdBy'); // Should match the user's ID if created by the user
      expect(group).toHaveProperty('createdAt');
      expect(group).toHaveProperty('updatedAt');
    });
  });
});
