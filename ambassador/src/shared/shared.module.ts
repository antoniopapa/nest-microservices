import {CacheModule, Module} from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import {RedisService} from "./redis.service";

@Module({
    imports: [
        CacheModule.register({
            store: redisStore,
            host: 'redis',
            port: 6379,
        })
    ],
    providers: [RedisService],
    exports: [
        CacheModule,
        RedisService
    ]
})
export class SharedModule {
}
