import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ThrottlerModuleOptions } from './throttler-module-options.interface';
import { ThrottlerStorage } from './throttler-storage.interface';
export declare class ThrottlerGuard implements CanActivate {
    protected readonly options: ThrottlerModuleOptions;
    protected readonly storageService: ThrottlerStorage;
    protected readonly reflector: Reflector;
    protected headerPrefix: string;
    protected errorMessage: string;
    constructor(options: ThrottlerModuleOptions, storageService: ThrottlerStorage, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    protected handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean>;
    protected getTracker(req: Record<string, any>): string;
    protected getRequestResponse(context: ExecutionContext): {
        req: Record<string, any>;
        res: Record<string, any>;
    };
    protected generateKey(context: ExecutionContext, suffix: string): string;
    protected throwThrottlingException(context: ExecutionContext): void;
}
