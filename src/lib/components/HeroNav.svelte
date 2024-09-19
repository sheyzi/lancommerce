<script lang="ts">
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { currentUser } from '../stores/user.stores';
	import Avatar from './Avatar.svelte';
	import type { Category } from '@prisma/client';
	import { showToastr } from '../utils';
	import { page } from '$app/stores';
	import { calculateCartLength, cartStore } from '../stores/cart.stores';

	let open = false;
	const toggle = () => {
		open = !open;
	};

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

<div class="sticky md:static -top-0.5 {!open && 'z-20'} bg-white transition-all">
	<div
		class="max-w-7xl mx-auto md:text-xs lg:text-base lg:px-10 px-5 py-5 flex items-center justify-between"
	>
		<!-- Logo -->
		<div>
			<a href="/">
				<img src="/logo.svg" alt="logo" class="h-5 w-auto" />
				<!-- <p class="text-3xl font-bold">Evolv.</p> -->
			</a>
		</div>
		<!-- Primary Nav -->
		<nav class="md:flex items-center justify-center hidden space-x-5">
			{#await categories}
				{#each [1, 2, 3] as _}
					<div class="h-3 w-16 animate-pulse bg-base-300 rounded-full" />
				{/each}
			{:then categories}
				{#each categories as category}
					<a
						href="/category/{category.slug}"
						class="nav-item"
						class:active={$page.url.pathname.startsWith(`/category/${category.slug}`)}
						>{category.name}</a
					>
				{/each}
			{/await}
		</nav>

		<!-- Secondary Nav -->
		<nav class="md:flex items-center hidden space-x-5">
			<div class="flex w-28 lg:w-36 bg-black/5 items-center rounded-full px-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2.5"
					stroke="currentColor"
					height="25"
					width="25"
					class="nav-item"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
					/>
				</svg>
				<input
					type="text"
					placeholder="Search"
					class="w-full rounded bg-transparent p-2 focus:outline-none text-black"
				/>
			</div>

			<a href="/favourites">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class=" md:w-5 md:h-5 lg:w-6 lg:h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
					/>
				</svg>
			</a>
			<a href="/cart" class="relative">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class=" md:w-5 md:h-5 lg:w-6 lg:h-6 nav-item"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
					/>
				</svg>
				<p class="absolute bg-epurple text-white text-sm -top-2 -right-3 rounded-full px-1.5">
					{cartQuantity}
				</p>
			</a>

			{#if $currentUser}
				<Avatar />
			{:else}
				<a href="/auth/login">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class=" md:w-5 md:h-5 lg:w-6 lg:h-6 nav-item"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
						/>
					</svg>
				</a>
			{/if}
		</nav>

		<!-- Mobile Nav Toggle -->
		<nav class="md:hidden flex space-x-5 items-center">
			<a href="/favourites">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
					/>
				</svg>
			</a>
			<a href="/cart" class="relative">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6 nav-item"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
					/>
				</svg>
				<p class="absolute bg-epurple text-white text-sm -top-2 -right-3 rounded-full px-1.5">
					{cartQuantity}
				</p>
			</a>
			<button on:click={toggle}>
				<!-- For more settings use the AutoHTML plugin tab ... -->
				<svg
					class="nav-item"
					width="24"
					height="14"
					viewBox="0 0 24 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M0.571289 0H23.4284V2.28571H0.571289V0ZM6.28557 5.71429H23.4284V8H6.28557V5.71429ZM13.4284 11.4286H23.4284V13.7143H13.4284V11.4286Z"
						fill="#737373"
					/>
				</svg>
			</button>
		</nav>
	</div>
</div>

{#if open}
	<div
		in:fly={{
			x: -100,
			duration: 450,
			easing: cubicOut
		}}
		out:fly={{
			x: -100,
			duration: 450,
			easing: cubicIn
		}}
		class="md:hidden fixed h-screen w-screen top-0 z-20 bg-black text-white p-5 font-universo"
	>
		<div class="flex justify-between items-center">
			<a href="/">
				<img src="/logo-white.svg" alt="logo" class="h-5 w-auto" />
			</a>

			<button on:click={toggle}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<div class="flex items-center space-x-2 mt-14">
			<div class="bg-white rounded flex items-center text-black px-2 w-full space-x-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="w-5 h-5"
				>
					<path
						fill-rule="evenodd"
						d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
						clip-rule="evenodd"
					/>
				</svg>

				<input
					type="text"
					class="w-full rounded bg-white p-2 focus:outline-none text-black"
					placeholder="Search"
				/>
			</div>
		</div>

		<div class="flex flex-col justify-center items-start gap-10 text-4xl font-bold mt-28">
			<a href="/" class="nav-item border-b w-full pb-2">Home</a>
			<a href="/account" class="nav-item border-b w-full pb-2">Account</a>
			{#await categories}
				{#each [1, 2, 3] as _}
					<div class="h-5 w-full animate-pulse bg-base-300 rounded-full" />
				{/each}
			{:then categories}
				{#each categories as category}
					<a
						href="/category/{category.slug}"
						class="nav-item border-b w-full pb-2"
						class:active={$page.url.pathname.startsWith(`/category/${category.slug}`)}
						>{category.name}</a
					>
				{/each}
			{/await}
			<!-- <a href="/" class="nav-item border-b w-full pb-2"
				>T<span class="font-work-sans">-</span>Shirts</a
			>
			<a href="/" class="nav-item border-b w-full pb-2">Hoodies</a>
			<a href="/" class="nav-item border-b w-full pb-2">Sweatshirts</a> -->
			{#if $currentUser}
				<form class="nav-item border-b w-full pb-2" action="/?/logout" method="post">
					<button>Logout</button>
				</form>
			{:else}
				<a href="/auth/login" class="nav-item border-b w-full pb-2">Login</a>
			{/if}
		</div>
	</div>
{/if}

<style>
	.nav-item {
		text-align: left;
	}

	.nav-item.active {
		color: #762ebb;
		background-color: transparent;
	}

	.nav-item:hover {
		color: #762ebb;
	}
</style>
