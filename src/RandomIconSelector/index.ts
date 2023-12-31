import { MTZ, MTZPlugin } from "@Classes"
import { select, sleep } from "@Utils"

new class extends MTZPlugin {

	private pool: Set<string> = new Set(DataStore.get("MTZ.iconPool") || [])

	private hoverSFX = "/fe/lol-static-assets/sounds/sfx-summoner-icons-grid-hover.ogg"
	private selectSFX = "/fe/lol-static-assets/sounds/sfx-summoner-icons-select.ogg"

	constructor() {
		super(import("./package.json"))
	}

	override update() {
		const customizerTabs = select(".challenges-identity-customizer-tab")
		if (!customizerTabs) return

		const selectedTab = select(".customizer-nav-item-container > lol-uikit-navigation-item[active]")
		if (!selectedTab) return

		const tabIndex = [...customizerTabs.children].indexOf(selectedTab.parentNode as Element)
		switch (tabIndex) {
			case 0: {
				const button = select("#random-icon-button")
				if (button) return

				const grid = select(".identity-customizer-grid > lol-uikit-scrollable")
				if (!grid) return

				const currentIcon = select(".identity-customizer-icon.selected")
				if (currentIcon)
					return this.createButton(grid)

				const iconId = select(".challenges-identity-customizer-banner-container > lol-regalia-identity-customizer-element")?.getAttribute("profile-icon")
				if (!iconId) return
				grid.querySelector(`.identity-customizer-icon[src*='${iconId}']`)?.classList.add("selected")
			}
		}
	}

	createButton(grid: HTMLElement) {
		const header = document.createElement("div")
		header.className = "identity-customizer-icon-header"
		header.innerText = "RANDOM"

		const randomBtn = document.createElement("div")
		randomBtn.className = "identity-customizer-tab-icon-component"
		randomBtn.onmouseover = () => MTZ.playSound(this.hoverSFX, "sfx")
		randomBtn.onclick = () => this.selectRandomIcon(grid)
		randomBtn.oncontextmenu = () => this.selectRandomIcon(grid, true)

		const randomImg = document.createElement("img")
		randomImg.className = "identity-customizer-icon"
		randomImg.src = "/fe/lol-champ-select/images/champion-grid/random-champion.png"
		randomImg.id = "random-icon-button"
		randomBtn.appendChild(randomImg)

		grid.prepend(randomBtn)
		grid.prepend(header)

		this.poolInteraction(grid, header)
	}

	poolInteraction(grid: HTMLElement, header: HTMLElement) {
		const icons = [...grid.querySelectorAll(".identity-customizer-tab-icon-component > img")].filter(icon => icon.id !== "random-icon-button") as HTMLImageElement[]
		for (const icon of icons)
			icon.oncontextmenu = () => this.editPool(grid, header, icon)

		sleep(20).then(() => {
			const poolIcons = icons.filter(icon => this.pool.has(icon.src.split("profile-icons/").pop()!.split(".")[0]))
			for (const icon of poolIcons)
				this.editPool(grid, header, icon, false)
		})
	}

	getNextHeader(header: HTMLElement) {
		const headers = [...document.querySelectorAll(".identity-customizer-icon-header")]
		const index = headers.indexOf(header)
		return headers[index + 1]
	}

	editPool(grid: HTMLElement, header: HTMLElement, icon: HTMLImageElement, sound: boolean = true) {
		if (sound)
			MTZ.playSound(this.selectSFX, "sfx")

		const nextHeader = this.getNextHeader(header)
		const iconId = icon.parentElement?.getAttribute("iconid") || icon.src.split("profile-icons/").pop()!.split(".")[0]

		if (icon.parentElement!.classList.contains("inPool")) {
			const hiddenElement = grid.querySelector(`.hiddenIcon[iconId='${iconId}']`) as HTMLElement
			hiddenElement.style.display = ""
			hiddenElement.removeAttribute("iconid")
			hiddenElement.classList.remove("hiddenIcon")
			grid.removeChild(icon.parentElement as Node)
			this.pool.delete(iconId)
		} else {
			const poolElement = icon.parentElement!.cloneNode(true) as HTMLElement
			poolElement.classList.add("inPool")
			poolElement.oncontextmenu = () => this.editPool(grid, header, poolElement.querySelector("img") as HTMLImageElement)
			icon.parentElement!.style.display = "none"
			icon.parentElement!.setAttribute("iconid", iconId)
			icon.parentElement!.classList.add("hiddenIcon")
			grid.insertBefore(poolElement, nextHeader)
			this.pool.add(iconId)
		}

		DataStore.set("MTZ.iconPool", [...this.pool])
	}

	selectRandomIcon(grid: HTMLElement, allIcons: boolean = false) {

		const icons = [...grid.querySelectorAll(`.identity-customizer-tab-icon-component${allIcons ? "" : ".inPool"} > img.identity-customizer-icon:not(.selected):not([id='random-icon-button'])`)] as HTMLImageElement[]
		if (icons.length === 0) return

		const random = Math.floor(Math.random() * icons.length)
		const randomIconId = icons[random].src.split("profile-icons/").pop()!.split(".")[0]
		const selectedIcon = grid.querySelector(`.identity-customizer-icon[src*='${randomIconId}']`) as HTMLImageElement

		if (selectedIcon) {
			selectedIcon.click()
			selectedIcon.classList.add("selected")

			const prevSelectedIcon = grid.querySelector(".identity-customizer-icon.selected:not([src*='" + randomIconId + "'])")
			if (prevSelectedIcon)
				prevSelectedIcon.classList.remove("selected")
		}
	}
}