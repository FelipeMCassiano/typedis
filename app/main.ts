import * as net from "net";
import { handleParserResult } from "./handle";
import { parse } from "./parser";

console.log("Logs from your program will appear here!");

const server: net.Server = net.createServer((connection: net.Socket) => {
    connection.on("data", (data) => {
        const parsedData = parse(data.toString());
        const handledData = handleParserResult(parsedData);

        connection.write(handledData);
    });
    connection.on("close", () => {
        connection.end();
    });
});

server.listen(6379, "127.0.0.1");
