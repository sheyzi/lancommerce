<script lang="ts">
	import { page } from '$app/stores';
	import AdminNav from '$lib/components/AdminNav.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
</script>

<div>
	<AdminNav />
	<Sidebar />

	<div class="relative ml-[125px] pt-[70px]">
		<!-- Content -->
		<main class="p-10">
			{#if $page.url.pathname !== '/admin'}
				<div class="mb-10">
					<Breadcrumb />
				</div>
			{/if}
			<slot />
		</main>
	</div>
</div>
