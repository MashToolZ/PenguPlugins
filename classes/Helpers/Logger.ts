export class Logger {

	enabled = false

	constructor(private readonly prefix: string, private readonly style: string) { }

	log([message, style]: [string, string]): void
	log(...args: any[]): void
	log(...args: any[]) {

		switch (typeof args[0]) {
			case "object":
				console.log(`${this.prefix}%c ${args[0][0]}`, this.style, "", args[0][1], ...args.slice(1))
				break

			case "string":
				console.log(this.prefix, this.style, ...args)
				break
		}
	}

	info([message, style]: [string, string]): void
	info(...args: any[]): void
	info(...args: any[]) {
		if (!this.enabled) return

		switch (typeof args[0]) {
			case "object":
				console.info(`${this.prefix}%c ${args[0][0]}`, this.style, "", args[0][1], ...args.slice(1))
				break

			case "string":
				console.info(this.prefix, this.style, ...args)
				break
		}
	}

	warn([message, style]: [string, string]): void
	warn(...args: any[]): void
	warn(...args: any[]) {
		if (!this.enabled) return

		switch (typeof args[0]) {
			case "object":
				console.warn(`${this.prefix}%c ${args[0][0]}`, this.style, "", args[0][1], ...args.slice(1))
				break

			case "string":
				console.warn(this.prefix, this.style, ...args)
				break
		}
	}

	error([message, style]: [string, string]): void
	error(...args: any[]): void
	error(...args: any[]) {
		if (!this.enabled) return

		switch (typeof args[0]) {
			case "object":
				console.error(`${this.prefix}%c ${args[0][0]}`, this.style, "", args[0][1], ...args.slice(1))
				break

			case "string":
				console.error(this.prefix, this.style, ...args)
				break
		}
	}
}