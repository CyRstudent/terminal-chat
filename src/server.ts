import * as WebSocket from 'ws';
import { default as config } from '../config.json' with { type: 'json' };

const wss = new WebSocket.WebSocketServer({
	port: config.port,
});

wss.on('connection', (ws) => {
	console.log('Someone has joined the chat!');
	ws.on('message', (data) => {
		console.log(data.toString());
		wss.clients.forEach((cli) => {
			if (cli.readyState === WebSocket.WebSocket.OPEN && cli !== ws) {
				cli.send(data);
			}
		});
	});
});

wss.on('close', () => {
	console.log('Server disconected');
});
