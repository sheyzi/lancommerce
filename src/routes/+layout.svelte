<script lang="ts">
	import '../app.postcss';
	import 'iconify-icon';
	import { currentUser } from '$lib/stores/user.stores';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page, navigating } from '$app/stores';
	import { showToastr, type ToastType } from '$lib/utils';
	import { Toaster } from 'svelte-sonner';
	import { initializeCart } from '../lib/stores/cart.stores';
	import PageLoader from '../lib/components/PageLoader.svelte';
	import Preloader from '../lib/components/Preloader.svelte';

	export let data;

	let isLoading = true;

	onMount(() => {
		currentUser.set(data.user || null);
		initializeCart();
		
		// Simulate content loading
		setTimeout(() => {
			isLoading = false;
		}, 2000); // Adjust this time as needed
	});

	$: {
		if (browser) {
			let message = $page.url.searchParams.get('message');
			let type = $page.url.searchParams.get('messageType') as ToastType;
			if (message) showToastr(message, type || 'info');
		}
	}
</script>

<Preloader bind:isLoading />

{#if !isLoading}
	<Toaster richColors position="bottom-right" />
	<slot />

	{#if !!$navigating}
		<PageLoader />
	{/if}
{/if}
