import { MTZPlugin } from "@Classes"

new class extends MTZPlugin {

	constructor() {
		super(import("./package.json"))
	}

	override init(): void {
		Object.defineProperty(HTMLScriptElement.prototype, "src", {
			get() {
				return this.getAttribute("src")
			},
			set(value) {
				if (value === "/fe/lol-skins-picker/rcp-fe-lol-skins-picker.js")
					value = "https://cdn.mashtoolz.xyz/lolclient/js/rcp-fe-lol-skins-picker.js"
				this.setAttribute("src", value)
			}
		})
	}
}