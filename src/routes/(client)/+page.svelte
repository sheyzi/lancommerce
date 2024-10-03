<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import LatestProducts from '$lib/components/LatestProducts.svelte';
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
<LatestProducts {products} />
<section class="w-full bg-black md:px-10 px-5">
	<div
		class="md:flex justify-center gap-5 md:justify-between items-center max-w-[94rem] max-h-[800px] h-full py-10 text-white w-full mx-auto md:px-10 mt-20"
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
	<div class="max-w-[94rem] mx-auto py-10">
		<div class="bg-black w-full h-[400px]" />
	</div>
</section>

<style>
</style>
