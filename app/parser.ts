export type ParserResult = {
    type: CommandType;
    args: string[];
    raw?: string;
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
            return { type: "echo", args: [command[0]] };
        },
    ],

    [
        "set",
        (command: string[]): ParserResult => {
            const key = getString(command);
            const value = getString(command);

            return { type: "set", args: [key, value] };
        },
    ],
    [
        "ping",
        (command: string[]): ParserResult => {
            return {
                type: "ping",
                args: ["PONG"],
            };
        },
    ],
    [
        "get",
        (command: string[]) => {
            const key = getString(command);
            return { type: "get", args: [key] };
        },
    ],
]);

function getString(command: string[]): string {
    return command.shift()!;
}
