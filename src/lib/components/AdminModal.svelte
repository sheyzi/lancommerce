<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let visible = false;
	export let title = 'Title';

	const dispatch = createEventDispatcher();
</script>

{#if visible}
	<div class="fixed top-0 bottom-0 left-0 right-0 w-screen h-screen z-50">
		<button on:click={() => dispatch('close')} class="absolute h-full w-full bg-black/30" />
		<div
			class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg py-2 px-4 max-h-[90vh] overflow-y-auto w-[90vw] md:w-[50vw]"
		>
			<div class="flex justify-between items-center mb-5">
				<h3 class="font-work-sans font-medium text-xl">{title}</h3>
				<button
					on:click={() => dispatch('close')}
					class="rounded-full text-4xl px-2 py-0.5 text-center"
					><iconify-icon icon="line-md:close-small" /></button
				>
			</div>
			<slot />
		</div>
	</div>
{/if}
