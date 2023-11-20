const defaultOptions: RequestInit = {
	method: "GET",
	headers: {
		"Accept": "application/json",
		"Content-Type": "application/json"
	}
}

/**
 * Fetches JSON data from the specified URL using the provided options.
 * @param url - The URL to fetch the JSON data from.
 * @param options - The options to use for the fetch request.
 * @returns A Promise that resolves to the JSON data.
 */
export async function FetchJSON(url: string, options: RequestInit = defaultOptions): Promise<any> {
	try {
		const response = await fetch(url, options);
		const contentType = response.headers.get("content-type")
		return contentType?.includes("application/json") ? await response.json() : Promise.resolve(null)
	} catch (e) {
		return Promise.resolve(null)
	}
}