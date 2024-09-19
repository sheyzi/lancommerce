<script lang="ts">
	import ProductCard from '../../../../lib/components/ProductCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let category = data.category;

	$: category = data.category;
</script>

<svelte:head>
	<title>{category.name} - Evolv</title>
</svelte:head>

<!-- Hero Section -->
<section class="relative">
	<div class="hero relative" style="background-image: url('{category.featuredImage.url}');">
		<div class="hero-overlay" />
		<div class="hero-content w-full">
			<div class="flex flex-col items-center md:items-start">
				<div class="gap-[30px]">
					<h1 class="hero-title">{category.name}</h1>
					<p class="hero-description">
						{category.description}
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section role="contentinfo" class="max-w-7xl mx-auto md:px-10 px-5 mt-[60px]">
	<div class="text-center text-black flex flex-col items-center gap-10 w-full">
		<h3 class="text-2xl font-bold">PRODUCTS</h3>

		<div
			class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center w-full md:gap-5 gap-10 py-3"
		>
			{#each category.products as product}
				<ProductCard {product} />
			{/each}
		</div>
	</div>
</section>

<style>
	.hero {
		background-size: cover;
		background-position: center right;
		background-repeat: no-repeat;
		aspect-ratio: 360/179;
		max-height: 400px;
	}

	.hero-overlay {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.2);
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: white;
		/* text-align: center; */
		font-family: 'Karla', sans-serif;
	}

	.hero-title {
		color: #ffffff;
		text-align: center;
		font: 600 60px 'Universo', sans-serif;
		position: relative;
		max-width: 700px;
		line-height: 1;
	}

	.hero-description {
		color: #ffffff;
		text-align: center;
		font: 400 16px 'Karla', sans-serif;
		position: relative;
		max-width: 411px;
		margin: 30px 0 0 0;
	}

	@media (max-width: 668px) {
		.hero {
			aspect-ratio: 414/638;
		}

		.hero-content {
			padding: 0 20px;
			align-items: center;
		}

		.hero-title {
			font-size: 48px;
			text-align: center;
		}

		.hero-description {
			font-size: 16px;
		}
	}
</style>
