<script lang="ts">
	import type { OrderStatus } from '$lib/types/order.type';
	import { onMount } from 'svelte';

	export let tabItems: { label: string; value: string | OrderStatus }[] = [];
	export let activeTab: string = '';

	onMount(() => {
		if (tabItems.length > 0) {
			activeTab = tabItems[0].value;
		}
	});
</script>

<ul class="w-full flex gap-5">
	{#if tabItems.length > 0}
		{#each tabItems as tab}
			<li
				class="hover:border-b-2 text-sm transition-all hover:font-semibold hover:text-elightpurple hover:border-elightpurple {activeTab ===
					tab.value && 'border-b-2 transition-all text-epurple border-epurple font-semibold '}"
			>
				<button class="flex items-start gap-1">
					<span>{tab.label}</span>
					<span class="indicator-item text-xs">25</span>
				</button>
			</li>
		{/each}
	{/if}
</ul>
