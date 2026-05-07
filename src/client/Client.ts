import WebSocket from 'ws';
import * as readline from 'node:readline';
import { type Message } from '../interfaces/message.js';
import type { WsEvent } from '../interfaces/WsEvent.js';
import { readdirSync } from 'node:fs';

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

	public promptInput(): void {
		this.rl.question('You: ', (ans) => {
			this.sendMessage(ans);
			this.promptInput();
		});
	}
	async start(): Promise<void> {
		// Event handling
		const eventFiles: string[] = readdirSync('./src/client/events');
		for (const file of eventFiles) {
			const module = await import(`./events/${file.replace('ts', 'js')}`);
			const item: WsEvent = module.default;
			if (item.once) {
				this.ws.once(item.event.toString(), (...args: unknown[]) => {
					item.execute(args, this);
				});
			} else {
				this.ws.on(item.event.toString(), (...args: unknown[]) => {
					item.execute(args, this);
				});
			}
		}

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
