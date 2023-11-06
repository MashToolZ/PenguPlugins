import { defineConfig } from "tsup"

export default defineConfig((config) => {
	return {
		clean: true,
		dts: false,
		entry: ["src/**/*.ts", "!src/**/*.d.ts"],
		outDir: "../PenguLoader/plugins",
		format: ["esm"],
		minify: true,
		skipNodeModulesBundle: true,
		sourcemap: false,
		target: "es2020",
		tsconfig: "tsconfig.json",
		bundle: true,
		keepNames: true,
		splitting: false,
		shims: true
	}
})