import { MTZPlugin } from "@Classes"
import { Toggle, ToggleOptions } from "@Helpers"
import { select, subscribe, unsubscribe, waitUntil, sleep } from "@Utils"

new class extends MTZPlugin {

	private AutoAccepting = false
	private playerResponse = null
	private button: HTMLElement
	private options: ToggleOptions

	constructor() {
		super("AutoAccept", "1.0.0", "Sakurasou")

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

		this.on("screen", this.onScreen.bind(this))
		this.on("phase", this.onScreen.bind(this))
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

	override onPhase(phase: string, lastPhase: string) {
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
							select(".ready-check-button-accept").click()
						this.AutoAccepting = false
					})
				}
				break
			}
		}
	}

	onPlayerReponse(message) {
		try {
			const status = JSON.parse(message.data)[2]?.data?.playerResponse || null
			this.playerResponse = status
		} catch { }
	}
}