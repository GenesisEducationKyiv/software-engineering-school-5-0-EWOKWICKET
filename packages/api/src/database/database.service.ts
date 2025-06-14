import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { DatabaseMigration } from './database.migration';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly databaseMigration: DatabaseMigration,
  ) {}

  async startup() {
    await this._waitForConnection();
    await this.databaseMigration.migrateDatabase();
  }

  private async _waitForConnection() {
    if (this.connection.readyState !== 1) {
      console.log('Connecting to db...');
      await new Promise((resolve, reject) => {
        this.connection.once('open', (resolve) => {
          console.log('MongoDB connected');
          resolve();
        });

        this.connection.once('error', (err) => {
          console.log(`MongoDB connection eror: ${err}`);
          reject();
        });
      });
    } else {
      console.log('MongoDB connected');
    }
  }
}
