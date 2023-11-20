/**
 * Represents an event that can be subscribed to with a callback function.
 */
export interface MTZEvent {
	event: string,
	callback: Function,
	priority: number
}

/**
 * Represents a group with an id and a name.
 */
export interface Group {
	id: number,
	name: string
}

/**
 * Represents a friend
 */
export interface Friend {
	availability: string
	displayGroupId: number
	summonerId: number
}

/**
 * Represents the type of audio channel
 */
export type AudioChannel = "music" | "voice" | "sfx"

/**
 * Represents the type of context menu
 */
export type ContextMenuType = "Friend" | "Folder"

/**
 * Represents the type of player response from ReadyCheck
 */
export type PlayerResponse = null | "None" | "Accepted" | "Declined"

/**
 * Represents the different Gameflow Phases
 */
export type GameFlowPhase = "LOBBY" | "MATCHMAKING" | "READYCHECK" | "CHAMPSELECT" | "GAMESTART" | "INPROGRESS" | "PREENDOFGAME" | "ENDOFGAME" | "WAITINGFORSTATS" | "NONE"

/**
 * Represents the different Screens
 */
export type GameScreen = "UNKNOWN" | "LOADING" | "HOME-MAIN" | "TFT" | "HOME" | "EVENT" | "COMPETITIVE" | "PROFILE" | "COLLECTION" | "LOOT" | "STORE" | "GAME_SELECTION" | "PARTIES"