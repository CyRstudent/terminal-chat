import type { WsEvent } from '../../interfaces/WsEvent.js';

const cEvent: WsEvent<[]> = {
	event: 'close',
	once: false,
	execute(client) {
		console.log(
			`Client with name ${client.name} has disconnected from the server`,
		);
		process.exit(0);
	},
};

export default cEvent;
