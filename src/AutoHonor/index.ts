import { MTZPlugin } from "@Classes"
import { waitUntil } from "@Utils"

new class extends MTZPlugin {

	constructor() {
		super("AutoHonor", "1.0.0", "Sakurasou")
	}

	override onPhase(phase: string, lastPhase: string): void {
		switch (phase) {
			case "PREENDOFGAME": {
				waitUntil(() => {
					const votes = [...document.querySelectorAll(".prompted-voting-honor-category-selector")]
					return votes.length > 0 ? votes : null
				}, 5000, (votes) => sleep(1000).then(() => votes[0 | Math.random() * votes.length].click()))
				break
			}
		}
	}
}