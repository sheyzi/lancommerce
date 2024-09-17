<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { currentUser } from '$lib/stores/user.stores';

	let openOptions = false;

	const toggleOptions = () => {
		openOptions = !openOptions;
	};

	const logoutCallback = () => {
		return async ({ result, update }) => {
			try {
				if (browser) localStorage.removeItem('cart');
			} finally {
				await update();
			}
		};
	};
</script>

<div class="relative py-1 px-2 rounded-full bg-egreen/60">
	<button on:click={toggleOptions} class=" flex items-center justify-center w-full h-full"
		><span class="text-center text-sm"
			>{$currentUser?.email[0].toUpperCase() || 'S'}{$currentUser?.email[1].toUpperCase() ||
				'E'}</span
		></button
	>
	{#if openOptions}
		<nav class="absolute right-1 xl:right-0 top-10 min-w-fit">
			<ol class="py-2 bg-white shadow rounded flex flex-col w-full">
				<li class="px-5 py-1 hover:bg-slate-300 cursor-pointer">
					<a on:click={toggleOptions} href="/account">Account</a>
				</li>
				{#if $currentUser?.role === 'ADMIN'}
					<li class="px-5 py-1 hover:bg-slate-300 cursor-pointer min-w-max">
						<a on:click={toggleOptions} href="/admin">Admin Panel</a>
					</li>
				{/if}
				<form
					class="px-5 py-1 hover:bg-slate-300"
					action="/?/logout"
					method="post"
					use:enhance={logoutCallback}
				>
					<button on:click={toggleOptions} class=" cursor-pointer">Logout</button>
				</form>
			</ol>
		</nav>
	{/if}
</div>
