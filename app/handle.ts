import type { CommandType, ParserResult } from "./parser";
import storage from "./store";

export function handleParserResult(parserResult?: ParserResult): string {
    if (!parserResult) {
        return nonRespBulk();
    }
    const handler = handlers.get(parserResult.type);

    return handler ? handler(parserResult.args) : nonRespBulk();
}

const handlers: Map<CommandType, (args: string[]) => string> = new Map([
    [
        "echo",
        (args: string[]) => {
            return respBulk(args[0]);
        },
    ],
    [
        "get",
        (args: string[]) => {
            const value = storage.get(args[0]);

            return value ? respBulk(value) : nonRespBulk();
        },
    ],
    [
        "set",
        (args: string[]) => {
            const key = args[0];
            const value = args[1];
            storage.set(key, value);
            return simpleString();
        },
    ],
    ["ping", (args: string[]) => simpleString("PONG")],
]);

function simpleString(value: String = "OK"): string {
    return `+${value}\r\n`;
}
function respBulk(message: string): string {
    return `$${message.length}\r\n${message}\r\n`;
}
function nonRespBulk(): string {
    return "$-1\r\n";
}
