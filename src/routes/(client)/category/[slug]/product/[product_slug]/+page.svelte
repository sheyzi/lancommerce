<script lang="ts">
	import type { Image } from '@prisma/client';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import type { PageData } from './$types';
	import { formatCurrency, showToastr } from '$lib/utils';
	import type { ProductWithRelations, VariantWithRelations } from '$lib/types/products.types';
	import { addToCart } from '../../../../../../lib/stores/cart.stores';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let data: PageData;

	let product = data.product as ProductWithRelations;
	let relatedProducts = data.relatedProducts as ProductWithRelations[];
	let activeVariant = product.variants[0] as VariantWithRelations;
	let variantSelected = false;
	let images: Image[] = [];
	let quantityToBuy = 0;

	onMount(() => {
		const variantId = $page.url.searchParams.get('variant');
		if (variantId) {
			const selectedVariant = product.variants.find(v => v.id === variantId);
			if (selectedVariant) {
				activeVariant = selectedVariant;
				variantSelected = true;
			}
		}
	});

	$: {
		product = data.product as ProductWithRelations;
		relatedProducts = data.relatedProducts as ProductWithRelations[];
		activeVariant = product.variants[0];
		quantityToBuy = 0;
	}

	$: {
		images = [product.featuredImage];

		product?.variants.forEach((variant) => {
			if (variant?.images) {
				images = [...images, ...variant.images];
			}
		});
	}

	$: {
		if (variantSelected) {
			// images = [product.featuredImage];

			images = [...activeVariant.images];
		}
	}
</script>

<svelte:head>
	<title>
		{product.name} - Evolv
	</title>
</svelte:head>

