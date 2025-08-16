type StorageValue = {
    value: string;
    exp: Date;
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

    rpush(listKey: string, value: string): number {
        const list = this.listStorage.get(listKey);
        if (!list) {
            this.listStorage.set(listKey, [value]);
            return 1;
        }

        const newLength = list.push(value);

        return newLength;
    }
}

const storage = new Storage();

export default storage;
