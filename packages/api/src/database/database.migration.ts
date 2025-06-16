import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseMigration {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async migrateDatabase() {
    try {
      await this.addSubscriptionCollection();
    } catch (err) {
      console.log(`Error occured on migration: ${err}`);
    }
  }

  async addSubscriptionCollection() {
    const collectionName = 'subscriptions';
    const collectionExists = await this.connection.db.listCollections({ name: collectionName }).hasNext();

    if (collectionExists) {
      console.log('Subscription collection already exists');
    } else {
      console.log("Subscription collection doesn't exist. Creating a collection...");
      await this.connection.db.createCollection(collectionName);
      console.log('Subscription collection created');
    }

    const collection = this.connection.db.collection(collectionName);
    const indexInfo = await collection.indexExists('expiresAt_index');

    if (!indexInfo) {
      await collection.createIndex({ email: 1, city: 1 }, { unique: true });
      await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
      console.log('TTL index created on expiresAt');
    } else {
      console.log('TTL index on expiresAt already exists');
    }
  }
}
