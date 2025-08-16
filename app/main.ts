import * as net from "net";
import { parse } from "./parser";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
    connection.on("data", (data) => {
        connection.write(parse(data.toString()));
    });
    connection.on("close", () => {
        connection.end();
    });
});

server.listen(6379, "127.0.0.1");
