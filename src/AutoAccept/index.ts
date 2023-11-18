import { MTZPlugin } from "@Classes"
import { Toggle, ToggleOptions } from "@Helpers"
import { select, subscribe, unsubscribe, waitUntil, sleep } from "@Utils"

new class extends MTZPlugin {

	private AutoAccepting = false
	private playerResponse = null
	private options!: ToggleOptions

	constructor() {
		super(import("./package.json"))
	}

	override init(): void {

		this.options = {
			parent: ".open-party-toggle",
			name: this.name,
			className: "auto-accept",
			tooltip: "Automatically accept Queue Popups",
			onEnable: () => {
				subscribe("/lol-matchmaking/v1/ready-check", "ReadyCheck", this.onPlayerReponse)
			},
			onDisable: () => {
				unsubscribe("/lol-matchmaking/v1/ready-check", "ReadyCheck")
			}
		}

		this.addCSS("https://cdn.mashtoolz.xyz/lolclient/css/AutoAccept.css")
	}

	override onScreen(screen: string) {
		switch (screen) {
			case "PARTIES": {
				waitUntil(() => select(this.options.parent), 2000)
					.then(() => {
						if (!select(`#${this.options.name}`))
							new Toggle(this.options)
					})
					.catch((err) => console.error(err))
				break
			}
		}
	}

	override onPhase(phase: string, _lastPhase: string) {
		switch (phase) {

			case "LOBBY":
			case "MATCHMAKING": {
				this.playerResponse = null
				break
			}

			case "READYCHECK": {
				if (DataStore.get(`MTZ.${this.name}`) && !this.AutoAccepting) {
					this.AutoAccepting = true
					sleep(3000).then(() => {
						if (this.playerResponse !== "None")
							select(".ready-check-button-accept")!.click()
						this.AutoAccepting = false
					})
				}
				break
			}
		}
	}

	onPlayerReponse(message: { data: string }) {
		try {
			const status = JSON.parse(message.data)[2]?.data?.playerResponse || null
			this.playerResponse = status
		} catch { }
	}
}