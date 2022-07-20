import io from 'socket.io-client';
import fs from 'fs';
import path from 'path';

let args = process.argv;
let client = io('http://192.168.1.78:9999')
let server = false;

client.on('connect', () => {
    if(args[3] == 'true') {
        server = true;
        client.on('log', (msg) => {
            process.stdout.write(msg);
        })
    }
    if(args.length >= 3){
        let fileName = args[2];
        if(!fs.existsSync(fileName)) {
            console.error(`File ${fileName} does not exist`);
            return;
        }
        let fileData = fs.readFileSync(fileName);
        client.emit('metadata', {
            name: path.basename(fileName),
            size: fileData.length,
            server: server
        });
        client.emit('file', fileData);
        client.on('error', (err) => {
            console.error(err);
        })
    }
})