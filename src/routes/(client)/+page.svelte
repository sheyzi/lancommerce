<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import LatestProducts from '$lib/components/LatestProducts.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let products = data.products;
</script>

<svelte:head>
	<!-- SEO friendly homepage title for A & U -->
	<title>A & U | Home</title>
</svelte:head>

<Hero />
<LatestProducts title="Featured Products" {products} />
<LatestProducts title="Latest Products" {products} />


<style>
</style>
