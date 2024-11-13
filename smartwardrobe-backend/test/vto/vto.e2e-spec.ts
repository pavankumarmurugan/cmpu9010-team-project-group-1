import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SQLDataServiceModule } from 'src/infrastructure/frameworks/data-services/sql-data-services.module';
import { ControllersModule } from 'src/infrastructure/controllers/controllers.module';
import { VtoImageSearchModel } from 'src/infrastructure/frameworks/data-services/model/vto.model';

describe('VtoImageSearchController (e2e)', () => {
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
          entities: [VtoImageSearchModel],
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

  it('/vto-image-search/get-all/:imageName (GET) - should retrieve VTO images based on imageName', async () => {
    const imageName = '00057_00.jpg';

    const response = await request(app.getHttpServer())
      .get(`/vto-image-search/get-all/${imageName}`)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);

    response.body.data.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('modelImageName');
      expect(item).toHaveProperty('imageName');
      expect(item).toHaveProperty('vtoS3Url');
      expect(item).toHaveProperty('createdAt');
      expect(item).toHaveProperty('updatedAt');

      expect(typeof item.id).toBe('number');
      expect(typeof item.modelImageName).toBe('string');
      expect(typeof item.imageName).toBe('string');
      expect(typeof item.vtoS3Url).toBe('string');
      expect(typeof item.createdAt).toBe('string');
      if (item.updatedAt !== null) {
        expect(typeof item.updatedAt).toBe('string');
      }
    });
  });

  it('/vto-image-search/get-all/:imageName (GET) - should return an empty array if no images are found', async () => {
    const nonExistentImageName = 'non-existent-image.jpg';

    const response = await request(app.getHttpServer())
      .get(`/vto-image-search/get-all/${nonExistentImageName}`)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toEqual([]);
  });

  it('/vto-image-search/get-all-v2 (POST) - should return VTO images for provided model and main images', async () => {
    const requestPayload = {
      modelImageName: [
        '01066_00.jpg',
        '00035_00.jpg',
        '00071_00.jpg',
        '00135_00.jpg',
        '00373_00.jpg',
        '00814_00.jpg',
      ],
      imageName: '00006_00.jpg',
    };

    const response = await request(app.getHttpServer())
      .post('/vto-image-search/get-all-v2')
      .send(requestPayload)
      .expect(201);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);

    response.body.data.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('modelImageName');
      expect(item).toHaveProperty('imageName');
      expect(item).toHaveProperty('vtoS3Url');
      expect(item).toHaveProperty('createdAt');
      expect(item).toHaveProperty('updatedAt');

      expect(typeof item.id).toBe('number');
      expect(typeof item.modelImageName).toBe('string');
      expect(typeof item.imageName).toBe('string');
      expect(typeof item.vtoS3Url).toBe('string');
      expect(typeof item.createdAt).toBe('string');
      if (item.updatedAt !== null) {
        expect(typeof item.updatedAt).toBe('string');
      }
    });
  });
});
