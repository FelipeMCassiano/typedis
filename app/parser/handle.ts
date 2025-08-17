import storage from "../store/store";
import type { ParserResult } from "./types";

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
        const now = Date.now();

        if (!data || (data.exp > 0 && data.exp < now)) {
            return nonRespBulk();
        }

        return respBulk(data.value);
    },
    set: (args) => {
        const exp = parseInt(args.exp) || 0;
        const now = Date.now();

        storage.set(args.key, {
            value: args.value,
            exp: exp ? now + exp : exp,
        });
        return simpleString();
    },
    ping: (args) => simpleString(args.pong),
    rpush: (args) => respInt(storage.rpush(args.listKey, ...args.value)),

    lrange: (args) => {
        const start = parseInt(args.start);
        const stop = parseInt(args.stop);

        return respArray(...storage.lrange(args.listKey, start, stop));
    },
    lpush: (args) => respInt(storage.lpush(args.listKey, ...args.value)),
};

function respArray(...values: string[]): string {
    const resp = [`*${values.length}\r\n`];
    for (const val of values) {
        resp.push(`$${val.length}\r\n${val}\r\n`);
    }
    return resp.join("");
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
