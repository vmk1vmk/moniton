import { Module } from '@nestjs/common';
import { GithubStatusModule } from './github-status';

@Module({
    imports: [GithubStatusModule],
})
export class DataSourcesModule {}
