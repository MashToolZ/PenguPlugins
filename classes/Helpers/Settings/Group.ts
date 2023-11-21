import type { Settings } from "."
import { Category } from "./Category"

export class Group {

	public categories: Category[] = []

	constructor(public Settings: Settings, public name: string, public titleKey: string, public capitalTitleKey: string) { }

	addCategory(name: string) {
		const category = new Category(name, this)
		this.categories.push(category)
		this.Settings.routes.unshift(category.routeName)
		this.Settings.translations.set(category.titleKey, name)
		return category
	}
}