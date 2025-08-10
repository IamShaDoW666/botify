"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRedisAuthState = void 0;
const baileys_1 = require("baileys");
/**
 * Stores the full authentication state in a Redis instance.
 *
 * @param redis The Redis client instance
 * @param sessionKey A prefix to use for all keys in Redis for this session, e.g., 'baileys-session'
 */
const useRedisAuthState = async (redis, sessionKey) => {
    const getKey = (file) => `${sessionKey}:${file}`;
    const writeData = async (data, file) => {
        const key = getKey(file);
        // Use JSON.stringify with the BufferJSON replacer to serialize the data
        const dataStr = JSON.stringify(data, baileys_1.BufferJSON.replacer);
        await redis.set(key, dataStr);
    };
    const readData = async (file) => {
        const key = getKey(file);
        const dataStr = await redis.get(key);
        if (dataStr) {
            return JSON.parse(dataStr, baileys_1.BufferJSON.reviver);
        }
        return null;
    };
    const removeData = async (file) => {
        const key = getKey(file);
        await redis.del(key);
    };
    // Load credentials from Redis or initialize them
    const creds = (await readData('creds.json')) || (0, baileys_1.initAuthCreds)();
    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};
                    await Promise.all(ids.map(async (id) => {
                        let value = await readData(`${type}-${id}.json`);
                        if (type === 'app-state-sync-key' && value) {
                            value = baileys_1.proto.Message.AppStateSyncKeyData.fromObject(value);
                        }
                        data[id] = value;
                    }));
                    return data;
                },
                set: async (data) => {
                    const tasks = [];
                    for (const category in data) {
                        for (const id in data[category]) {
                            const value = data[category][id];
                            const file = `${category}-${id}.json`;
                            if (value) {
                                tasks.push(writeData(value, file));
                            }
                            else {
                                tasks.push(removeData(file));
                            }
                        }
                    }
                    await Promise.all(tasks);
                }
            }
        },
        saveCreds: async () => {
            return writeData(creds, 'creds.json');
        }
    };
};
exports.useRedisAuthState = useRedisAuthState;
