import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';
import { GithubStatusModule } from './github-status';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'test-cockpit')
        }),
        GithubStatusModule
    ],
    providers: [],
})
export class AppModule {}
