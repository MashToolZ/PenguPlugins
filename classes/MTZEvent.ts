/**
 * Represents an event that can be subscribed to with a callback function.
 */
export class MTZEvent {
	constructor(
		public readonly event: string,
		public readonly callback: Function,
		public readonly priority: number
	) { }
}