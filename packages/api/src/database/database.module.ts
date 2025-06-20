import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseMigration } from './database.migration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('DB_URI') || 'mongodb://localhost:27017/weatherAPI';
        return { uri };
      },
    }),
  ],
  providers: [DatabaseMigration],
})
export class DatabaseModule {}
