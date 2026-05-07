import type { WsEvents } from '../types/WsEvents.js';
import type { Client } from '../client/Client.js';
export interface WsEvent<T extends unknown[] = unknown[]> {
	event: WsEvents;
	once: boolean;
	execute: (...args: [...T, Client]) => void;
}
