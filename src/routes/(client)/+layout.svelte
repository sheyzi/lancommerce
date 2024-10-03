<script lang="ts">
	import Lenis from 'lenis'
	import Navbar from '$lib/components/Navbar.svelte';

	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	onMount(() => {
		const lenis = new Lenis()

lenis.on('scroll', (e) => {
  console.log(e)
})

function raf(time: number) {
  lenis.raf(time)
			requestAnimationFrame(raf)
		}

		requestAnimationFrame(raf)
	})
</script>

<div class="flex flex-col min-h-screen">
	<Navbar />
	<main class="flex-grow">
		<slot />
	</main>
	<Footer />
</div>
