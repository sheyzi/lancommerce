<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { currentUser } from '$lib/stores/user.stores';
</script>

<svelte:head>
	<title>Wishlist | Evolv</title>
</svelte:head>

<section role="contentinfo" class="max-w-7xl mx-auto md:px-10 px-5 mt-[60px]">
	<div class="text-center text-black flex flex-col items-center gap-10 w-full">
		<h3 class="text-2xl font-bold">WISHLIST</h3>

		<div
			class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center w-full md:gap-5 gap-10 py-3"
		>
			{#each $currentUser?.favourites || [] as product}
				<ProductCard {product} />
			{/each}
		</div>
	</div>
</section>
