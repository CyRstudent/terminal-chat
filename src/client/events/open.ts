import type { WsEvent } from '../../interfaces/WsEvent.js';
const oEvent: WsEvent<[]> = {
	event: 'open',
	once: false,
	execute(client) {
		console.log('Client is ready!');
		client.promptInput();
	},
};

export default oEvent;
