import { GithubStatusModule } from './github-status';
import { Module } from '@nestjs/common';

@Module({
    imports: [GithubStatusModule],
    providers: [],
})
export class AppModule {}
