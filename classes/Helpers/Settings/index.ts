import { Group } from "./Group"

export class Settings {

	public routes: string[] = []
	public groups: Group[] = []
	public translations: Map<string, string> = new Map([
		["MTZ_Title", "MTZ"],
		["MTZ_Title_Capital", "MTZ"],
		["MTZ_General", "General"]
	])

	constructor() {
		this.#addGroup("MTZ", "MTZ_Title", "MTZ_Title_Capital")
			.addCategory("General")
	}

	#addGroup(name: string, titleKey: string, capitalTitleKey: string) {
		const group = new Group(this, name, titleKey, capitalTitleKey)
		this.groups.unshift(group)
		return group
	}

	#getGroup(name: string) {
		return this.groups.find(group => group.name === name)
	}

	addCategory(name: string) {
		return this.#getGroup("MTZ")!.addCategory(name)
	}

	init(api: any) {
		for (const group of this.groups) {
			api._modalManager._registeredCategoryGroups.splice(1, 0, group)
			api._modalManager._refreshCategoryGroups()
		}
	}

	build(builder: any, Ember: any) {
		// TODO: figure out what the fuck Riot smoked

		// builder.addRoute("MTZ-General", Ember.Route.extend())
		// builder.addController("MTZ-General", Ember.Controller.extend())
		// builder.addTemplate("MTZ-General", Ember.HTMLBars.template())
	}

	translate(api: any) {
		const { translations } = this
		const tra = api.tra()
		const get = tra.__proto__.get
		tra.__proto__.get = function (key: string) {
			return translations.get(key) ?? get.apply(this, arguments)
		}
	}
}