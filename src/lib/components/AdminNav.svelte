<script lang="ts">
	import Avatar from './Avatar.svelte';
</script>

<div class="flex justify-between px-10 py-5 fixed top-0 w-screen z-10 bg-white wrapper">
	<!-- Logo -->
	<div>
		<a href="/admin" class="text-xl font-bold">
			Abike & You
		</a>
	</div>
	<nav class="flex space-x-5">
		<Avatar />
	</nav>
</div>

<style>
	.wrapper {
		box-shadow: 0px 4px 20px -12px rgba(0, 0, 0, 0.15);
	}
</style>
