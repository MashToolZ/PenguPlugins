/**
 * Represents the type of audio channel
 */
export type AudioChannel = "music" | "voice" | "sfx"

export interface Group {
	id: number,
	name: string
}

export interface Friend {
	availability: string
	displayGroupId: number
	summonerId: number
}

export type ContextMenuType = "Friend" | "Folder"