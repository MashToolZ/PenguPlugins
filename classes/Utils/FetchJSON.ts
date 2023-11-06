export function FetchJSON(url: string, options?: RequestInit): Promise<JSON> {
	try {
		return fetch(url, options || {
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		}).then((data) => data.json())
	} catch (e) {
		console.error(e)
		return []
	}
}