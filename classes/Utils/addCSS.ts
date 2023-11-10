import { waitUntil } from "./waitUntil"

/**
 * Adds a CSS file or style to the document body.
 * @param url - The URL of the CSS file or the CSS style content.
 * @param remote - Whether the CSS file is remote or not. Default is true.
 */
export function addCSS(url: string, remote = true) {
	waitUntil(() => document.body)
		.then(() => {
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
		})
}