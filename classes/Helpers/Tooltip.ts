export class Tooltip {

	public readonly timeout = null

	constructor(
		public readonly type: "system" | "top",
		public readonly element: HTMLElement,
		public readonly tooltipHolder: HTMLElement,
		public readonly text: String,
		public readonly fading: Boolean = false,
		public readonly ms: number = 200,
		public readonly delay: number = 200
	) {

		const tooltip = document.createElement("div")
		tooltip.setAttribute("class", "tooltip")
		tooltip.setAttribute("id", "lol-uikit-tooltip-root")
		tooltip.setAttribute("mtz", "")

		const tooltipInner = document.createElement("div")
		tooltipInner.setAttribute("type", this.type)
		tooltipInner.setAttribute("style", `top: ${this.y}px; left: ${this.x}px; opacity: ${this.fading ? 0 : 1};`)
		tooltip.appendChild(tooltipInner)

		const lolUikitTooltip = document.createElement("lol-uikit-tooltip")
		lolUikitTooltip.setAttribute("type", this.type)
		lolUikitTooltip.setAttribute("data-tooltip-position", "bottom")
		tooltipInner.appendChild(lolUikitTooltip)

		const lolUikitContentBlock = document.createElement("lol-uikit-content-block")
		lolUikitContentBlock.setAttribute("type", this.type === "system" ? "tooltip-small" : "tooltip-system")
		lolUikitTooltip.appendChild(lolUikitContentBlock)

		const p = document.createElement("p")
		p.innerHTML = this.text
		lolUikitContentBlock.appendChild(p)

		this.tooltip = tooltip
		this.tooltipInner = tooltipInner

		this.element.addEventListener("mouseenter", () => {
			this.timeout = setTimeout(() => this.update(), this.delay)
		})

		this.element.addEventListener("mouseleave", () => {
			clearTimeout(this.timeout)
			if (!this.exists()) return
			this.fade(false, true)
		})
	}

	exists() {
		return document.querySelector(`.tooltip[mtz]`)
	}

	fade(fadeIn = true, deleteAfter = false) {
		return new Promise(resolve => {
			let opacity = fadeIn ? 0 : 1
			const gap = 1000 / 120 * 0.02
			const val = fadeIn ? gap : -gap

			this.tooltipInner.style.opacity = opacity

			const timer = setInterval(() => {
				opacity += val
				this.tooltipInner.style.opacity = opacity

				if (opacity <= 0 || opacity >= 1) {
					clearInterval(timer)
					if (deleteAfter) this.tooltip.remove()
					resolve()
				}
			}, this.ms * gap)
		})
	}

	update() {

		const rect = this.tooltipHolder.getBoundingClientRect()
		const [x, y] = this.type == "top" ?
			[rect.x - rect.width - 7, rect.y + rect.height] :
			[rect.x - (rect.width / 2), rect.y + rect.height]

		this.tooltipInner.setAttribute("style", `top: ${y}px; left: ${x}px; opacity: ${this.fading ? 0 : 1};`)
		this.tooltipInner.querySelector("p").innerHTML = this.text

		if (!this.exists())
			document.querySelector("#lol-uikit-layer-manager-wrapper").appendChild(this.tooltip)

		if (this.fading)
			this.fade(true)
	}
}