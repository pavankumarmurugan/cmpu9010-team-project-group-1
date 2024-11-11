import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SQLDataServiceModule } from 'src/infrastructure/frameworks/data-services/sql-data-services.module';
import { ControllersModule } from 'src/infrastructure/controllers/controllers.module';
import { RecommendationsReqDto } from 'src/core/dto/recommendations/recommendations-req-dto';
import { CartItemModel } from 'src/infrastructure/frameworks/data-services/model/cart-items.model';
import { CartModel } from 'src/infrastructure/frameworks/data-services/model/cart.model';
import { ChatModel } from 'src/infrastructure/frameworks/data-services/model/chat.model';
import { FriendsRequestsModel } from 'src/infrastructure/frameworks/data-services/model/friend-request.model';
import { FriendsModel } from 'src/infrastructure/frameworks/data-services/model/friends.model';
import { GroupMembersModel } from 'src/infrastructure/frameworks/data-services/model/group-members.model';
import { GroupModel } from 'src/infrastructure/frameworks/data-services/model/group.model';
import { ImageClusterModel } from 'src/infrastructure/frameworks/data-services/model/image-clusters.model';
import { LikesModel } from 'src/infrastructure/frameworks/data-services/model/likes.model';
import { ProductCategoryModel } from 'src/infrastructure/frameworks/data-services/model/product-category.model';
import { ProductInventoryModel } from 'src/infrastructure/frameworks/data-services/model/product-inventory.model';
import { ProductModel } from 'src/infrastructure/frameworks/data-services/model/product.model';
import { UserModel } from 'src/infrastructure/frameworks/data-services/model/user.model';
import { VtoImageSearchModel } from 'src/infrastructure/frameworks/data-services/model/vto.model';

describe('SearchProductsController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({}),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: +process.env.DATABASE_PORT,
          username: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          ssl: true,
          extra: {
            ssl: { rejectUnauthorized: false },
          },
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
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
    if (app) {
      await app.close();
    }
  });

  it('/recommend/similar-products (POST) - should return similar products for a given image', async () => {
    const requestPayload: RecommendationsReqDto = {
      imageName: '00057_00.jpg',
      topN: 5,
    };

    const response = await request(app.getHttpServer())
      .post('/recommend/similar-products')
      .send(requestPayload)
      .expect(201);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeLessThanOrEqual(requestPayload.topN);

    response.body.data.forEach((product) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('imageName');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('type');
      expect(product).toHaveProperty('pattern');
      expect(product).toHaveProperty('color');
      expect(product).toHaveProperty('colorShade');
      expect(product).toHaveProperty('material');
      expect(product).toHaveProperty('occasion');
      expect(product).toHaveProperty('applicableSeason');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('imageUrl');
      expect(product).toHaveProperty('trail');

      // Check types of specific fields
      expect(typeof product.id).toBe('number');
      expect(typeof product.imageName).toBe('string');
      expect(typeof product.name).toBe('string');
      expect(typeof product.type).toBe('string');
      expect(typeof product.pattern).toBe('string');
      expect(typeof product.color).toBe('string');
      expect(typeof product.colorShade).toBe('string');
      expect(typeof product.material).toBe('string');
      expect(typeof product.occasion).toBe('string');
      expect(typeof product.applicableSeason).toBe('string');
      expect(typeof product.description).toBe('string');
      expect(typeof product.price).toBe('string');
      expect(typeof product.imageUrl).toBe('string');
      expect(typeof product.trail).toBe('boolean');
    });
  });
});
