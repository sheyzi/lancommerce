<script lang="ts">
	import '../app.postcss';
	import 'iconify-icon';
	import { currentUser } from '$lib/stores/user.stores';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page, navigating } from '$app/stores';
	import { showToastr, type ToastType } from '$lib/utils';
	import { Toaster } from 'svelte-french-toast';
	import { initializeCart } from '../lib/stores/cart.stores';
	import PageLoader from '../lib/components/PageLoader.svelte';

	export let data;

	onMount(() => {
		currentUser.set(data.user || null);
		initializeCart();
	});

	$: {
		if (browser) {
			let message = $page.url.searchParams.get('message');
			let type = $page.url.searchParams.get('messageType') as ToastType;
			// Valid types are: success, error, warning, info
			if (message) showToastr(message, type || 'info');
		}
	}
</script>

<Toaster />
<slot />

{#if !!$navigating}
	<PageLoader />
{/if}
