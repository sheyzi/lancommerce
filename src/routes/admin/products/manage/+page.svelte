<script lang="ts">
	import type { PageData } from './$types';
	import type { Category } from '@prisma/client';
	import type { Option } from '$lib/types/select.types';
	import Selector from '$lib/components/Selector.svelte';
	import { enhance } from '$app/forms';
	import { showToastr } from '$lib/utils';
	import AdminModal from '$lib/components/AdminModal.svelte';
	import type { VariantWithRelations } from '$lib/types/products.types';

	export let data: PageData;
	export let form;

	let loading = false;

	let previewImage: string;

	let product = data.product;
	let categories: Category[] = data.categories as Category[];
	let categoryOptions: Option[] = [];

	$: {
		if (categories) {
			categoryOptions = categories.map((category) => ({
				value: category.id,
				label: category.name
			}));
		}
	}

	$: {
		if (product) {
			previewImage = product.featuredImage.url;
		}
	}

	const getVariantDefaultImage = (variant: VariantWithRelations) => {
		const image = variant.images[0];
		return image;
	};

	let variants: VariantWithRelations[];
	let variantPreviewImage: string | null = null;

	$: variants = (product?.variants as VariantWithRelations[]) ?? [];

	let showManageVariantModal = false;
	let variantToManage: VariantWithRelations | null = null;
	let images: FileList | null = null;
	let imageUrls: string[] | null = null;

	$: {
		if (variantToManage) {
			variantPreviewImage = getVariantDefaultImage(variantToManage).url;
		}
	}

	const manageVariant = (variant?: VariantWithRelations) => {
		showManageVariantModal = true;
		variantToManage = variant ?? null;
	};

	$: {
		if (variantToManage) {
			const images = variantToManage?.images;
			let urls = [];
			for (let i = 0; i < images.length; i++) {
				urls?.push(images[i].url);
			}
			imageUrls = urls;
		}
	}

	const closeManageVariantModal = () => {
		showManageVariantModal = false;
		variantToManage = null;
		imageUrls = null;
		images = null;
		variantPreviewImage = null;
	};

	let toDelete: VariantWithRelations | null = null;
	let showDeleteModal = false;
	let deleting = false;

	const openDeleteModal = (variant: VariantWithRelations) => {
		toDelete = variant;
		showDeleteModal = true;
	};

	const closeDeleteModal = () => {
		toDelete = null;
		showDeleteModal = false;
	};
</script>

