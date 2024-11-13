import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SQLDataServiceModule } from 'src/infrastructure/frameworks/data-services/sql-data-services.module';
import { ControllersModule } from 'src/infrastructure/controllers/controllers.module';
import { ProductCategoryModel } from 'src/infrastructure/frameworks/data-services/model/product-category.model';
import { ProductSubcategoryModel } from 'src/infrastructure/frameworks/data-services/model/product-subcategory.model';

describe('ProductCategoryController (e2e)', () => {
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
          entities: [ProductCategoryModel, ProductSubcategoryModel],
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

  it('/product-category/get-all (GET) - should retrieve all product categories with subcategories', async () => {
    const response = await request(app.getHttpServer())
      .get('/product-category/get-all')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);

    response.body.data.forEach((category) => {
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('desc');
      expect(category).toHaveProperty('createdAt');
      expect(category).toHaveProperty('updatedAt');
      expect(category).toHaveProperty('deletedAt');
      expect(category).toHaveProperty('subCategories');

      expect(typeof category.id).toBe('number');
      expect(typeof category.name).toBe('string');
      expect(category.desc === null || typeof category.desc === 'string').toBe(
        true,
      );
      expect(typeof category.createdAt).toBe('string');
      if (category.updatedAt !== null) {
        expect(typeof category.updatedAt).toBe('string');
      }
      if (category.deletedAt !== null) {
        expect(typeof category.deletedAt).toBe('string');
      }

      expect(Array.isArray(category.subCategories)).toBe(true);
      category.subCategories.forEach((subCategory) => {
        expect(typeof subCategory).toBe('string');
      });
    });
  });
});
