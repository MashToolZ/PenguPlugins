/**
 * Fetches JSON data from the specified URL using the provided options.
 * @param url - The URL to fetch the JSON data from.
 * @param options - The options to use for the fetch request.
 * @returns A Promise that resolves to the JSON data.
 */
export async function FetchJSON(url: string, options?: RequestInit): Promise<any> {
	try {
		const data = await fetch(url, options || {
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		})
		return await data.json()
	} catch (e) {
		console.error(e)
		return Promise.resolve(null)
	}
}