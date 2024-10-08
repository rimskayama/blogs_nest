module.exports = {
	extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:@typescript-eslint/recommended'],
	plugins: ['prettier', '@typescript-eslint'],
	rules: {
		eqeqeq: 'error',
		'no-console': 'off',
		'no-undef': 'off',
		'no-unused-vars': 'off',
		'prettier/prettier': [2, { useTabs: true, endOfLine: 'auto' }],
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': 'warn',
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
	},
	env: {
		browser: true,
		node: true,
		es6: true,
		jest: true,
	},
	ignorePatterns: ['node_modules', 'build', 'dist', 'public', './eslintrc.js'],
};
