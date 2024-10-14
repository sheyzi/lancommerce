<script lang="ts">
	import ProductCard from "$lib/components/ProductCard.svelte";
    import type { ProductWithRelations } from '$lib/types/products.types';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import type { Category } from '@prisma/client';

    export let data: { 
        products: ProductWithRelations[], 
        page: number, 
        totalPages: number,
        categories: Category[],
        currentCategory: string | undefined
    };

    let products: ProductWithRelations[] = [];
    let loading = false;
    let error: Error | null = null;
    let currentPage = data.page;
    let selectedCategory = data.currentCategory || '';

    onMount(() => {
        products = data.products;
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });

    async function loadMoreProducts() {
        if (loading || currentPage >= data.totalPages) return;
        loading = true;
        try {
            const nextPage = currentPage + 1;
            const categoryParam = selectedCategory ? `&category=${selectedCategory}` : '';
            const res = await fetch(`/products?page=${nextPage}${categoryParam}`);
            if (!res.ok) throw new Error('Failed to fetch more products');
            const newData = await res.json();
            products = [...products, ...newData.products];
            currentPage = nextPage;
            goto(`?page=${nextPage}${categoryParam}`, { replaceState: true, keepFocus: true, noScroll: true });
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

    function handleCategoryChange() {
        goto(`?page=1&category=${selectedCategory}`, { replaceState: true });
    }
</script>

<div class="py-20 max-w-[94rem] mx-auto px-5">
    <h1 class="text-4xl font-bold text-center mb-10">Products</h1>

    <div class="flex min-w-full justify-end mb-10 items-center">
        <label for="category" class="mr-2"><iconify-icon icon="heroicons:funnel-16-solid" width="1.4em" height="1.4em"></iconify-icon></label>
        <select 
            id="category" 
            bind:value={selectedCategory} 
            on:change={handleCategoryChange}
            class="border rounded p-2"
        >
            <option value="">All Categories</option>
            {#each data.categories as category}
                <option value={category.slug}>{category.name}</option>
            {/each}
        </select>
    </div>

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
