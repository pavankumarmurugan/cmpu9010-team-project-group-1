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
import * as request from 'supertest';

describe('CartController (e2e)', () => {
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

    app.init();
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

  it('GET /cart/get-my-cart', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'string',
        password: 'string',
      })
      .expect(201);

    const accessToken = loginResponse.body.data.token;

    const response = await request(app.getHttpServer())
      .get('/cart/get-my-cart')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    response.body.data.forEach((cartItem) => {
      expect(cartItem).toHaveProperty('id');
      expect(cartItem).toHaveProperty('cartId');
      expect(cartItem).toHaveProperty('productId');
      expect(cartItem).toHaveProperty('quantity');
      expect(cartItem).toHaveProperty('createdAt');
      expect(cartItem).toHaveProperty('updatedAt');

      expect(cartItem).toHaveProperty('product');
      const product = cartItem.product;
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('articleId');
      expect(product).toHaveProperty('productCode');
      expect(product).toHaveProperty('prodName');
      expect(product).toHaveProperty('productTypeNo');
      expect(product).toHaveProperty('productTypeName');
      expect(product).toHaveProperty('productGroupName');
      expect(product).toHaveProperty('graphicalAppearanceNo');
      expect(product).toHaveProperty('graphicalAppearanceName');
      expect(product).toHaveProperty('colourGroupCode');
      expect(product).toHaveProperty('colourGroupName');
      expect(product).toHaveProperty('perceivedColourValueId');
      expect(product).toHaveProperty('perceivedColourValueName');
      expect(product).toHaveProperty('perceivedColourMasterId');
      expect(product).toHaveProperty('perceivedColourMasterName');
      expect(product).toHaveProperty('departmentNo');
      expect(product).toHaveProperty('departmentName');
      expect(product).toHaveProperty('indexCode');
      expect(product).toHaveProperty('indexName');
      expect(product).toHaveProperty('indexGroupNo');
      expect(product).toHaveProperty('indexGroupName');
      expect(product).toHaveProperty('sectionNo');
      expect(product).toHaveProperty('sectionName');
      expect(product).toHaveProperty('garmentGroupNo');
      expect(product).toHaveProperty('garmentGroupName');
      expect(product).toHaveProperty('detailDesc');
      expect(product).toHaveProperty('imageUrl');
    });
  });
});
