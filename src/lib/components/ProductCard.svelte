<script lang="ts">
    import type { ProductWithRelations } from '../types/products.types';
    import { formatCurrency } from '../utils';
    import FavouriteButton from './FavouriteButton.svelte';

    export let product: ProductWithRelations;
</script>

<a class="flex flex-col w-full max-w-xs group"
href={`/category/${product.category?.slug}/product/${product.slug}`}
>
    <div class="w-full aspect-square bg-gray-100 mb-2 relative overflow-hidden">
        {#if product.variants[0].discountPrice}
            <div
                class="absolute right-2 top-2 z-10 bg-epurple text-white font-semibold shadow-sm px-2 py-1 text-xs rounded-full"
            >
                {Math.round(100 - (product.variants[0].discountPrice / product.variants[0].price) * 100)}%
                Off
            </div>
        {/if}
        <img
            class="w-full h-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-110"
            src={product.featuredImage.url}
            alt={product.name}
        />
    </div>
    <div class="flex flex-col items-start">
        <h3 class="text-lg font-bold text-gray-800 mb-1 font-work-sans">{product.name}</h3>
        <a class="text-sm text-gray-500 mb-2 hover:underline"
		href={`/category/${product.category?.slug}`}
		>{product.category?.name}</a>
        <div class="flex justify-between w-full items-center">
            <div>
                {#if product.variants[0].discountPrice}
                    <p class="text-sm line-through text-gray-400 text-left">
                        {formatCurrency(product.variants[0].price)}
                    </p>
                {/if}
                <p class="text-lg font-bold text-gray-900">
                    {formatCurrency(product.variants[0].discountPrice ?? product.variants[0].price)}
                </p>
            </div>
            <FavouriteButton {product} />
        </div>
    </div>
</a>