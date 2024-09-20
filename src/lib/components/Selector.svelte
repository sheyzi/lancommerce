<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Option } from '../types/select.types';
	import { getStatusClass } from '$lib/utils';
	import type { OrderStatus } from '$lib/types/order.type';

	export let options: Option[] = [];
	export let value: string | OrderStatus | null;
	export let placeholder: string = 'Select an option';
	export let name: string = 'select';

	let isOpen: boolean = false;
	let search: string = '';
	let visibleOptions: Option[] = options;

	$: {
		if (search.length > 0) {
			visibleOptions = options.filter((option) =>
				option.label.toLowerCase().includes(search.toLowerCase())
			);
		} else {
			visibleOptions = options;
		}
	}

	function toggleOpen() {
		isOpen = !isOpen;
	}

	function selectOption(option: Option) {
		value = option.value;
		isOpen = false;
		dispatch('change', value);
	}

	const dispatch = createEventDispatcher();

	onMount(() => {
		// Ensure initial value is valid
		if (value && !options.some(option => option.value === value)) {
			value = null;
		}
	});
</script>

<div class="relative">
	<input type="hidden" {name} {value} />
	<button
		on:click={toggleOpen}
		type="button"
		class="form-input flex cursor-pointer hover:bg-gray-100 justify-between {value && getStatusClass(value)}"
	>
		<p>
			{value ? options.find(o => o.value === value)?.label : placeholder}
		</p>
		<iconify-icon icon="mingcute:down-fill" width="20" />
	</button>

	{#if isOpen}
		<div class="absolute w-full z-10 top-10">
			<input type="text" placeholder="Search..." class="form-input" bind:value={search} />
			<div class="bg-white border border-gray-200 rounded-md shadow-lg">
				<ul>
					{#each visibleOptions as option}
						<li>
							<button
								on:click={() => selectOption(option)}
								type="button"
								class="form-input flex cursor-pointer hover:bg-gray-100 justify-between w-full"
							>
								<p>{option.label}</p>
								{#if value === option.value}
									<iconify-icon icon="mdi:check" width="20" />
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}
</div>