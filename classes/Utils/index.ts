export * from "./Subscription"
export * from "./FetchJSON"
export * from "./Kyasshu"
export * from "./ChampionList"

function select(selector: string): HTMLElement {
	return document.querySelector(selector)
}

function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}

function waitUntil(condition = () => true, callback = false, timeout = 1000): Promise<void> {
	return new Promise((resolve, reject) => {
		let interval = setInterval(() => {

			if (timeout <= 0) {
				clearInterval(interval)
				reject()
			}

			if (condition()) {
				clearInterval(interval)
				if (callback) resolve(callback(condition()))
				else resolve(condition())
			}

			timeout -= 10
		}, 10)
	})
}

async function addCSS(url: string, remote = true) {
	await waitUntil(() => document.body)
	if (remote) {
		const link = document.createElement("link")
		link.setAttribute("rel", "stylesheet")
		link.setAttribute("href", url)
		document.body.appendChild(link)
	} else {
		const style = document.createElement("style")
		style.setAttribute("type", "text/css")
		style.innerHTML = url
		document.body.appendChild(style)
	}
}

export { select, sleep, waitUntil, addCSS }