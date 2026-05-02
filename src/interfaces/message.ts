import type { Client } from '../client/Client.js';

export interface Message {
	sender: Client;
	content: string;
	date: Date;
}
