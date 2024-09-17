<script lang="ts">
	export let title: string;
	export let desc: string | undefined = undefined;
</script>

<div class="stats shadow">
	<div class="stat gap-3">
		<div class="stat-title">{title}</div>
		<div class="stat-value"><slot /></div>
		{#if desc}
			<div class="stat-desc flex items-center gap-1">
				<slot name="desc-icon" />
				{desc}
			</div>
		{/if}
	</div>
</div>
