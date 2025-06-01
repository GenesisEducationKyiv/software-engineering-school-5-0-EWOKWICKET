import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Subscription } from 'src/subscriptions/schemas/subscription.schema';

@Injectable()
export class DatabaseMigration {
  constructor(
    @InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async migrateDatabase() {
    try {
      await this.addSubscriptionCollection();
    } catch (err) {
      console.log(`Error occured on migration: ${err}`);
    }
  }

  async addSubscriptionCollection() {
    const collectionName = this.subscriptionModel.collection.name;

    const collection = await this.connection.db.listCollections({ name: collectionName }).next();

    if (collection) {
      console.log('Subscription collection already exists');
    } else {
      console.log("Subscription collection doesn't exist. Creating a collection...");
      await this.connection.db.createCollection(collectionName);
      console.log('Subscription collection created');
    }

    const indexInfo = await this.subscriptionModel.collection.indexExists('expiresAt_index');

    if (!indexInfo) {
      await this.subscriptionModel.collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'expiresAt_index' });
      console.log('TTL index created on expiresAt');
    } else {
      console.log('TTL index on expiresAt already exists');
    }
  }
}
