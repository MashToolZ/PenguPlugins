import { MTZ, MTZPlugin } from "@Classes"
import { Toggle, ToggleOptions } from "@Helpers"
import { FetchJSON, select, waitUntil } from "@Utils"

new class extends MTZPlugin {

	private options!: ToggleOptions

	constructor() {
		super(import("./package.json"))
	}

	override onInit(): void {
		this.options = {
			parent: ".open-party-toggle",
			name: this.name,
			className: "auto-honor",
			tooltip: "Automatically honor a random teammate"
		}

		this.addCSS("https://cdn.mashtoolz.xyz/lolclient/css/sweetalert2.css")
		this.addCSS("https://cdn.mashtoolz.xyz/lolclient/css/AutoHonor.css")
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

	override onPhase(phase: string, _lastPhase: string): void {
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
							const party = await FetchJSON("/lol-lobby/v2/comms/members") as { players: { puuid: string }[] }

							const puuids = eligiblePlayers.map((e: { puuid: string }) => e.puuid)
							const partyPuuids = Object.values(party.players).map(p => p.puuid).filter(puuid => puuids.includes(puuid))

							const players = partyPuuids.length > 0 ? eligiblePlayers.filter((e: { puuid: string }) => partyPuuids.includes(e.puuid)) : eligiblePlayers
							const { puuid, summonerId, summonerName } = players[Math.random() * players.length | 0]

							MTZ.Toast({
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
				Reflect.deleteProperty(Object.prototype, "canVote")
				break
			}
		}
	}
}