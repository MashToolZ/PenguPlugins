import { MTZPlugin } from "@Classes"
import { Toggle, ToggleOptions } from "@Helpers"
import { FetchJSON, select, waitUntil } from "@Utils"

new class extends MTZPlugin {

	private button: HTMLElement
	private options: ToggleOptions

	constructor() {
		super(import("./package.json"))
	}

	override init(): void {
		this.options = {
			parent: ".open-party-toggle",
			name: this.name,
			className: "auto-honor",
			tooltip: "Automatically honor a random teammate"
		}

		this.addCSS("https://cdn.mashtoolz.xyz/lolclient/css/sweetalert2.css")
		this.addCSS("https://cdn.mashtoolz.xyz/lolclient/css/AutoHonor.css")
		import("https://cdn.mashtoolz.xyz/lolclient/js/sweetalert2.js").then(() => {
			window.Toast = Sweetalert2.mixin({
				toast: true,
				position: "top",
				showConfirmButton: false,
				timer: 2000,
				timerProgressBar: true,
				showCloseButton: true
			})
		})
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

				let hasVoted = false
				const canVote = Symbol("canVote")
				Reflect.defineProperty(Object.prototype, "canVote", {
					configurable: true,
					async get() {
						if (!hasVoted && this.hasOwnProperty("eligiblePlayers") && this.hasOwnProperty("gameId")) {

							hasVoted = true
							Reflect.deleteProperty(Object.prototype, "canVote")

							const { eligiblePlayers } = await FetchJSON("/lol-honor-v2/v1/ballot")
							const party = await FetchJSON("/lol-lobby/v2/comms/members")

							const puuids = eligiblePlayers.map(e => e.puuid)
							const partyPuuids = Object.values(party.players).map(p => p.puuid).filter(puuid => puuids.includes(puuid))

							const players = partyPuuids.length > 0 ? eligiblePlayers.filter(e => partyPuuids.includes(e.puuid)) : eligiblePlayers
							const { puuid, summonerId, summonerName } = players[Math.random() * players.length | 0]

							Toast.fire({
								icon: "success",
								title: `Honored ${summonerName}`
							})

							FetchJSON("/lol-honor-v2/v1/honor-player", {
								method: "POST",
								headers: {
									"Accept": "application/json",
									"Content-Type": "application/json"
								},
								body: JSON.stringify({ gameId: this.gameId, puuid, summonerId, honorType: "HEART" })
							})
						}
						return this[canVote]
					},
					set(value) {
						this[canVote] = value
					}
				})
				break
			}

			default: {
				this.voted = false
				Reflect.deleteProperty(Object.prototype, "canVote")
				break
			}
		}
	}
}