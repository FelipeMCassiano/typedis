import type { CommandType, ParserResult } from "./types";

type CommandParser = (command: string[]) => ParserResult;
export function parse(data: string): ParserResult | undefined {
    const parsedResp = parseResp(data);

    const typeCommand = parsedResp[0].toLowerCase() as CommandType;

    const commandParser = commandsParserMap[typeCommand];

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
type CommandMap = {
    [key in CommandType]: CommandParser;
};

const commandsParserMap: CommandMap = {
    echo: (command): ParserResult => {
        return { type: "echo", args: { arg: command[0] } };
    },

    set: (command): ParserResult => {
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

    ping: (command): ParserResult => {
        return {
            type: "ping",
            args: { pong: "PONG" },
        };
    },

    get: (command) => {
        const key = command[0];
        return { type: "get", args: { key: key } };
    },

    rpush: (command) => {
        return {
            type: "rpush",
            args: { listKey: command[0], value: command.slice(1) },
        };
    },
    lrange: (command) => {
        return {
            type: "lrange",
            args: {
                listKey: command[0],
                start: command[1],
                stop: command[2],
            },
        };
    },
    lpush: (command) => {
        return {
            type: "lpush",
            args: { listKey: command[0], value: command.slice(1) },
        };
    },
    llen: (command) => {
        return {
            type: "llen",
            args: { listKey: command[0] },
        };
    },
    lpop: (command) => {
        return {
            type: "lpop",
            args: {
                listKey: command[0],
                ...(command[1] && {
                    elementsToRemove: parseInt(command[1]),
                }),
            },
        };
    },
    blpop: (command) => {
        return {
            type: "blpop",
            args: { listKey: command[0], timeToWait: Number(command[1]) },
        };
    },
};
