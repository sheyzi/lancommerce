<script lang="ts">
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { currentUser } from '../stores/user.stores';
	import Avatar from './Avatar.svelte';
	import type { Category } from '@prisma/client';
	import { showToastr } from '../utils';
	import { page } from '$app/stores';
	import { calculateCartLength, cartStore } from '../stores/cart.stores';

	let scrollY = 0;
	let open = false;
	const toggle = () => (open = !open);

	const getCategories = async (): Promise<Category[]> => {
		try {
			const res = await fetch('/api/fetch-categories');
			return res.json();
		} catch {
			showToastr('Failed to fetch categories', 'error');
			return [];
		}
	};

	let categories = getCategories();

	let cartQuantity = 0;

	$: cartQuantity = calculateCartLength($cartStore);
</script>

<svelte:window on:scroll={() => (scrollY = window.scrollY)} />

<header 
    class="fixed w-full top-0 z-50 transition-all duration-300 {
        scrollY > 100 || $page.url.pathname !== '/' 
            ? 'bg-white/95 backdrop-blur-sm ' 
            : 'bg-transparent'
    }"
>
    <div class="max-w-[94rem] mx-auto px-6 h-16 flex items-center justify-between">
        <!-- Logo -->
        <a 
            href="/" 
            class="text-lg font-medium transition-colors {
                scrollY > 100 || $page.url.pathname !== '/' ? 'text-black' : 'text-white'
            }"
        >
            Abike & You
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
            {#await categories}
                <div class="flex gap-6">
                    {#each Array(3) as _}
                        <div class="h-2 w-16 animate-pulse bg-neutral-200 rounded-full" />
                    {/each}
                </div>
            {:then categories}
                {#each categories as category}
                    <a
                        href="/category/{category.slug}"
                        class="text-sm hover:text-neutral-500 transition-colors {
                            scrollY > 100 || $page.url.pathname !== '/' ? 'text-black' : 'text-white'
                        }"
                        class:active={$page.url.pathname.startsWith(`/category/${category.slug}`)}
                    >
                        {category.name}
                    </a>
                {/each}
            {/await}
        </nav>

        <!-- Desktop Actions -->
        <div class="hidden md:flex items-center gap-6">
            <!-- Search -->
            <button class="hover:text-neutral-500 transition-colors {
                scrollY > 100 || $page.url.pathname !== '/' ? 'text-black' : 'text-white'
            }">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
            </button>

            <!-- Favorites -->
            <a href="/favourites" class="hover:text-neutral-500 transition-colors {
                scrollY > 100 || $page.url.pathname !== '/' ? 'text-black' : 'text-white'
            }">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
            </a>

            <!-- Cart -->
            <a href="/cart" class="relative hover:text-neutral-500 transition-colors {
                scrollY > 100 || $page.url.pathname !== '/' ? 'text-black' : 'text-white'
            }">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                </svg>
                {#if cartQuantity > 0}
                    <span class="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                        {cartQuantity}
                    </span>
                {/if}
            </a>

            <!-- Account -->
            {#if $currentUser}
                <Avatar />
            {:else}
                <a href="/auth/login" class="hover:text-neutral-500 transition-colors {
                    scrollY > 100 || $page.url.pathname !== '/' ? 'text-black' : 'text-white'
                }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                </a>
            {/if}
        </div>

        <!-- Mobile Menu Button -->
        <button class="md:hidden {
            scrollY > 100 || $page.url.pathname !== '/' ? 'text-black' : 'text-white'
        }" on:click={toggle}>
            {#if !open}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/>
                    <line x1="4" x2="20" y1="18" y2="18"/>
                </svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
            {/if}
        </button>
    </div>

    <!-- Mobile Menu -->
    {#if open}
        <div
            in:fly={{ y: -20, duration: 200 }}
            out:fly={{ y: -20, duration: 200 }}
            class="absolute top-16 left-0 w-full bg-white border-b border-neutral-100"
        >
            <nav class="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
                {#await categories}
                    {#each Array(3) as _}
                        <div class="h-3 w-24 animate-pulse bg-neutral-200 rounded-full" />
                    {/each}
                {:then categories}
                    {#each categories as category}
                        <a
                            href="/category/{category.slug}"
                            class="text-lg hover:text-neutral-500 transition-colors"
                            class:active={$page.url.pathname.startsWith(`/category/${category.slug}`)}
                        >
                            {category.name}
                        </a>
                    {/each}
                {/await}

                <div class="h-px bg-neutral-200 my-2" />
                
                {#if $currentUser}
                    <form action="/?/logout" method="post">
                        <button class="text-lg hover:text-neutral-500 transition-colors">Logout</button>
                    </form>
                {:else}
                    <a href="/auth/login" class="text-lg hover:text-neutral-500 transition-colors">Login</a>
                {/if}
            </nav>
        </div>
    {/if}
</header>

<style>
    .active {
        color: #762ebb;
		background-color: #fff;
    }
</style>
