import type {
    LRangeArgs,
    ParserResult,
    PingArgs,
    RPushArgs,
    SetArgs,
} from "./parser";
import storage from "./store";

export function handleParserResult(parserResult?: ParserResult): string {
    if (!parserResult) {
        return nonRespBulk();
    }
    return handlers[parserResult.type](parserResult.args as never);
}
type Handler<T extends ParserResult = ParserResult> = {
    [K in T as K["type"]]: (args: K["args"]) => string;
};
const handlers: Handler = {
    echo: (args) => respBulk(args.arg),
    get: (args) => {
        const data = storage.get(args.key);
        const now = new Date();

        if (!data || data.exp < now) {
            return nonRespBulk();
        }

        return respBulk(data.value);
    },
    set: (args: SetArgs) => {
        const exp = parseInt(args.exp) || 0;
        const now = new Date();
        storage.set(args.key, {
            value: args.value,
            exp: new Date(now.getTime() + exp),
        });
        return simpleString();
    },
    ping: (args: PingArgs) => simpleString(args.pong),
    rpush: (args: RPushArgs) =>
        respInt(storage.rpush(args.listKey, ...args.value)),

    lrange: (args: LRangeArgs) => {
        const start = parseInt(args.start);
        const stop = parseInt(args.stop);

        return respArray(...storage.lrange(args.listKey, start, stop));
    },
};

function respArray(...values: string[]): string {
    let resp = `*${values.length}\r\n`;
    for (const val of values) {
        resp += `$${val.length}\r\n${val}\r\n`;
    }
    return resp;
}

function simpleString(value: String = "OK"): string {
    return `+${value}\r\n`;
}
function respBulk(message: string): string {
    return `$${message.length}\r\n${message}\r\n`;
}
function nonRespBulk(): string {
    return "$-1\r\n";
}
function respInt(value: number): string {
    return `:${value}\r\n`;
}
