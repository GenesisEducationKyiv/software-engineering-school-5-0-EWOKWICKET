import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConfig } from './config/database.config';
import { DatabaseMigration } from './database.migration';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [DatabaseConfig],
      useClass: DatabaseConfig,
    }),
  ],
  providers: [DatabaseService, DatabaseMigration],
  exports: [DatabaseService],
})
export class DatabaseModule {}
