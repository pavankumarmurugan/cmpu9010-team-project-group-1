import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDtoConvertor } from 'src/core/convertors/user/user-dto.convertor';
import { ControllersModule } from 'src/infrastructure/controllers/controllers.module';
import { BcryptService } from 'src/infrastructure/frameworks/bcrypt/bcrypt.service';
import { CartItemModel } from 'src/infrastructure/frameworks/data-services/model/cart-items.model';
import { CartModel } from 'src/infrastructure/frameworks/data-services/model/cart.model';
import { ProductCategoryModel } from 'src/infrastructure/frameworks/data-services/model/product-category.model';
import { ProductInventoryModel } from 'src/infrastructure/frameworks/data-services/model/product-inventory.model';
import { ProductModel } from 'src/infrastructure/frameworks/data-services/model/product.model';
import { UserModel } from 'src/infrastructure/frameworks/data-services/model/user.model';
import { SQLDataServiceModule } from 'src/infrastructure/frameworks/data-services/sql-data-services.module';
import { RefreshTokenGuard } from 'src/infrastructure/guards/auth/refreshToken.guard';
import { RefreshTokenUpdateInterceptor } from 'src/infrastructure/interceptors/refresh-token-update.interceptor';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { ImageClusterModel } from 'src/infrastructure/frameworks/data-services/model/image-clusters.model';
import { ChatModel } from 'src/infrastructure/frameworks/data-services/model/chat.model';
import { FriendsRequestsModel } from 'src/infrastructure/frameworks/data-services/model/friend-request.model';
import { FriendsModel } from 'src/infrastructure/frameworks/data-services/model/friends.model';
import { LikesModel } from 'src/infrastructure/frameworks/data-services/model/likes.model';
import { GroupMembersModel } from 'src/infrastructure/frameworks/data-services/model/group-members.model';
import { GroupModel } from 'src/infrastructure/frameworks/data-services/model/group.model';
import { VtoImageSearchModel } from 'src/infrastructure/frameworks/data-services/model/vto.model';

describe('LikesController (e2e)', () => {
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
            GroupModel,
            GroupMembersModel,
            VtoImageSearchModel,
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

    app.init();

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

  it('/likes/create (POST) should create a like and then /likes/get-one/:id (GET) - should fetch a single liked product by ID', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/likes/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ productId: 1 })
      .expect(201);

    expect(createResponse.body).toHaveProperty('data');
    const likeId = createResponse.body.data.id;
    expect(typeof likeId).toBe('number');

    const response = await request(app.getHttpServer())
      .get(`/likes/get-one/${likeId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('data');

    const data = response.body.data;
    expect(data).toHaveProperty('id', likeId);
    expect(data).toHaveProperty('userId');
    expect(data).toHaveProperty('productId');
    expect(data).toHaveProperty('product');

    const product = data.product;
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
  });

  it('/likes/get-all (GET) - should return all liked products', async () => {
    const response = await request(app.getHttpServer())
      .get('/likes/get-all')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    response.body.data.forEach((like) => {
      expect(like).toHaveProperty('id');
      expect(like).toHaveProperty('userId');
      expect(like).toHaveProperty('productId');
      expect(like).toHaveProperty('product');

      const product = like.product;
      expect(product).toHaveProperty('updatedAt');
      expect(product).toHaveProperty('createdAt');
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
    });
  });

  it('/likes/create (POST) should create a like and then /likes/delete/${likeId} delete a like', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/likes/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ productId: 2 })
      .expect(201);

    expect(createResponse.body).toHaveProperty('data');
    const likeId = createResponse.body.data.productId;

    expect(createResponse.body.data).toHaveProperty('productId');
    expect(createResponse.body.data).toHaveProperty('userId');
    expect(typeof likeId).toBe('number');

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/likes/delete/${likeId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(deleteResponse.body).toHaveProperty('data', null);
  });

  it('/likes/delete-all-likes (DELETE) - should delete all likes for the user', async () => {
    const deleteAllResponse = await request(app.getHttpServer())
      .delete('/likes/delete-all-likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(deleteAllResponse.body).toHaveProperty('data', null);
  });
});
