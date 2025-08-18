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

    getlength(listKey: string): number {
        return this.listStorage.get(listKey)?.length || 0;
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
            console.log("new list was created");
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
    lpop(listKey: string, elementsToRemove?: number): T[] | T | null {
        const list = this.listStorage.get(listKey);
        if (!list || list.length <= 0) {
            return null;
        }
        if (elementsToRemove) {
            const count = Math.min(elementsToRemove, list.length);
            const removedElements: T[] = new Array(count);
            for (let i = 0; i < count; i++) {
                const removed = list.deleteHead();
                if (removed) {
                    removedElements[i] = removed;
                }
            }
            return removedElements;
        }

        return list.deleteHead();
    }
    blpop(listKey: string, timeToWait: number): Promise<[string, T]> {
        let list = this.listStorage.get(listKey);
        if (!list) {
            list = new LinkedList<T>();
            this.listStorage.set(listKey, list);
        }

        if (list.length > 0) {
            console.log("list have <= 1 item");
            return Promise.resolve([listKey, list.deleteHead()!]);
        }
        return new Promise((resolve, reject) => {
            console.log("blocked");
            const timeoutId =
                timeToWait !== 0
                    ? setTimeout(() => {
                          cleanup();
                      }, timeToWait)
                    : null;

            const checkList = () => {
                if (list.length > 0) {
                    cleanup();
                    resolve([listKey, list?.deleteHead()!]);
                }
            };
            console.log("checkList registerd", checkList);

            const cleanup = () => {
                if (timeoutId) clearTimeout(timeoutId);
            };
            list.once("push", checkList);
        });
    }
}

const storage = new Storage<string>();

export default storage;
