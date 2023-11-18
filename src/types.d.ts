// internal types

interface Plugin {
	init?: (context: any) => any
	load?: () => any
	default?: Function | any
}

interface RcpAnnouceEvent extends CustomEvent {
	errorHandler: () => any
	registrationHandler: (registrar: (e: any) => Promise<any>) => Promise<any> | void
}

// built-in types

interface Action {
	id?: string
	name: string | (() => string)
	legend?: string | (() => string)
	tags?: string[]
	icon?: string
	group?: string | (() => string)
	hidden?: boolean
	perform?: (id?: string) => any
}

interface CommandBar {
	addAction: (action: any) => void
	show: () => void
	update: () => void
}

interface Toast {
	success: (message: string) => void
	error: (message: string) => void
	promise: <T>(
		promise: Promise<T>,
		msg: { loading: string, success: string, error: string }
	) => Promise<T>
}

interface DataStore {
	has: (key: string) => boolean
	get: <T>(key: string, fallback?: T) => T | undefined
	set: (key: string, value: any) => boolean
	remove: (key: string) => boolean
}

type ThemeName = 'light' | 'dark';
type EffectName = 'mica' | 'blurbehind' | 'blur' | 'acrylic' | 'unified' | 'transparent';

interface Effect {
	get current(): EffectName | null
	apply: (name: EffectName, options?: any) => boolean
	clear: () => void
	setTheme: (theme: ThemeName) => boolean
}

interface FileStat {
	fileName: string
	length: number
	isDir: boolean
}

interface PluginFS {
	read: (path: string) => Promise<string | undefined>
	write: (path: string, content: string, enableAppendMode: boolean) => Promise<boolean>
	mkdir: (path: string) => Promise<boolean>
	stat: (path: string) => Promise<FileStat | undefined>
	ls: (path: string) => Promise<string[] | undefined>
	rm: (path: string, recursively: boolean) => Promise<number>
}

interface RCP {
	preInit: (name: string, callback: (context: any) => void) => void;
	postInit: (name: string, callback: (context: any) => void, blocking?: boolean) => void;
	whenReady: (name: string) => Promise<any>;
	get: (name: string) => any;
}

// globals

declare namespace Pengu {
	const version: string;
	const superPotato: boolean;
	const plugins: string[];
}

declare const DataStore: DataStore;
declare const CommandBar: CommandBar;
declare const Toast: Toast;
declare const Effect: Effect;
declare const PluginFS: PluginFS;
declare const rcp: RCP;

declare const openDevTools: (remote?: boolean) => void;
declare const openAssetsFolder: () => void;
declare const openPluginsFolder: (path?: string) => boolean;
declare const reloadClient: () => void;
declare const restartClient: () => void;
declare const getScriptPath: () => string | undefined;
declare const __llver: string;

declare interface Window {

	DataStore: DataStore;
	CommandBar: CommandBar;
	Toast: Toast;
	Effect: Effect;
	PluginFS: PluginFS;
	rcp: RCP;

	openDevTools: typeof openDevTools;
	openAssetsFolder: typeof openAssetsFolder;
	openPluginsFolder: typeof openPluginsFolder;
	reloadClient: typeof reloadClient;
	restartClient: typeof restartClient;
	getScriptPath: typeof getScriptPath;
	__llver: string;
}
