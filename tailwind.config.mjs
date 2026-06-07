/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
    	extend: {
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			},
    			white: {
    				'1': '#EAE8E1'
    			},
    			gray: {
    				'1': '#161616',
    				'2': '#1C1C1C',
    				'3': '#232323',
    				'4': '#282828',
    				'5': '#2E2E2E',
    				'6': '#343434',
    				'7': '#3E3E3E',
    				'8': '#505050',
    				'9': '#707070',
    				'10': '#7E7E7E',
    				'11': '#A0A0A0',
    				'12': '#EDEDED'
    			},
    			green: {
					'1':'#0D1912',
    				'2': '#0C1F17',
					'3': '#0F291E',
					'4': '#113123',
					'5': '#133929',
					'6': '#164430',
					'7': '#1B543A',
					'8': '#236E4A',
					'9': '#30A46C',
    				'10': '#3CB179',
    				'11': '#4CC38A',
					'12': '#E5FBEB'
    			},
    			pink: {
    				'1': '#190D12',
    				'2': '#250F19',
    				'3': '#410A27',
    				'4': '#5A0032',
    				'5': '#6B003D',
    				'6': '#7D004B',
    				'7': '#99105E',
    				'8': '#C50F7A',
    				'9': '#C6127B',
    				'10': '#B5006D',
    				'11': '#FF85C2',
    				'12': '#6B234D',
    				'13': '#FFCDE4',
    				'14': '#E02994'
    			},
    			blue: {
    				'1': '#0C111C',
    				'2': '#111725',
    				'3': '#161616',
    				'4': '#172448',
    				'5': '#243974',
    				'6': '#2D4484',
    				'7': '#375098',
    				'8': '#405EB2',
    				'9': '#4571FF',
    				'10': '#3F5CB0',
    				'11': '#93B4FF',
    				'12': '#D5E2FF'
    			},
    			magenta: {
    				'1': '#1F1126',
    				'2': '#331543',
    				'3': '#161616',
    				'4': '#44135A',
    				'5': '#501B69',
    				'6': '#5D2778',
    				'7': '#375098',
    				'8': '#9347BA',
    				'9': '#C048F8',
    				'10': '#B338EA',
    				'11': '#E190FF',
    				'12': '#F2D2FF'
    			},
    			red: {
    				'1': 'var(--red-1)',
    				'2': 'var(--red-2)',
    				'3': 'var(--red-3)',
    				'4': 'var(--red-4)',
    				'5': 'var(--red-5)',
    				'6': 'var(--red-6)',
    				'7': 'var(--red-7)',
    				'8': 'var(--red-8)',
    				'9': 'var(--red-9)',
    				'10': 'var(--red-10)',
    				'11': 'var(--red-11)',
    				'12': 'var(--red-12)',
    				a1: 'var(--red-a1)',
    				a2: 'var(--red-a2)',
    				a3: 'var(--red-a3)',
    				a4: 'var(--red-a4)',
    				a5: 'var(--red-a5)',
    				a6: 'var(--red-a6)',
    				a7: 'var(--red-a7)',
    				a8: 'var(--red-a8)',
    				a9: 'var(--red-a9)',
    				a10: 'var(--red-a10)',
    				a11: 'var(--red-a11)',
    				a12: 'var(--red-a12)'
    			}
    		},
    		fontFamily: {
    			Inter: [
    				'Inter Variable', 
    				'Inter', 
    				'system-ui', 
    				'-apple-system', 
    				'BlinkMacSystemFont', 
    				'"Segoe UI"', 
    				'Roboto', 
    				'Oxygen', 
    				'Ubuntu', 
    				'Cantarell', 
    				'sans-serif'
    			],
    			sans: [
    				'Inter Variable', 
    				'Inter', 
    				'system-ui', 
    				'-apple-system', 
    				'BlinkMacSystemFont', 
    				'"Segoe UI"', 
    				'Roboto', 
    				'Oxygen', 
    				'Ubuntu', 
    				'Cantarell', 
    				'sans-serif'
    			]
    		},
    		keyframes: {
    			glitch: {
    				'0%': {
    					opacity: '0'
    				},
    				'50%': {
    					opacity: '0'
    				},
    				'100%': {
    					opacity: '100'
    				}
    			},
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	}
    },
	plugins: [
		require("@tailwindcss/typography"),
		require("windy-radix-palette"),
		require("tailwindcss-radix")(),
		  require("tailwindcss-animate")
	],}
