import { Queue } from 'bullmq';
import Redis from 'ioredis';

// export const redis = new Redis({
//   port: Number(process.env.REDIS_PORT) || 6379, // Defaults to 6379
//   host: process.env.REDIS_HOST,
//   username: process.env.REDIS_USERNAME,
//   password: process.env.REDIS_PASSWORD,
//   db: 0, // Defaults to 0
//   maxRetriesPerRequest: null
// })
export const redis = new Redis({
  port: 6379,
  host: "localhost",
  db: 0, // Defaults to 0
  maxRetriesPerRequest: null
})

export const redisSubscriber = new Redis({
  port: 6379,
  host: "localhost",
  db: 0, // Defaults to 0
  maxRetriesPerRequest: null
})


export const blastQueue = new Queue('blast', { connection: redis });