<svelte:head>
	{#if product}
		<title>Edit {product.name} - Evolv</title>
	{:else}
		<title>{product ? `Edit ${product.name}` : 'Add Product'} - Evolv</title>
	{/if}
</svelte:head>

<div class="flex justify-between items-center">
	<h2>{product ? `Edit ${product.name}` : 'Add Product'}</h2>
</div>

<AdminModal on:close={closeDeleteModal} visible={showDeleteModal} title="Delete {toDelete?.name}">
	<div class="flex flex-col gap-5 mt-5">
		<p class="text-sm">Are you sure you want to delete this variant?</p>
		<form
			method="post"
			action="?/delete"
			class="flex gap-2"
			use:enhance={() => {
				deleting = true;
				return async ({ result, update }) => {
					try {
						if (result.status === 200) {
							variants = variants.filter((variant) => variant.id !== toDelete?.id);
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
			<input type="text" name="variantId" value={toDelete?.id} class="hidden" />
			<button class="button-blue w-full" on:click={closeDeleteModal} type="button">Cancel</button>
			<button class="button-blue bg-red-500 hover:bg-red-700 w-full">
				{@html deleting
					? '<iconify-icon class="text-center" width="20" icon="eos-icons:three-dots-loading"></iconify-icon>'
					: 'Delete'}
			</button>
		</form>
	</div>
</AdminModal>

<AdminModal
	on:close={closeManageVariantModal}
	bind:visible={showManageVariantModal}
	title={variantToManage ? 'Edit Variant' : 'Add Variant'}
>
	<form
		action="?/manageVariant"
		method="post"
		enctype="multipart/form-data"
		class="w-full mt-10 grid md:grid-cols-2 grid-cols-1 gap-5"
		use:enhance={() => {
			loading = true;
			return async ({ result, update }) => {
				try {
					if (result.status === 200) {
						showToastr(variantToManage ? 'Update saved!' : 'Variant added successfully', 'success');
						product = result.data?.product;
						closeManageVariantModal();
					} else if (result.status === 500) {
						showToastr('Oops!, Something went wrong', 'error');
					}
				} finally {
					loading = false;
					update();
				}
			};
		}}
	>
		{#if product}
			<input type="hidden" name="productId" value={product.id} />
		{/if}
		{#if variantToManage}
			<input type="hidden" name="variantId" value={variantToManage.id} />
		{/if}

		<div class="w-full relative flex flex-col md:col-span-2 col-span-1">
			<label class=" font-karla" for="variantImages">Images:</label>
			<div
				class="relative h-full max-h-[15rem] min-h-[8rem] w-full border-dashed border-2 border-black/40 flex items-center justify-center {variantPreviewImage
					? 'bg-epurple/10'
					: 'bg-white'}"
			>
				{#if variantPreviewImage}
					<img src={variantPreviewImage} class="w-full h-full object-cover" alt="" />
				{:else}
					<p class="absolute">Upload image</p>
				{/if}
				<input
					on:change={(e) => {
						variantPreviewImage = URL.createObjectURL(e?.target?.files[0]);
						images = e.target?.files;
						imageUrls = [];
						for (let i = 0; i < images.length; i++) {
							imageUrls.push(URL.createObjectURL(images[i]));
						}
					}}
					name="variantImages"
					id="variantImages"
					class="w-full h-full opacity-0 z-10 cursor-pointer absolute"
					type="file"
					bind:value={images}
					accept="*/image"
					multiple
				/>
			</div>
			{#if imageUrls}
				<div
					class="flex items-center bg-epurple/10 border-dashed rounded-b gap-2 border-2 border-black/40"
				>
					{#each imageUrls as image}
						<button
							type="button"
							on:click={() => {
								variantPreviewImage = image;
							}}
						>
							<img class="h-8" src={image} alt="Preview" />
						</button>
					{/each}
				</div>
			{/if}

			{#if form?.errors?.variantImages}
				{#each form.errors.variantImages as error}
					<p class="form-error">{error}</p>
				{/each}
			{/if}
		</div>

		<div class="form-control">
			<label class="form-label" for="variantName">Name:</label>
			<input
				id="variantName"
				name="variantName"
				class="form-input"
				type="text"
				value={variantToManage?.name || null}
			/>

			{#if form?.errors?.variantName}
				{#each form.errors.variantName as error}
					<p class="form-error">{error}</p>
				{/each}
			{/if}
		</div>

		<div class="form-control">
			<label for="variantStock" class="form-label">Available Stock</label>
			<input
				type="number"
				class="form-input"
				name="variantStock"
				id="variantStock"
				value={variantToManage?.stock || null}
			/>

			{#if form?.errors?.variantStock}
				{#each form.errors.variantStock as error}
					<p class="form-error">{error}</p>
				{/each}
			{/if}
		</div>

		<div class="form-control col-span-1 md:col-span-2">
			<label for="variantDescription" class="form-label">Description (Optional)</label>
			<textarea
				id="variantDescription"
				name="variantDescription"
				class="form-input"
				rows="5"
				value={variantToManage?.description || null}
			/>

			{#if form?.errors?.variantDescription}
				{#each form.errors.variantDescription as error}
					<p class="form-error">{error}</p>
				{/each}
			{/if}
		</div>

		<div class="form-control">
			<label for="variantPrice" class="form-label"> Price: </label>
			<input
				type="number"
				class="form-input"
				name="variantPrice"
				id="variantPrice"
				value={variantToManage?.price || null}
			/>

			{#if form?.errors?.variantPrice}
				{#each form.errors.variantPrice as error}
					<p class="form-error">{error}</p>
				{/each}
			{/if}
		</div>

		<div class="form-control">
			<label for="variantDiscountPrice" class="form-label"> Discount Price (Optional): </label>
			<input
				type="number"
				class="form-input"
				name="variantDiscountPrice"
				id="variantPrice"
				value={variantToManage?.discountPrice || null}
			/>

			{#if form?.errors?.variantDiscountPrice}
				{#each form.errors.variantDiscountPrice as error}
					<p class="form-error">{error}</p>
				{/each}
			{/if}
		</div>

		<div class="form-control md:col-span-2 col-span-1">
			<button class="button-blue" type="submit">
				{#if loading}
					<div class="flex items-end justify-center gap-3">
						<span>{variantToManage ? 'Saving' : 'Adding variant'}</span>
						<iconify-icon class="text-center" width="20" icon="eos-icons:three-dots-loading" />
					</div>
				{:else}
					<span>{variantToManage ? 'Save' : 'Add'}</span>
				{/if}
			</button>
		</div>
	</form>
</AdminModal>

<form
	action="?/manage"
	method="post"
	enctype="multipart/form-data"
	class="mt-10 grid md:grid-cols-2 grid-cols-1 gap-5"
	use:enhance={() => {
		loading = true;
		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					showToastr(
						product ? 'Update saved!' : 'Product created successfully, you can now add variants!',
						'success'
					);
					product = result.data?.product;
				} else if (result.status === 500) {
					showToastr('Oops!, Something went wrong', 'error');
				}
			} finally {
				loading = false;
				update();
			}
		};
	}}
>
	{#if product}
		<input type="hidden" name="id" value={product.id} />
	{/if}

	<div class="w-full relative flex flex-col gap-1 md:col-span-2 col-span-1">
		<label class=" font-karla" for="featuredImage">Featured Image:</label>
		<div
			class="h-32 w-full border-dashed border-2 border-black/40 flex items-center justify-center"
		>
			{#if previewImage}
				<img src={previewImage} class="w-full h-full object-contain" alt="" />
			{:else}
				<p class="absolute">Upload image</p>
			{/if}
			<input
				on:change={(e) => {
					previewImage = URL.createObjectURL(e?.target?.files[0]);
				}}
				name="featuredImage"
				id="featuredImage"
				class="w-full h-full opacity-0 z-10 cursor-pointer absolute"
				type="file"
				accept="*/image"
			/>
		</div>
		{#if form?.errors?.featuredImage}
			{#each form.errors.featuredImage as error}
				<p class="form-error">{error}</p>
			{/each}
		{/if}
	</div>

	<div class="form-control md:col-span-2 col-span-1">
		<label class="form-label" for="name">Name:</label>
		<input id="name" name="name" class="form-input" type="text" value={product?.name || ''} />

		{#if form?.errors?.name}
			{#each form.errors.name as error}
				<p class="form-error">{error}</p>
			{/each}
		{/if}
	</div>

	<div class="form-control col-span-1 md:col-span-2">
		<label for="shortDescription" class="form-label">Short description</label>
		<textarea
			id="shortDescription"
			name="shortDescription"
			class="form-input"
			rows="5"
			value={product?.shortDescription || null}
		/>

		{#if form?.errors?.shortDescription}
			{#each form.errors.shortDescription as error}
				<p class="form-error">{error}</p>
			{/each}
		{/if}
	</div>

	<div class="form-control">
		<label for="category" class="form-label">Category:</label>
		<Selector
			name="categoryId"
			options={categoryOptions}
			placeholder="Select Category..."
			value={product?.categoryId ?? null}
		/>
		{#if form?.errors?.categoryId}
			{#each form.errors.categoryId as error}
				<p class="form-error">{error}</p>
			{/each}
		{/if}
	</div>

	<div class="form-control flex gap-2">
		<label for="isFeatured" class="form-label"> Is Featured: </label>
		<input
			type="checkbox"
			class="toggle"
			name="isFeatured"
			id="isFeatured"
			checked={product?.isFeatured ?? false}
		/>
		{#if form?.errors?.isFeatured}
			{#each form.errors.isFeatured as error}
				<p class="form-error">{error}</p>
			{/each}
		{/if}
	</div>

	<div class="form-control md:col-span-2 col-span-1">
		<button class="button-blue" type="submit">
			{#if loading}
				<div class="flex items-end justify-center gap-3">
					<span>{product ? 'Saving' : 'Creating product'}</span>
					<iconify-icon class="text-center" width="20" icon="eos-icons:three-dots-loading" />
				</div>
			{:else}
				<span>{product ? 'Save' : 'Create'}</span>
			{/if}
		</button>
	</div>
</form>

{#if product}
	<div
		class="mt-10 form-control md:col-span-2 col-span-1 flex justify-between items-center flex-row"
	>
		<h3>Variants</h3>
		<button class="button-blue" on:click={() => manageVariant()}> Add Variant </button>
	</div>

	{#if variants.length < 1}
		<div class="mt-4 form-control md:col-span-2 col-span-1 text-center">
			<h3 class="font-work-sans text-2xl">No variants yet</h3>
		</div>
	{:else}
		<div class="flex flex-col">
			<div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
				<div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
					<div class="overflow-hidden">
						<table class="min-w-full">
							<thead class="bg-white border-b">
								<tr>
									<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
										Image
									</th>
									<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
										Name
									</th>
									<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
										Stock
									</th>
									<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
										Price
									</th>
									<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
										Discount Price
									</th>
									<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{#each variants as variant}
									<tr class="bg-white border-b">
										<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-28">
											<img
												src={getVariantDefaultImage(variant).url}
												alt=""
												class="object-cover w-full"
												style="aspect-ratio: 16/8;"
											/>
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{variant.name}
										</td>
										<td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
											{variant.stock}
										</td>
										<td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
											{variant.price}
										</td>
										<td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
											{variant.discountPrice}
										</td>
										<td
											class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap flex gap-2 items-center"
										>
											<button class="text-yellow-600" on:click={() => manageVariant(variant)}>
												<iconify-icon icon="fa:edit" width="20" />
												<!-- <iconify-icon icon="iconamoon:edit-light" width="20" /> -->
											</button>
											<button class="text-red-600" on:click={() => openDeleteModal(variant)}>
												<!-- <button class="text-red-600"> -->
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
	{/if}
{/if}
