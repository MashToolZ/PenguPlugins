export function weightedRand(spec: Record<string, number>): () => string {

	const table: string[] = []
	for (const i in spec) {
		for (let j = 0; j < 1000 * spec[i]; j++)
			table.push(i)
	}

	return () => {
		return table[Math.floor(Math.random() * table.length)]
	}
}