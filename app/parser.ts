type CommandResponseFunc = (command: string[]) => string;
type CommandType = "echo" | "set" | "ping" | "get";

export function parse(data: string): string {
    const command = data.toString().split("\n");

    removeNumberOfParamters(command);

    removeBytes(command);

    console.log(command);

    const typeCommand = command.shift()!.trim().toLowerCase() as CommandType;

    const responseFunc = commandsMap.get(typeCommand);

    return responseFunc ? responseFunc(command) : "";
}

function removeNumberOfParamters(command: string[]) {
    if (command[0].startsWith("*")) {
        command.shift();
    }
}
function removeBytes(command: string[]) {
    if (command[0].startsWith("$")) {
        command.shift();
    }
}

const commandsMap: Map<CommandType, CommandResponseFunc> = new Map([
    [
        "echo",
        (command: string[]) => {
            removeBytes(command);
            const message = command.shift()!.trim();

            return `$${message.length}\r\n${message}\r\n`;
        },
    ],
    ["set", (command: string[]) => ""],
    ["ping", (command: string[]) => "+PONG\r\n"],
    ["get", (command: string[]) => ""],
]);
