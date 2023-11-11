
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