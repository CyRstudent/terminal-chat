import WebSocket from 'ws';
import * as readline from 'node:readline';
import {default as config} from '../config.json' with {type: 'json'};

const ws = new WebSocket(`ws://localhost:${config.port}`);
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

ws.on('open', () => {
	console.log('Welcome to the chat!')
	rl.on('line', (input) => {
		ws.send(input);
		console.log(`\nYou: ${input}`);
	})
});

ws.on('message', (data) => {
	console.log(`Someone: ${data}`);
})

ws.on('close', () => {
	console.log('Connection closed. Try again');
	process.exit(0);
})
