import WebSocket from 'ws';
import * as readline from 'node:readline';
import { type Message } from '../interfaces/message.js';
export class Client {
	private ws: WebSocket;
	private rl: readline.Interface;
	identifier: number;
	name: string;

	constructor(port: number, name: string) {
		this.ws = new WebSocket(`ws://localhost:${port}`);
		this.rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		this.identifier = Date.now();
		this.name = name;
	}

	private promptInput(): void {
		this.rl.question('You: ', (ans) => {
			this.sendMessage(ans);
			this.promptInput();
		});
	}
	start(): void {
		this.ws.on('open', () => {
			console.log('Ready');
			this.promptInput();
		});
		this.ws.on('message', (data: WebSocket.RawData) => {
			try {
				const incoming = JSON.parse(data.toString()) as Message;
				process.stdout.write('\r\x1b[K');
				const msgTime = new Date(incoming.date).toLocaleTimeString();
				console.log(
					`\n[${incoming.sender} at ${msgTime}]: ${incoming.content}`,
				);
				this.promptInput();
			} catch {
				console.error(new Error('Failed to parse incoming message'));
			}
		});
		this.ws.on('close', () => {
			console.log('Disconnected from the server');
			process.exit(0);
		});
		this.rl.on('SIGINT', () => {
			this.ws.close();
		});
	}

	sendMessage(content: string): void {
		const payload: Message = {
			content: content,
			sender: this,
			date: new Date(),
		};
		this.ws.send(JSON.stringify(payload));
	}
}
