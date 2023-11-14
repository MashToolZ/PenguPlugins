import { MTZPlugin } from "@Classes"
import { Tooltip } from "@Helpers"
import { select, waitUntil } from "@Utils"

new class extends MTZPlugin {

	constructor() {
		super(import("./package.json"))
	}

	override init(): void {
		this.addCSS("https://cdn.mashtoolz.xyz/lolclient/css/HideFriends.css")
	}

	update() {
		const hideButton = select(".action-bar-button.hide-button")
		const socialBar = select(".lol-social-actions-bar.actions")
		if (!hideButton && socialBar)
			this.createHideButton(socialBar)
	}

	createHideButton(socialBar: HTMLElement) {
		const hideButton = document.createElement("span")
		hideButton.className = "action-bar-button hide-button"
		hideButton.addEventListener("click", function () {
			DataStore.set("MTZ.hideFriends", this.classList.toggle("toggled") ? "hidden" : "visible")
			select("lol-social-roster.roster.social-ember-fade-in").style.visibility = this.classList.contains("toggled") ? "hidden" : "visible"
		})

		DataStore.get("MTZ.hideFriends") === "hidden" && hideButton.click()

		socialBar.querySelector(".action-bar-button.ember-view")?.insertAdjacentElement("afterend", hideButton)

		new Tooltip("top", hideButton, hideButton, "Toggle Visibility", true, 200, 300)
	}
}