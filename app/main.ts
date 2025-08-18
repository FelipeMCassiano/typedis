import * as net from "net";
import { handleParserResult } from "./parser/handle";
import { parse } from "./parser/parser";

console.log("Logs from your program will appear here!");

const server: net.Server = net.createServer(async (connection: net.Socket) => {
    connection.on("data", async (data) => {
        const parsedData = parse(data.toString());

        const handledData = await handleParserResult(parsedData);

        connection.write(handledData);
    });
    connection.on("close", () => {
        connection.end();
    });
});

server.listen(6379, "127.0.0.1");
