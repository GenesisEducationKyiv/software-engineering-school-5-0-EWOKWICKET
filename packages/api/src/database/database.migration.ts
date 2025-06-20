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
      console.error('Subscription collection already exists');
    } else {
      console.log("Subscription collection doesn't exist. Creating a collection...");
      await this.connection.db.createCollection(collectionName);
      console.log('Subscription collection created');
    }
  }

  private async _addSubscriptionIndexes() {
    const indexName = 'expiresAt';
    const collection = this.subscriptionModel.collection;
    const indexExists = await collection.indexExists(indexName);

    if (!indexExists) {
      await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: indexName });
      console.log('TTL index created on expiresAt');
    } else {
      console.error('TTL index on expiresAt already exists');
    }
  }
}
