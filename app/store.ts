type StorageValue = {
    value: string;
    exp: Date;
};
const storage: Map<string, StorageValue> = new Map();

export default storage;
