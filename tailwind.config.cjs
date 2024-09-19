/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				karla: ['Karla', 'sans-serif'],
				jakarta: ['Plus Jakarta Sans', 'sans-serif'],
				universo: ['Universo', 'sans-serif'],
				'work-sans': ['Work Sans', 'sans-serif']
			},
			colors: {
				black: '#111111',
				light: '#f4f4f4',
				eyellow: '#ffe600',
				epurple: '#762ebb',
				eblue: '#3fb8ff',
				egreen: '#8fef98',
				elightpurple: '#e9a4fd'
			}
		}
	},

	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				light: {
					...require('daisyui/src/theming/themes')['[data-theme=light]'],
					primary: '#3fb8ff',
					'primary-focus': '#1f5a7d'
				}
			}
		]
	}
};

module.exports = config;
