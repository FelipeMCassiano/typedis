import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
    connection.on("data", (data) => {
        const commands = data.toString().split("\n");
        if (commands[0].startsWith("*")) {
            const numberOfParamters = parseInt(commands[0].match(/\d+/)![0]);

            const command =
                numberOfParamters === 1
                    ? commands[numberOfParamters + 1].trim().toLowerCase()
                    : commands[numberOfParamters].trim().toLowerCase();

            if (command === "echo") {
                const message =
                    commands[numberOfParamters + numberOfParamters].trim();
                const resp = `$${message.length}\r\n${message}\r\n`;
                connection.write(resp);
                return;
            }
            if (command === "ping") {
                connection.write("+PONG\r\n");
            }
        }
    });
    connection.on("close", () => {
        connection.end();
    });
});

server.listen(6379, "127.0.0.1");
