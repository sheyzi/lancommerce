<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Order Success - Evolv</title>
</svelte:head>

<div class="min-h-[80vh] flex justify-center items-center px-5 md:px-10">
	<div class="shadow rounded p-5 text-center max-w-[500px]">
		<div class="mb-5 text-green-600">
			<iconify-icon icon="icon-park-outline:success" width="60" />
		</div>
		<h1 class="text-2xl font-medium font-work-sans mb-4">Order Confirmed</h1>
		<p>
			Your order has been placed successfully. You will receive an email with your order details
			shortly. <a href="/account" class="text-sm text-epurple">Order History</a>
		</p>
		<p class="mt-4">
			<a href="/" class="bg-black text-white py-2 px-4 rounded-lg mt-4 btn">Return to home</a>
		</p>
	</div>
</div>
