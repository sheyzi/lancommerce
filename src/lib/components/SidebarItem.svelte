<script lang="ts">
	export let label: string;
	export let href: string = '';
	export let active: boolean = false;
	export let topBorder: boolean = false;
</script>

<a
	{href}
	class="p-5 border-b border-[#BDBDBD] hover:bg-egreen/60 hover:text-black text-black flex flex-col gap-1 items-center justify-center {active &&
		'bg-egreen/80 text-black'}"
	class:border-t={topBorder}
>
	<slot />
	<span class="font-medium">{label}</span>
</a>
