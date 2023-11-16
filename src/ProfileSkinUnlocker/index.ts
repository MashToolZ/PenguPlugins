import { MTZPlugin } from "@Classes"
import { waitUntil } from "@Utils"

new class extends MTZPlugin {

	constructor() {
		super(import("./package.json"))
	}

	override onScreen(screen: string, lastScreen: string): void {
		switch (screen) {
			case "PROFILE": {
				const owned = Symbol("owned")
				Reflect.defineProperty(Object.prototype, "owned", {
					configurable: true,
					get() {
						return (this.hasOwnProperty("loyaltyReward") && this.hasOwnProperty("rental") && this.hasOwnProperty("xboxGPReward")) || this[owned]
					},
					set(value) {
						this[owned] = value
					}
				})
				break
			}

			default: {
				Reflect.deleteProperty(Object.prototype, "owned")
				break
			}
		}
	}
}