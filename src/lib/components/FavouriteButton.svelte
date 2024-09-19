<script lang="ts">
	import type { ProductWithRelations } from '../types/products.types';
	import { currentUser } from '../stores/user.stores';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { showToastr } from '../utils';

	export let product: ProductWithRelations;

	let isFavourite = false;

	$: isFavourite =
		$currentUser && $currentUser.favourites.some((fav) => fav.id === product.id) ? true : false;
</script>

<form
	action="/?/toggleFavourite"
	method="post"
	use:enhance={() => {
		return async ({ result, update }) => {
			if (result.status === 200) {
				const user = result.data.user;
				currentUser.set(user);

				const type = result.data.type;
				if (type === 'connect') {
					showToastr('Product added to wishlist', 'success');
					isFavourite = true;
				} else {
					showToastr('Product removed from wishlist', 'success');
					isFavourite = false;
				}
			}
		};
	}}
>
	<input type="hidden" name="productId" value={product.id} />
	{#if $currentUser}
		<button
			type="submit"
			class="hover:text-black {isFavourite ? 'text-black' : 'text-transparent'}"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="currentColor"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="#111111"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
				/>
			</svg>
		</button>
	{:else}
		<a
			href="/auth/login?next={$page.url.pathname}&message=Login to add product to wishlist"
			class="hover:text-black text-transparent"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="currentColor"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="#111111"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
				/>
			</svg>
		</a>
	{/if}
</form>
