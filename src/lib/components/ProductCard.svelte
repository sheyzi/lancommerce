<script lang="ts">
	import type { ProductWithRelations } from '../types/products.types';
	import { formatCurrency } from '../utils';
	import FavouriteButton from './FavouriteButton.svelte';

	export let product: ProductWithRelations;
</script>

<div class="flex flex-col gap-2 items-start mx-auto w-full rounded h-full">
	<div class="w-full overflow-hidden rounded h-[300px] relative">
		{#if product.variants[0].discountPrice}
			<div
				class=" absolute right-3 top-3 z-10 bg-epurple border-epurple text-white font-semibold shadow-sm px-2 py-1 text-xs rounded-full"
			>
				{Math.round(100 - (product.variants[0].discountPrice / product.variants[0].price) * 100)}%
				Off!!
			</div>
		{/if}
		<a href="/category/{product.category?.slug}/product/{product.slug} ">
			<img
				class="rounded w-full h-full object-cover transition-all duration-300 hover:scale-125"
				src={product.featuredImage.url}
				alt=""
			/>
		</a>
	</div>
	<div class="flex flex-col items-start w-full gap-2">
		<div class="w-full flex justify-between items-center">
			<a
				href="/category/{product.category?.slug}/product/{product.slug}"
				class="lg:text-lg line-clamp-1 text-left font-medium font-work-sans max-w-[70%] overflow-clip hover:underline"
			>
				{product.name}
			</a>
			<a
				href="/category/{product.category?.slug}"
				class="bg-elightpurple/20 px-2 py-1 text-xs rounded-full hover:bg-elightpurple/40 hover:underline"
				>{product.category?.name}</a
			>
		</div>

		<div class="flex justify-between w-full items-center">
			<p class="lg:text-base text-sm">
				{#if product.variants[0].discountPrice}
					<span class="line-through italic text-xs"
						>{formatCurrency(product.variants[0].price)}</span
					>
				{/if}
				{formatCurrency(product.variants[0].discountPrice ?? product.variants[0].price)}
			</p>
			<FavouriteButton {product} />
		</div>
	</div>
</div>

<style>
</style>
