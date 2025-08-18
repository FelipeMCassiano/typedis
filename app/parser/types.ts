export type ParserResult =
    | { type: "echo"; args: EchoArgs }
    | { type: "get"; args: GetArgs }
    | { type: "set"; args: SetArgs }
    | { type: "ping"; args: PingArgs }
    | { type: "rpush"; args: RPushArgs }
    | { type: "lrange"; args: LRangeArgs }
    | { type: "lpush"; args: LPushArgs }
    | { type: "llen"; args: LLenArgs }
    | { type: "lpop"; args: LPopArgs }
    | { type: "blpop"; args: BLPopArgs };

export type CommandType =
    | "echo"
    | "set"
    | "ping"
    | "get"
    | "rpush"
    | "lrange"
    | "lpush"
    | "llen"
    | "lpop"
    | "blpop";

export type SetArgs = {
    key: string;
    value: string;
    exp: string;
};
export type GetArgs = {
    key: string;
};
export type PingArgs = {
    pong: "PONG";
};
export type EchoArgs = {
    arg: string;
};
export type RPushArgs = {
    listKey: string;
    value: string[];
};
export type LRangeArgs = {
    listKey: string;
    start: string;
    stop: string;
};
export type LPushArgs = {
    listKey: string;
    value: string[];
};

export type LLenArgs = {
    listKey: string;
};
export type LPopArgs = {
    listKey: string;
    elementsToRemove?: number;
};
export type BLPopArgs = {
    listKey: string;
    timeToWait: number;
};
