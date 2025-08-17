import { LinkedList } from "./linked-list";

type StorageValue<T> = {
    value: T;
    exp: number;
};

class Storage<T> {
    storage: Map<string, StorageValue<T>>;
    listStorage: Map<string, LinkedList<T>>;
    constructor() {
        this.storage = new Map();
        this.listStorage = new Map();
    }
    set(key: string, value: StorageValue<T>) {
        this.storage.set(key, value);
    }
    get(key: string): StorageValue<T> | undefined {
        return this.storage.get(key);
    }

    rpush(listKey: string, ...value: T[]): number {
        const list = this.listStorage.get(listKey);
        if (!list) {
            const newList = new LinkedList<T>();
            for (const val of value) {
                newList.append(val);
            }

            this.listStorage.set(listKey, newList);
            return newList.length;
        }
        for (const val of value) {
            list.append(val);
        }

        return list.length;
    }
    lrange(listKey: string, start: number, stop: number): T[] {
        const list = this.listStorage.get(listKey);
        if (!list) return [];

        start = start < 0 ? Math.max(0, list.length + start) : start;
        stop = stop < 0 ? Math.max(0, list.length + stop) : stop;

        if (!(start < stop && start < list.length)) return [];

        return list.walk(start, stop);
    }

    lpush(listKey: string, ...value: T[]): number {
        const list = this.listStorage.get(listKey);
        if (!list) {
            const newList = new LinkedList<T>();
            for (const val of value) {
                newList.prepend(val);
            }
            this.listStorage.set(listKey, newList);
            return newList.length;
        }
        for (const val of value) {
            list.prepend(val);
        }

        return list.length;
    }
}

const storage = new Storage<string>();

export default storage;
