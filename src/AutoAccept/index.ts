import { MTZPlugin } from "@Classes"
import { Toggle, ToggleOptions } from "@Helpers"
import { GameFlowPhase, GameScreen, PlayerResponse } from "@Types"
import { select, subscribe, unsubscribe, waitUntil, sleep, FetchJSON } from "@Utils"

new class extends MTZPlugin {

	private AutoAccepting = false
	private playerResponse: PlayerResponse = null
	private options!: ToggleOptions

	constructor() {
		super(import("./package.json"))
	}

	override onInit(): void {

		this.options = {
			parent: ".open-party-toggle",
			name: this.name,
			className: "auto-accept",
			tooltip: "Automatically accept Queue Popups",
			onEnable: () => {
				subscribe("/lol-matchmaking/v1/ready-check", "ReadyCheck", this.onPlayerReponse.bind(this))
			},
			onDisable: () => {
				unsubscribe("/lol-matchmaking/v1/ready-check", "ReadyCheck")
			}
		}

		this.addCSS("https://cdn.mashtoolz.xyz/lolclient/css/AutoAccept.css")
	}

	override onScreen(screen: GameScreen) {
		switch (screen) {
			case "PARTIES": {
				waitUntil(() => select(this.options.parent))
					.then(() => {
						if (!select(`#${this.options.name}`))
							new Toggle(this.options)
					})
					.catch((reason) => this.Logger.error(reason))
				break
			}
		}
	}

	override onPhase(phase: GameFlowPhase) {
		switch (phase) {

			case "LOBBY":
			case "MATCHMAKING": {
				this.playerResponse = null
				this.AutoAccepting = false
				break
			}

			case "READYCHECK": {
				if (DataStore.get(`MTZ.${this.name}`) && !this.AutoAccepting) {
					this.AutoAccepting = true
					sleep(3000).then(() => {
						if (this.playerResponse === "None" || this.playerResponse === null)
							FetchJSON("/lol-matchmaking/v1/ready-check/accept", { method: "POST" })
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