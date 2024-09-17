<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Option } from '../types/select.types';
	import { getStatusClass } from '$lib/utils';
	import type { OrderStatus } from '$lib/types/order.type';
	import { enhance } from '$app/forms';

	export let options: Option[] = [];
	export let value: string | OrderStatus | null;
	export let placeholder: string = 'Select an option';
	export let name: string = 'select';
	export let submitable: boolean = false;

	let label: string | undefined;

	let isOpen: boolean = false;

	function toggleOpen() {
		isOpen = !isOpen;
	}

	$: label = options.find((option) => option.value === value)?.label;
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

	const onSelected = (option?: Option) => {
		value = option?.value ?? null;
		visibleOptions = options;
		toggleOpen();
	};

	const dispatch = createEventDispatcher();

	onMount(() => {
		label = options.find((option) => option.value === value)?.label;
	});
</script>

<div class="relative">
	<input type="text" {name} {value} hidden />
	<button
		on:click={toggleOpen}
		type="button"
		class="form-input flex cursor-pointer hover:bg-gray-100 justify-between {value &&
			getStatusClass(value)}"
	>
		<p>{label ?? placeholder}</p>
		<iconify-icon icon="mingcute:down-fill" width="20" />
	</button>

	{#if isOpen}
		<div class="absolute w-full z-10 top-10">
			<input type="text" placeholder="Search..." class="form-input" bind:value={search} />
			<div class="bg-white border border-gray-200 rounded-md shadow-lg">
				<button
					on:click={() => onSelected()}
					type="button"
					class="form-input flex cursor-pointer hover:bg-gray-100 justify-between"
				>
					<p>{placeholder}</p>
				</button>
				<ul>
					{#each visibleOptions as option}
						<li>
							<form
								on:submit|preventDefault={() => console.log('submitted')}
								id="statusForm"
								use:enhance={({}) => {
									console.log('starts');

									return async ({ action, update }) => {
										update();
									};
								}}
								action="/?/update-status"
								method="POST"
							>
								<button
									class="form-input {getStatusClass(
										option.value
									)} flex cursor-pointer hover:bg-gray-100 justify-between"
								>
									<p>{option.label}</p>
								</button>
							</form>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}
</div>
