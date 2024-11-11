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

describe('CartItemController (e2e)', () => {
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

  it('should create, update, and delete a cart item sequentially', async () => {
    // Step 1: Create a cart item
    const createDto = {
      productId: 1,
      quantity: 2,
    };

    const createResponse = await request(app.getHttpServer())
      .post('/cart-item/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Content-Type', 'application/json')
      .send(createDto)
      .expect(201);

    expect(createResponse.body).toHaveProperty('data');
    expect(createResponse.body.data).toHaveProperty(
      'productId',
      createDto.productId,
    );
    expect(createResponse.body.data).toHaveProperty(
      'quantity',
      createDto.quantity,
    );
    expect(createResponse.body.data).toHaveProperty('cartId');
    expect(createResponse.body.data).toHaveProperty('id');

    const createdItemId = createResponse.body.data.id;

    // Step 2: Update the quantity of the created cart item
    const updateDto = {
      id: createdItemId,
      quantity: 3,
    };

    const updateResponse = await request(app.getHttpServer())
      .patch('/cart-item/update')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Content-Type', 'application/json')
      .send(updateDto)
      .expect(200);

    expect(updateResponse.body).toHaveProperty('data', null);

    // Step 3: Delete the updated cart item
    const deleteResponse = await request(app.getHttpServer())
      .delete(`/cart-item/delete/${createdItemId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(deleteResponse.body).toHaveProperty('data', null);
  });

  it('/cart-item/get-all (GET) - should retrieve all items in the cart', async () => {
    const response = await request(app.getHttpServer())
      .get('/cart-item/get-all')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);

    response.body.data.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('cartId');
      expect(item).toHaveProperty('productId');
      expect(item).toHaveProperty('quantity');
      expect(item).toHaveProperty('createdAt');
      expect(item).toHaveProperty('updatedAt');

      expect(typeof item.id).toBe('number');
      expect(typeof item.cartId).toBe('number');
      expect(typeof item.productId).toBe('number');
      expect(typeof item.quantity).toBe('number');
      expect(typeof item.createdAt).toBe('string');
      if (item.updatedAt !== null) {
        expect(typeof item.updatedAt).toBe('string');
      }
    });
  });
});
