<script lang="ts">
	import ProductCard from "$lib/components/ProductCard.svelte";
    import type { ProductWithRelations } from '$lib/types/products.types';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    export let data: { products: ProductWithRelations[], page: number, totalPages: number };

    let products: ProductWithRelations[] = [];
    let loading = false;
    let error: Error | null = null;
    let currentPage = data.page;

    onMount(() => {
        products = data.products.flatMap(product => Array(30).fill(product));
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });

    async function loadMoreProducts() {
        if (loading || currentPage >= data.totalPages) return;
        loading = true;
        try {
            const nextPage = currentPage + 1;
            const res = await fetch(`/products?page=${nextPage}`);
            if (!res.ok) throw new Error('Failed to fetch more products');
            const newData = await res.json();
            products = [...products, ...newData.products.flatMap((product: ProductWithRelations) => Array(30).fill(product))];
            currentPage = nextPage;
            goto(`?page=${nextPage}`, { replaceState: true, keepFocus: true, noScroll: true });
        } catch (e) {
            error = e instanceof Error ? e : new Error('An unknown error occurred');
        } finally {
            loading = false;
        }
    }

    function handleScroll() {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            loadMoreProducts();
        }
    }
</script>

<div class="py-20 max-w-[94rem] mx-auto px-5">
    <h1 class="text-4xl font-bold text-center mb-10">Products</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {#each products as product}
            <div class="col-span-1 mx-auto">
                <ProductCard {product} />
            </div>
        {/each}
    </div>
    {#if loading}
        <p class="text-center mt-4">Loading more products...</p>
    {/if}
    {#if error}
        <p class="text-center mt-4 text-red-500">Error: {error.message}</p>
    {/if}
</div>
