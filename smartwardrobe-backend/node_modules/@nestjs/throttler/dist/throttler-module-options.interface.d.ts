import { ExecutionContext, ModuleMetadata, Type } from '@nestjs/common/interfaces';
export interface ThrottlerModuleOptions {
    limit?: number;
    ttl?: number;
    ignoreUserAgents?: RegExp[];
    storage?: any;
    skipIf?: (context: ExecutionContext) => boolean;
}
export interface ThrottlerOptionsFactory {
    createThrottlerOptions(): Promise<ThrottlerModuleOptions> | ThrottlerModuleOptions;
}
export interface ThrottlerAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<ThrottlerOptionsFactory>;
    useClass?: Type<ThrottlerOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<ThrottlerModuleOptions> | ThrottlerModuleOptions;
    inject?: any[];
}
