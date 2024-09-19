<script lang="ts">
	import { enhance } from '$app/forms';
	import AdminModal from '$lib/components/AdminModal.svelte';
	import type { CategoryWithProductCount } from '$lib/types/categories.types';
	import { showToastr } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;
	export let form;

	let categories = data.categories;

	let previewImage: string | null = null;

	let showModal: boolean = false;
	let toEdit: CategoryWithProductCount | null = null;

	const closeModal = () => {
		previewImage = null;
		showModal = false;
		toEdit = null;
	};

	let showDeleteModal = false;
	let toDelete: CategoryWithProductCount | null = null;

	const openDeleteModal = (category: CategoryWithProductCount) => {
		toDelete = category;
		showDeleteModal = true;
	};

	const closeDeleteModal = () => {
		showDeleteModal = false;
		toDelete = null;
	};

	const openEditModal = (category: CategoryWithProductCount) => {
		toEdit = category;
		showModal = true;
	};

	let loading = false;
	let searchLoading = false;
	let deleting = false;

	$: {
		previewImage = toEdit?.featuredImage.url || '';
	}
</script>

<svelte:head>
	<title>Categories - Evolv</title>
</svelte:head>

<div class="flex justify-between items-center">
	<h2>Categories</h2>
	<div>
		<button on:click={() => (showModal = !showModal)} class="button-blue">Create Category</button>
	</div>
</div>

