module.exports = {
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	root: true,
	ignorePatterns: ["*.js", "*.cjs"],
	rules: {
		"no-unused-expressions": 1,
		"curly": 1,
		"@typescript-eslint/naming-convention": 1,
		"semi": 1,
		"eqeqeq": 1,
		"@typescript-eslint/indent": [1, "tab"],
		"no-debugger": 1,
		"@typescript-eslint/quotes": [1, "single"],
		"no-trailing-spaces": 1,
		"sort-imports": [1, { "allowSeparatedGroups": true }],
		"linebreak-style": [1, "windows"],
		"no-multiple-empty-lines": 1,
		"no-console": 1,
		"func-style": [
			1,
			"expression",
			{ "allowArrowFunctions": true }
		]
	}
};