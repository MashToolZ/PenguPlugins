import { MTZPlugin } from "@Classes"
import { Toggle, ToggleOptions } from "@Helpers"
import { select, waitUntil } from "@Utils"

new class extends MTZPlugin {

	private button: HTMLElement
	private options: ToggleOptions

	constructor() {
		super(import("./package.json"))

		this.options = {
			parent: ".open-party-toggle",
			name: this.name,
			className: "auto-honor",
			tooltip: "Automatically honor a random teammate"
		}

		this.addCSS("https://cdn.mashtoolz.xyz/lolclient/css/AutoHonor.css")
	}

	override onScreen(screen: string) {
		switch (screen) {
			case "PARTIES": {
				waitUntil(() => select(this.options.parent), 1000, false)
					.then(() => {
						if (!select(`#${this.options.name}`))
							this.button = new Toggle(this.options)
					})
					.catch((err) => console.error(err))
				break
			}
		}
	}

	override onPhase(phase: string, lastPhase: string): void {
		switch (phase) {
			case "PREENDOFGAME": {
				if (!(DataStore.get(`MTZ.${this.name}`) || false)) return

				waitUntil(() => {
					const votes = [...document.querySelectorAll(".prompted-voting-honor-category-selector")]
					return votes.length > 0 ? votes : null
				}, 5000, (votes) => sleep(1000).then(() => votes[0 | Math.random() * votes.length].click()))
				break
			}
		}
	}
}