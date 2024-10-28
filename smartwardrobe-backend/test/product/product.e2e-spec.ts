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

describe('ProductController (e2e)', () => {
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

  it('/product/get-all (GET) - should return all products', async () => {
    const response = await request(app.getHttpServer())
      .get('/product/get-all')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    response.body.data.forEach((product) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('imageName');
      expect(product).toHaveProperty('color');
      expect(product).toHaveProperty('type');
      expect(product).toHaveProperty('style');
      expect(product).toHaveProperty('material');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('occasion');
      expect(product).toHaveProperty('neckline');
      expect(product).toHaveProperty('fit');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('imageUrl');
    });
  });

  it('/product/get-one/:id (GET) - should return one product', async () => {
    const response = await request(app.getHttpServer())
      .get('/product/get-one/5')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('imageName');
    expect(response.body.data).toHaveProperty('color');
    expect(response.body.data).toHaveProperty('type');
    expect(response.body.data).toHaveProperty('style');
    expect(response.body.data).toHaveProperty('material');
    expect(response.body.data).toHaveProperty('category');
    expect(response.body.data).toHaveProperty('occasion');
    expect(response.body.data).toHaveProperty('neckline');
    expect(response.body.data).toHaveProperty('fit');
    expect(response.body.data).toHaveProperty('description');
    expect(response.body.data).toHaveProperty('imageUrl');
  });
});
