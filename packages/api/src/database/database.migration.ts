import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Subscription } from './schemas/subscription.schema';

@Injectable()
export class DatabaseMigration {
  constructor(
    @InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async migrateDatabase() {
    try {
      await this._addSubscriptionCollection();
      await this._addSubscriptionIndexes();
    } catch (err) {
      console.error(`Error occured on migration: ${err}`);
    }
  }

  private async _addSubscriptionCollection() {
    const collectionName = this.subscriptionModel.collection.name;
    const collection = await this.connection.db.listCollections({ name: collectionName }).next();

    if (collection) {
      console.error(`${collectionName} collection already exists`);
    } else {
      await this.connection.db.createCollection(collectionName);
      console.log(`${collectionName} collection created`);
    }
  }

  private async _addSubscriptionIndexes() {
    const ttlIndexName = 'expiresAt';
    const uniqueIndexName = 'unique_email_city';
    const collection = this.subscriptionModel.collection;

    // Create TTL index
    const ttlIndexExists = await collection.indexExists(ttlIndexName);
    if (!ttlIndexExists) {
      await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: ttlIndexName });
      console.log(`Index ${ttlIndexName} created`);
    } else {
      console.log(`Index ${ttlIndexName} already exists`);
    }

    // Create Unique index
    const uniqueIndexExists = await collection.indexExists(uniqueIndexName);
    if (!uniqueIndexExists) {
      await collection.createIndex({ email: 1, city: 1 }, { unique: true, name: uniqueIndexName });
      console.log(`Index ${uniqueIndexName} created`);
    } else {
      console.log(`Index ${uniqueIndexName} already exists`);
    }
  }
}
