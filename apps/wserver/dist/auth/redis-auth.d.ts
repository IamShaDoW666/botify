import { AuthenticationState } from "baileys";
import Redis from "ioredis";
/**
 * Stores the full authentication state in a Redis instance.
 *
 * @param redis The Redis client instance
 * @param sessionKey A prefix to use for all keys in Redis for this session, e.g., 'baileys-session'
 */
export declare const useRedisAuthState: (redis: Redis, sessionKey: string) => Promise<{
    state: AuthenticationState;
    saveCreds: () => Promise<void>;
}>;
/**
 * Finds and deletes all Redis keys associated with a session ID.
 * @param {RedisClientType} redis - The Redis client instance.
 * @param {string} sessionId - The session ID to clear.
 */
export declare function deleteSessionFromRedis(redis: Redis, sessionId: string): Promise<void>;
//# sourceMappingURL=redis-auth.d.ts.map