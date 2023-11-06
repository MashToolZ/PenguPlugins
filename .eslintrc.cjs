module.exports = {
	root: true,
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint", "@typescript-plugin-css-modules"],
	rules: {
		"@typescript-eslint/no-explicit-any": "off"
	},
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2020,
	},
	env: {
		es2020: true,
		browser: true,
		node: true,
	},
}
