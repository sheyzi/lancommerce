<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Dashboard - Evolv</title>
</svelte:head>

<div class="mb-10 flex justify-between">
	<Breadcrumb />

	<form action="?/admin/getstats" class="flex items-center">
		<!-- Select time period: e.g 24 hours, 7 days, 2 weeks, 1 month, 1 year, All time -->
		<select
			name="period"
			class="border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 h-full"
		>
			<option value="1">24 hours</option>
			<option value="7">7 days</option>
			<option value="14">2 weeks</option>
			<option value="30">1 month</option>
			<option value="365">1 year</option>
			<option value="all">All time</option>
		</select>

		<button
			type="submit"
			class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-eblue hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
		>
			<!-- Heroicon name: solid/plus -->
			<svg
				class="-ml-1 mr-2 h-5 w-5"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M5 8a1 1 0 011-1h3V4a1 1 0 112 0v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0V9H6a1 1 0 01-1-1z"
					clip-rule="evenodd"
				/>
			</svg>
			Fetch
		</button>
	</form>
</div>

<div class="grid grid-cols-3 gap-x-10">
	<StatCard title="Sales" desc="21% more than last month">&#8358;89,400</StatCard>
	<StatCard
		title="Customers"
		desc=" {Math.abs(data.customerPercentageDifference)}% {Math.sign(
			data.customerPercentageDifference
		) === -1
			? 'less'
			: 'more'} than yesterday"
	>
		<span
			slot="desc-icon"
			class={Math.sign(data.customerPercentageDifference) === -1
				? 'text-red-500'
				: 'text-green-500'}
		>
			{@html Math.sign(data.customerPercentageDifference) === -1
				? '<iconify-icon icon="uil:chart-down" width="20" />'
				: '<iconify-icon icon="uil:chart-down" width="20" rotate="180deg"></iconify-icon>'}
		</span>
		{data.customers.length}
	</StatCard>
	<StatCard title="Products">
		{data.products.length}
	</StatCard>
</div>
