import { Module } from '@nestjs/common';
import { DataSourcesModule } from './data-sources/data-sources.module';

@Module({
    imports: [DataSourcesModule],
})
export class AppModule {}
