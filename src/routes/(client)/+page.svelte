<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import ProductsList from '$lib/components/ProductsList.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let products = data.products;
	let featuredProducts = data.featuredProducts;
</script>

<svelte:head>
	<!-- SEO friendly homepage title for A & U -->
	<title>A & U | Home</title>
</svelte:head>

<Hero />
<section class="w-full">
	<ProductsList title="Featured Products" products={featuredProducts} />
	<ProductsList title="Latest Products" {products} />
</section>

<style>
</style>
