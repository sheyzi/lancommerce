<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let products = data.products;
</script>

<svelte:head>
	<!-- SEO friendly homepage title for Evolv -->
	<title>Evolv | Home</title>
</svelte:head>

<Hero />
<section role="contentinfo" class="max-w-7xl mx-auto md:px-10 px-5 mt-[60px]">
	<div class="text-center text-black flex flex-col items-center gap-10 w-full">
		<h3 class="text-2xl font-bold">LATEST PRODUCTS</h3>

		<div
			class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center w-full md:gap-5 gap-10 py-3"
		>
			{#each products as product}
				<ProductCard {product} />
			{/each}
		</div>

		<button class=" px-9 bg-eblue py-2 rounded-full text-white">View More</button>
	</div>
</section>
<section class="w-full bg-black md:px-10 px-5">
	<div
		class="md:flex justify-center gap-5 md:justify-between items-center max-w-7xl max-h-[800px] h-full py-10 text-white w-full mx-auto md:px-10 mt-20"
	>
		<div class="w-full flex flex-col md:items-start items-center text-center md:text-left gap-5">
			<h2 class="text-6xl font-universio max-w-xs">Partner with us</h2>
			<p>Become our partner and buy Shares.</p>
			<div class="flex gap-6 text-black">
				<a href="/auth/signup" class="bg-egreen px-6 py-1.5 rounded-full">Join us</a>
				<a href="/auth/login" class="bg-egreen px-6 py-1.5 rounded-full">Sign in</a>
			</div>
		</div>
		<div class="md:mt-0 mt-5">
			<img src="logo-white.svg" alt="Evolv's logo" />
		</div>
	</div>
</section>
<section class="w-full mt-20 md:px-10 px-5">
	<div class="max-w-7xl mx-auto py-10">
		<div class="bg-black w-full h-[400px]" />
	</div>
</section>

<style>
</style>
