type StorageValue = {
    value: string;
    exp: number;
};

class Storage {
    storage: Map<string, StorageValue>;
    listStorage: Map<string, string[]>;
    constructor() {
        this.storage = new Map();
        this.listStorage = new Map();
    }
    set(key: string, value: StorageValue) {
        this.storage.set(key, value);
    }
    get(key: string): StorageValue | undefined {
        return this.storage.get(key);
    }

    rpush(listKey: string, ...value: string[]): number {
        const list = this.listStorage.get(listKey);
        if (!list) {
            this.listStorage.set(listKey, [...value]);
            return value.length;
        }

        const newLength = list.push(...value);

        return newLength;
    }
    lrange(listKey: string, start: number, stop: number): string[] {
        const list = this.listStorage.get(listKey);
        if (!list) return [];

        start = start < 0 ? Math.max(0, list.length + start) : start;
        stop = stop < 0 ? Math.max(0, list.length + stop) : stop;

        if (!(start < stop && start < list.length)) return [];

        return list.slice(start, stop + 1);
    }
}

const storage = new Storage();

export default storage;
