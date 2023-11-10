/**
 * Returns the first element that matches the specified CSS selector.
 * @param selector A string containing one or more CSS selectors separated by commas.
 * @returns The first element that matches the specified selector, or null if no matches are found.
 */
export function select(selector: string): HTMLElement {
	return document.querySelector(selector)
}