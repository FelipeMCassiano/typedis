import type {
    EchoArgs,
    GetArgs,
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
    switch (parserResult.type) {
        case "echo":
            return handlers.echo(parserResult.args);
        case "get":
            return handlers.get(parserResult.args);
        case "set":
            return handlers.set(parserResult.args);
        case "ping":
            return handlers.ping(parserResult.args);
        case "rpush":
            return handlers.rpush(parserResult.args);
        default:
            return nonRespBulk();
    }
}

type HandlerMap = {
    echo: (args: EchoArgs) => string;
    get: (args: GetArgs) => string;
    set: (args: SetArgs) => string;
    ping: (args: PingArgs) => string;
    rpush: (args: RPushArgs) => string;
};

const handlers: HandlerMap = {
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
        console.log(args);
        const exp = parseInt(args.exp) ?? 0;
        const now = new Date();
        storage.set(args.key, {
            value: args.value,
            exp: new Date(now.getTime() + exp),
        });
        return simpleString();
    },
    ping: (args: PingArgs) => simpleString(args.pong),
    rpush: (args: RPushArgs) => {
        const newLength = storage.rpush(args.listKey, ...args.value);
        return respInt(newLength);
    },
};

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