<main class="max-w-[94rem] mx-auto md:px-10 px-5 my-[60px] py-10" role="contentinfo">
	<section class="grid w-full grid-cols-1 md:grid-cols-2 gap-2" role="main">
		<div>
			<div class="w-full flex flex-col gap-3">
				<img
					style="aspect-ratio: 4/3"
					class="w-full object-cover h-auto cursor-pointer"
					src={variantSelected ? activeVariant.images[0].url : product?.featuredImage.url}
					alt={product.name}
				/>

				<div class="flex flex-wrap gap-2">
					<button
						class="w-20 h-20 border-2 transition-colors duration-200 {
							!variantSelected ? 'border-black' : 'border-gray-300 hover:border-black'
						}"
						on:click={() => {
							variantSelected = false;
							activeVariant = product.variants[0];
						}}
					>
						<img
							src={product.featuredImage.url}
							alt="Featured"
							class="w-full h-full object-cover"
						/>
					</button>
					{#each product.variants as variant}
						<button
							class="w-20 h-20 border-2 transition-colors duration-200 {
								variantSelected && activeVariant.id === variant.id
									? 'border-black'
									: 'border-gray-300 hover:border-black'
							}"
							on:click={() => {
								activeVariant = variant;
								variantSelected = true;
							}}
						>
							<img
								src={variant.images[0].url}
								alt={variant.name}
								class="w-full h-full object-cover"
							/>
						</button>
					{/each}
				</div>
			</div>
		</div>

		<div class="w-full grid grid-cols-1 gap-10 border-[#CCCCCC] md:px-8 py-5">
			<section class="flex flex-col gap-3 w-full">
				<h1 class="font-work-sans font-bold text-dark text-4xl tracking-tight">
					{product?.name}
				</h1>

				<p class="text-dark flex flex-col gap-2 font-medium text-lg">
					{#if activeVariant?.discountPrice}
						<span class="italic line-through text-red-500 text-sm">{formatCurrency(activeVariant?.price)}</span>
					{/if}
					{formatCurrency(activeVariant?.discountPrice ?? activeVariant?.price)}
				</p>
				<div class="md:mt-5 gap-3">
					<p class="text-sm font-bold">Variant</p>
					<div class="flex flex-wrap gap-2">
						{#each product.variants as variant}
							<button
								on:click={() => {
									activeVariant = variant;
									variantSelected = true;
								}}
								class="px-4 py-3 rounded-md text-sm border-2 transition-colors duration-200 {
									activeVariant.id === variant.id
										? 'bg-black text-white border-black'
										: 'bg-white text-black border-gray-300 hover:border-black'
								}"
							>
								{variant.name}
							</button>
						{/each}
					</div>
				</div>
				<div class="md:mt-5 gap-3">
					<p class="text-sm font-bold">Quantity</p>
					<div class="flex border border-black w-fit mt-2 max-w-[120px] rounded">
						<button
							on:click={() => (quantityToBuy > 1 ? (quantityToBuy -= 1) : null)}
							class="border-r py-1 px-2 border-black hover:text-white hover:bg-black">-</button
						>
						<input
							type="text"
							bind:value={quantityToBuy}
							class="py-1 px-1 w-full text-center focus:outline-none"
							on:change={(e) => {
								let value = e.target?.value;

								if (value < 0) quantityToBuy = 0;
								if (quantityToBuy > activeVariant.stock) quantityToBuy = activeVariant.stock;
								if (isNaN(quantityToBuy)) quantityToBuy = 0;
							}}
						/>
						<!-- <p class=" py-2 px-3">{quantityToBuy}</p> -->
						<button
							on:click={() => (quantityToBuy < activeVariant.stock ? (quantityToBuy += 1) : null)}
							class="border-l py-1 px-2 border-black hover:text-white hover:bg-black">+</button
						>
					</div>
				</div>

				<div class="gap-1">
					<button
						class="mt-5 button-blue w-full bg-gray-200 text-black hover:bg-black hover:text-white"
						on:click={() => {
							if (quantityToBuy > 0) {
								addToCart(activeVariant, quantityToBuy);
								quantityToBuy = 0;
								showToastr('Added to cart', 'success');
							} else showToastr('Please select a quantity to buy', 'error');
						}}
					>
						Add to Cart
					</button>
					<button
						class="mt-5 button-blue w-full bg-black hover:bg-black/80"
						on:click={() => {
							if (quantityToBuy > 0) {
								addToCart(activeVariant, quantityToBuy);
								quantityToBuy = 0;
								goto('/cart');
							} else showToastr('Please select a quantity to buy', 'error');
						}}
					>
						Buy Now
					</button>
				</div>
				<p class="text-sm">Tax included. Shipping calculated at checkout.</p>

				<!-- <div class="flex gap-2 items-center">
					<svg
						class="vector"
						width="12"
						height="16"
						viewBox="0 0 12 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M6 0C2.68286 0 0 2.57216 0 5.75244C0 9.17925 3.78857 13.9045 5.34857 15.7042C5.69143 16.0986 6.31714 16.0986 6.66 15.7042C8.21143 13.9045 12 9.17925 12 5.75244C12 2.57216 9.31714 0 6 0ZM6 7.80688C4.81714 7.80688 3.85714 6.88649 3.85714 5.75244C3.85714 4.61839 4.81714 3.698 6 3.698C7.18286 3.698 8.14286 4.61839 8.14286 5.75244C8.14286 6.88649 7.18286 7.80688 6 7.80688Z"
							fill="#41413F"
						/>
					</svg>
					<span class="text-sm">
						{listing.city}, {listing.state}, {#if listing.zip}{listing.zip},{/if}
						{listing.country}
					</span>
				</div> -->

				<!-- <div class="flex items-center w-full gap-4">
					<p class="items-center flex gap-1 font-medium font-primary">
						<span>{listing.bedrooms} {listing.bedrooms <= 1 ? 'Room' : 'Rooms'}</span><iconify-icon
							class="text-primary"
							icon="la:bed"
						/>
					</p>
					<p class="items-center flex gap-1 font-medium font-primary">
						<span>{listing.bathrooms} {listing.bathrooms <= 1 ? 'Bath' : 'Baths'}</span
						><iconify-icon class="text-primary" icon="fa:bath" />
					</p>
				</div> -->

				<!-- <section class="flex flex-col w-full gap-1" role="contentinfo">
					<p id="listing-description" class="text-base mt-4 prose" class:clamp-3={!showMore}>
						{@html listing.shortDescription}
					</p>
					{#if showReadMore}
						<button
							on:click={() => (showMore = !showMore)}
							class="w-fit text-sm text-primary hover:text-primary/80 transition-all text-right"
							>Read {showMore ? 'less' : 'more        '}</button
						>
					{/if}
				</section> -->
				<!-- <p class="font-primary text-gray text-sm">
					Posted by: {listing.agent.first_name}
					{listing.agent.last_name}
				</p> -->
			</section>
			<!-- 
			<section class="w-full grid grid-cols-1 gap-4">
				<button on:click={checkIfUser}>
					<a
						href={$currentUser && `tel:${listing.agent.phone_number}`}
						class="button w-full button--primary">Call Agent ({listing.agent.phone_number})</a
					>
				</button>
				<button type="button" class="button w-full border-primary text-primary rounded-[5px] border"
					>Send a message</button
				>
			</section> -->
		</div>
	</section>
	<!-- <p class="prose mt-10 max-w-none">
		{@html listing.description}
	</p> -->
	<section role="contentinfo" class="max-w-[94rem] mx-auto md:px-10 px-5 mt-[60px]">
		<div class="text-center text-black flex flex-col items-center gap-10 w-full">
			<h3 class="text-2xl font-bold">RELATED PRODUCTS</h3>

			<div
				class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center w-full md:gap-5 gap-10 py-3"
			>
				{#each relatedProducts as product}
					<ProductCard {product} />
				{/each}
			</div>
		</div>
	</section>
</main>
