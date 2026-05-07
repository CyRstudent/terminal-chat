import type { Message } from '../../interfaces/message.js';
import type { WsEvent } from '../../interfaces/WsEvent.js';
import type { RawData } from 'ws';

const mEvent: WsEvent<[RawData]> = {
	event: 'message',
	once: false,
	execute(data, client) {
		try {
			const incoming = JSON.parse(data.toString()) as Message;
			process.stdout.write('\r\x1b[K');
			const msgTime = new Date(incoming.date).toLocaleTimeString();
			console.log(
				`\n[${incoming.sender} at ${msgTime}]: ${incoming.content}`,
			);
			client.promptInput();
		} catch {
			console.error(new Error('Failed to parse incoming message'));
		}
	},
};

export default mEvent;
