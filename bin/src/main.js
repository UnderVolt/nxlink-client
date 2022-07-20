"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let args = process.argv;
let client = (0, socket_io_client_1.default)('http://192.168.1.78:9999');
let server = false;
client.on('connect', () => {
    if (args[3] == 'true') {
        server = true;
        client.on('log', (msg) => {
            process.stdout.write(msg);
        });
    }
    if (args.length >= 3) {
        let fileName = args[2];
        if (!fs_1.default.existsSync(fileName)) {
            console.error(`File ${fileName} does not exist`);
            return;
        }
        let fileData = fs_1.default.readFileSync(fileName);
        client.emit('metadata', {
            name: path_1.default.basename(fileName),
            size: fileData.length,
            server: server
        });
        client.emit('file', fileData);
        client.on('error', (err) => {
            console.error(err);
        });
    }
});
