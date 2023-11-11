import { MTZPlugin } from "@Classes"

new class extends MTZPlugin {

	constructor() {
		super("ProfileSkinUnlocker", "1.0.0", "Sakurasou")

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