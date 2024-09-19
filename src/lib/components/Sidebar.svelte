<script>
	import SidebarItem from './SidebarItem.svelte';
	import { page } from '$app/stores';
</script>

<aside class="bg-white text-black fixed left-0 w-fit h-screen pt-[70px] sidebar overflow-y-scroll">
	<nav class="flex flex-col justify-between h-full">
		<div>
			<SidebarItem label="Dashboard" href="/admin" active={$page.url.pathname === '/admin'}>
				<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24"
					><path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M4 4h6v8H4zm0 12h6v4H4zm10-4h6v8h-6zm0-8h6v4h-6z"
					/></svg
				>
			</SidebarItem>
			<SidebarItem
				label="Categories"
				href="/admin/categories"
				active={$page.url.pathname.startsWith('/admin/categories')}
			>
				<iconify-icon icon="bi:collection" width="23" />
			</SidebarItem>
			<SidebarItem
				label="Products"
				href="/admin/products"
				active={$page.url.pathname.startsWith('/admin/products')}
			>
				<iconify-icon icon="solar:hanger-broken" width="25" />
			</SidebarItem>
			<SidebarItem
				label="Orders"
				href="/admin/orders"
				active={$page.url.pathname.startsWith('/admin/orders')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class=" h-6 w-6 nav-item"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
					/>
				</svg>
			</SidebarItem>
			<SidebarItem
				label="Customers"
				href="/admin/customers"
				active={$page.url.pathname.startsWith('/admin/customers')}
			>
				<iconify-icon icon="ph:users" width="25" />
			</SidebarItem>
		</div>

		<div>
			<form action="/?/logout" method="post">
				<button
					class="p-5 border-b border-[#BDBDBD] hover:bg-egreen/60 hover:text-black text-black flex flex-col gap-1 items-center justify-center w-full border-t"
				>
					<iconify-icon icon="ant-design:logout-outlined" width="25" />
					<span class="font-medium">Logout</span>
				</button>
			</form>
		</div>
	</nav>
</aside>

<style>
	.sidebar {
		box-shadow: 9px 0px 20px -12px rgba(0, 0, 0, 0.15);

		/* Hide scrollbar for IE, Edge and Firefox */
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	/* Hide scrollbar for Chrome, Safari and Opera */
	.sidebar::-webkit-scrollbar {
		display: none;
	}
</style>
