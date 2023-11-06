/**
 * Represents an event that can be subscribed to with a callback function.
 */
class MTZEvent {
	constructor(
		public readonly event: string,
		public readonly callback: Function,
		public readonly priority: Number
	) { }
}

export default MTZEvent