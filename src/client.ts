import { Client } from './client/Client.js';
import { default as config } from '../config.json' with { type: 'json' };
import * as readline from 'node:readline/promises';

async function main() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	const username = await rl.question('Enter here your username: ');
	rl.close();

	const client = new Client(config.port, username);
	client.start();
}

void main();
