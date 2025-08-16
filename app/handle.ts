import type {
    EchoArgs,
    GetArgs,
    ParserResult,
    PingArgs,
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
        default:
            return nonRespBulk();
    }
}

type HandlerMap = {
    echo: (args: EchoArgs) => string;
    get: (args: GetArgs) => string;
    set: (args: SetArgs) => string;
    ping: (args: PingArgs) => string;
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
        const key = args.key;
        const value = args.value;
        const exp = parseInt(args.exp) ?? 0;
        const now = new Date();
        storage.set(key, {
            value: value,
            exp: new Date(now.getTime() + exp),
        });
        return simpleString();
    },

    ping: (args: PingArgs) => simpleString(args.pong),
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