<AdminModal on:close={closeModal} visible={showModal} title={'Category'}>
	<form
		enctype="multipart/form-data"
		class="min-w-[350px] grid grid-cols-1 gap-2"
		action="?/manage"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ update, result }) => {
				try {
					if (result.status === 200) {
						if (result.data?.type === 'edit') {
							categories = categories.map((category) => {
								if (category.id === result.data?.category.id) {
									return result.data?.category;
								}
								return category;
							});
							showToastr('Category updated successfully!', 'success');
						} else {
							categories = [result.data?.category, ...categories];
							showToastr('Category created successfully!', 'success');
						}
						closeModal();
					} else if (result.status === 500) {
						showToastr('Ooops! Something went wrong. Please try again later.', 'error');
					}
				} finally {
					loading = false;
					update({
						reset: false
					});
				}
			};
		}}
	>
		{#if toEdit}
			<input type="text" name="category-id" class="hidden" value={toEdit.id} />
		{/if}
		<div class="w-full relative flex flex-col">
			<label class=" font-karla" for="name">Featured Image:</label>
			<div
				class="relative h-full max-h-[15rem] min-h-[8rem] w-full border-dashed border-2 border-black/40 flex items-center justify-center {previewImage
					? 'bg-epurple/10'
					: 'bg-white'}"
			>
				{#if previewImage}
					<img src={previewImage} class="w-full h-full object-cover" alt="" />
				{:else}
					<p class="absolute">Upload image</p>
				{/if}
				<input
					on:change={(e) => {
						previewImage = URL.createObjectURL(e?.target?.files[0]);
					}}
					name="category-featuredimage"
					id="category-featuredimage"
					class="w-full h-full opacity-0 z-10 cursor-pointer absolute"
					type="file"
					accept="*/image"
				/>
			</div>
			{#if form?.errors?.featuredImage}
				{#each form.errors.featuredImage as error}
					<p class="text-red-500 text-xs">{error}</p>
				{/each}
			{/if}
		</div>
		<div class=" flex flex-col gap-1">
			<label class=" font-karla" for="category-name">Name:</label>
			<input
				id="category-name"
				name="category-name"
				class="form-input"
				type="text"
				value={toEdit?.name || ''}
			/>

			{#if form?.errors?.name}
				{#each form.errors.name as error}
					<p class="text-red-500 text-xs">{error}</p>
				{/each}
			{/if}
		</div>
		<div class=" flex flex-col gap-1">
			<label class=" font-karla" for="category-description">Description:</label>
			<!-- <input
				name="category-description"
				id="category-description"
				class="w-full py-1 px-1 focus:outline-none border"
				type="text"
			/> -->
			<textarea
				class="form-input"
				name="category-description"
				id="category-description"
				cols="30"
				rows="5"
				value={toEdit?.description || ''}
			/>

			{#if form?.errors?.description}
				{#each form.errors.description as error}
					<p class="text-red-500 text-xs">{error}</p>
				{/each}
			{/if}
		</div>
		<div class="w-full mt-3">
			<button class="button-blue w-full">
				{@html loading
					? '<iconify-icon class="text-center" width="20" icon="eos-icons:three-dots-loading"></iconify-icon>'
					: 'Submit'}
			</button>
		</div>
	</form>
</AdminModal>

<AdminModal on:close={closeDeleteModal} visible={showDeleteModal} title="Delete {toDelete?.name}">
	<div class="flex flex-col gap-5 mt-5">
		<p class="text-sm">Are you sure you want to delete this category?</p>
		<form
			method="post"
			action="?/delete"
			class="flex gap-2"
			use:enhance={() => {
				deleting = true;
				return async ({ result, update }) => {
					try {
						if (result.status === 200) {
							categories = categories.filter((category) => category.id !== toDelete?.id);
							showToastr('Category deleted successfully!', 'success');
							closeDeleteModal();
						} else if (result.status === 500) {
							showToastr('Ooops! Something went wrong. Please try again later.', 'error');
						}
					} finally {
						deleting = false;
						update({ reset: false });
					}
				};
			}}
		>
			<input type="text" name="category-id" value={toDelete?.id} class="hidden" />
			<button class="button-blue w-full" on:click={closeDeleteModal} type="button">Cancel</button>
			<button class="button-blue bg-red-500 hover:bg-red-700 w-full">
				{@html deleting
					? '<iconify-icon class="text-center" width="20" icon="eos-icons:three-dots-loading"></iconify-icon>'
					: 'Delete'}
			</button>
		</form>
	</div>
</AdminModal>

<div class="shadow mt-[30px] rounded">
	<form
		class="p-5"
		action="?/search"
		method="post"
		use:enhance={() => {
			searchLoading = true;
			return async ({ result, update }) => {
				try {
					if (result.status === 200) {
						categories = result.data?.categories;
					}
				} finally {
					searchLoading = false;
					update({ reset: false });
				}
			};
		}}
	>
		<div class="w-full flex items-center gap-2 rounded border px-2">
			<input
				name="search"
				type="text"
				class="w-full py-2 focus:outline-none rounded"
				placeholder="Search Categories..."
			/>
			<button class="button-blue rounded h-full text-white">
				{#if searchLoading}
					<iconify-icon class="text-center" width="20" icon="eos-icons:three-dots-loading" />
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314Z"
						/></svg
					>
				{/if}
			</button>
		</div>
	</form>

	<div class="flex flex-col">
		<div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
				<div class="overflow-hidden">
					<table class="min-w-full">
						<thead class="bg-white border-b">
							<tr>
								<th />
								<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
									Name
								</th>
								<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
									Slug
								</th>
								<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
									No. Of Products
								</th>
								<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{#each categories as category}
								<tr class="bg-white border-b">
									<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-28">
										<img
											src={category.featuredImage.url}
											alt=""
											class="object-cover w-full"
											style="aspect-ratio: 16/8;"
										/>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
										>{category.name}</td
									>
									<td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
										{category.slug}
									</td>
									<td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
										{category._count.products}
									</td>
									<td
										class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap flex gap-2 items-center"
									>
										<button class="text-yellow-600" on:click={() => openEditModal(category)}>
											<iconify-icon icon="fa:edit" width="20" />
											<!-- <iconify-icon icon="iconamoon:edit-light" width="20" /> -->
										</button>
										<button class="text-red-600" on:click={() => openDeleteModal(category)}>
											<iconify-icon icon="iconamoon:trash-light" width="20" />
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
