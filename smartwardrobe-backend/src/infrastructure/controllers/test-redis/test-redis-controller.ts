import { Controller, Get, Post, Delete, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TestService } from 'src/infrastructure/services/redis/test-redis';
import { RedisDTO } from './redis.dto';

@Controller('redis')
@ApiTags('Redis')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post('set')
  async setRedisValue(@Body() redisDTO: RedisDTO): Promise<any> {
    try {
      const { key, value } = redisDTO;
      await this.testService.setRedisValue(key, value, 30000);
      return {
        data: `Key "${key}" set with value "${value}" for 30000 seconds.`,
        message: 'Redis value set successfully.',
      };
    } catch (error) {
      console.error('Error setting Redis value:', error.message);
      throw error;
    }
  }

  @Get('get')
  async getRedisValue(@Query('key') key: string): Promise<any> {
    try {
      const value = await this.testService.getRedisValue(key);
      return {
        data: value,
        message: 'Redis value set successfully.',
      };
    } catch (error) {
      console.error('Error retrieving Redis value:', error.message);
      throw error;
    }
  }

  @Delete('delete')
  async deleteRedisValue(@Query('key') key: string): Promise<string> {
    try {
      await this.testService.deleteRedisValue(key);
      return `Key "${key}" deleted from Redis.`;
    } catch (error) {
      console.error('Error deleting Redis value:', error.message);
      throw error;
    }
  }
}
