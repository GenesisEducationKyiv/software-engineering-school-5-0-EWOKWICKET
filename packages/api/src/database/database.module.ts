import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseMigration } from './database.migration';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('DB_URI') || 'mongodb://localhost:27017/weatherAPI';
        return { uri };
      },
    }),
  ],
  providers: [DatabaseService, DatabaseMigration],
  exports: [DatabaseService],
})
export class DatabaseModule {}
