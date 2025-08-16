export type ParserResult =
    | { type: "echo"; args: EchoArgs }
    | { type: "get"; args: GetArgs }
    | { type: "set"; args: SetArgs }
    | { type: "ping"; args: PingArgs };

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

type CommandParser = (command: string[]) => ParserResult;

export type CommandType = "echo" | "set" | "ping" | "get";

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
]);

function getString(command: string[]): string {
    return command.shift()!;
}
