import { Group } from "./Group"
import { Setting } from "./Setting"

export class Category {

	public readonly titleKey: string
	public readonly routeName: string
	public readonly loginStatus = true
	public readonly requireLogin = false
	public readonly forceDisabled = false
	public readonly computeds = { disabled: false }
	public readonly isEnabled = () => true

	constructor(public readonly name: string, public readonly group: Group) {
		this.titleKey = `MTZ_${name}`
		this.routeName = `MTZ-${name}`
	}

	addSetting(setting: Setting) {
		return this
	}
}
