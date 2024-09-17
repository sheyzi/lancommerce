<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { showToastr } from '$lib/utils';
	import { currentUser } from '$lib/stores/user.stores';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
	let loading = false;
</script>

<!-- Centered tailwind ecommerce login page -->
<svelte:head>
	<title>Sign Up - Evolv</title>
</svelte:head>

<div class="w-full h-full flex flex-col items-center justify-center py-20">
	<h3 class="text-3xl text-black font-medium">Sign Up</h3>

	<form
		class="max-w-md w-full px-5 py-10 grid grid-cols-1 gap-4"
		action=""
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result, update }) => {
				try {
					const next = $page.url.searchParams.get('next');
					if (result?.data.success) {
						currentUser.set(result?.data.user);
						if (next) return await goto(next);
						await goto('/');
					} else if (result.status === 409) {
						showToastr('User data already exists!', 'error');
					} else {
						showToastr('Ooops... Something went wrong!', 'error');
					}
				} finally {
					update();
					loading = false;
				}
			};
		}}
	>
		<div class="flex flex-col gap-1">
			<label class="font-medium font-work-sans" for="email">Email</label>
			<input
				class="w-full py-2.5 px-3 border focus:outline-none"
				type="email"
				name="email"
				id="email"
			/>
			{#if form?.errors?.email}
				<p class="text-red-500 text-xs">{form?.errors?.email}</p>
			{/if}
		</div>
		<div class="flex flex-col gap-1">
			<label class="font-medium font-work-sans" for="password">Password</label>
			<input
				class="w-full py-2.5 px-3 border focus:outline-none"
				type="password"
				name="password"
				id="password"
			/>
			{#if form?.errors?.password}
				<p class="text-red-500 text-xs">{form?.errors?.password}</p>
			{/if}
		</div>

		<div class="flex flex-col gap-1">
			<label class="font-medium font-work-sans" for="confirmPassword">Confirm Password</label>
			<input
				class="w-full py-2.5 px-3 border focus:outline-none"
				type="password"
				name="confirmPassword"
				id="confirmPassword"
			/>
			{#if form?.errors?.confirmPassword}
				<p class="text-red-500 text-xs">{form?.errors?.confirmPassword}</p>
			{/if}
		</div>

		<div class="grid grid-cols-1 gap-2 w-full items-center">
			<button class="bg-black/80 py-2 px-4 text-white flex items-center justify-center text-center"
				>{@html loading
					? '<iconify-icon class="text-center" width="35" icon="eos-icons:three-dots-loading"></iconify-icon>'
					: 'Sign up'}
			</button>
			<div class="flex w-full items-center gap-2 justify-center">
				<hr />
				<p class="text-center text-sm">or</p>
				<hr />
			</div>
			<a class="w-full bg-slate-200 px-3 py-2.5 text-center" href="/auth/login"
				>Login to your account</a
			>
		</div>
	</form>
</div>
