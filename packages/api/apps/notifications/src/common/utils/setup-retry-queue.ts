import * as amqp from 'amqplib';

export async function setupRetryQueue(connectionUrl: string, queue: string) {
  const retryQueue = `${queue}.retry`;

  const connection = await amqp.connect(connectionUrl);
  const channel = await connection.createChannel();

  await channel.assertQueue(retryQueue, {
    durable: true,
    arguments: {
      'x-message-ttl': 2000,
      'x-dead-letter-exchange': '',
      'x-dead-letter-routing-key': queue,
    },
  });

  await channel.close();
  await connection.close();
}
