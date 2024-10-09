import { ThrottlerStorageOptions } from './throttler-storage-options.interface';
import { ThrottlerStorageRecord } from './throttler-storage-record.interface';
export interface ThrottlerStorage {
    storage: Record<string, ThrottlerStorageOptions>;
    increment(key: string, ttl: number): Promise<ThrottlerStorageRecord>;
}
export declare const ThrottlerStorage: unique symbol;
