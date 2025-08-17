import type { CommandType, ParserResult } from "./types";

type CommandParser = (command: string[]) => ParserResult;
export function parse(data: string): ParserResult | undefined {
    const parsedResp = parseResp(data);

    const typeCommand = parsedResp[0].toLowerCase() as CommandType;

    const commandParser = commandsParserMap.get(typeCommand);

    return commandParser ? commandParser(parsedResp.slice(1)) : undefined;
}

function parseResp(data: string): string[] {
    const splitedCommand = data.toString().split("\n");
    const parsedCommand: string[] = [];
    for (const command of splitedCommand) {
        const normalized = command.slice(0, -1);
        if (
            normalized.startsWith("$") ||
            normalized.startsWith("*") ||
            normalized === ""
        ) {
            continue;
        }
        parsedCommand.push(normalized);
    }

    return parsedCommand;
}

const commandsParserMap: Map<CommandType, CommandParser> = new Map([
    [
        "echo",
        (command: string[]): ParserResult => {
            return { type: "echo", args: { arg: command[0] } };
        },
    ],

    [
        "set",
        (command: string[]): ParserResult => {
            const args: string[] = [];
            for (const arg of command) {
                if (arg.toLowerCase() === "px") {
                    continue;
                }
                args.push(arg);
            }

            return {
                type: "set",
                args: { key: args[0], value: args[1], exp: args[2] },
            };
        },
    ],
    [
        "ping",
        (command: string[]): ParserResult => {
            return {
                type: "ping",
                args: { pong: "PONG" },
            };
        },
    ],
    [
        "get",
        (command: string[]) => {
            const key = command[0];
            return { type: "get", args: { key: key } };
        },
    ],
    [
        "rpush",
        (command: string[]) => {
            return {
                type: "rpush",
                args: { listKey: command[0], value: command.slice(1) },
            };
        },
    ],
    [
        "lrange",
        (command: string[]) => {
            return {
                type: "lrange",
                args: {
                    listKey: command[0],
                    start: command[1],
                    stop: command[2],
                },
            };
        },
    ],
    [
        "lpush",
        (command: string[]) => {
            return {
                type: "lpush",
                args: { listKey: command[0], value: command.slice(1) },
            };
        },
    ],
    [
        "llen",
        (command: string[]) => {
            return {
                type: "llen",
                args: { listKey: command[0] },
            };
        },
    ],
]);
