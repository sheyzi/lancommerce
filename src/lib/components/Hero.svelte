<!-- Hero Section -->
<section class="relative">
	<div class="hero relative">
		<!-- <div class="hero-overlay" /> -->
		<div class="hero-content w-full">
			<div class="flex justify-start">
				<p
					class="bg-elightpurple rounded-xl text-center text-sm text-black font-medium font-karla px-3 py-1"
				>
					NEW DRIP!!
				</p>
			</div>
			<div class="flex flex-col items-center md:items-start">
				<div class="gap-[30px]">
					<h1 class="hero-title">Snap Back Specials</h1>
					<p class="hero-description">
						Holiness meets contemporary swag in our latest cloth collection. Stay slick in the lord.
					</p>
				</div>

				<a
					href="#featured"
					class="rounded-full bg-egreen uppercase mt-[40px] text-black text-center font-medium py-2 px-5 hover:bg-[#1f5a7d] transition-all"
					>Shop Now</a
				>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		background-image: url('/EVOLV5.jpg');
		background-size: cover;
		background-position: center right;
		background-repeat: no-repeat;
		aspect-ratio: 360/179;
		max-height: 600px;
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		color: white;
		/* text-align: center; */
		font-family: 'Karla', sans-serif;
	}

	.hero-title {
		color: #ffffff;
		text-align: start;
		font: 600 60px 'Universo', sans-serif;
		position: relative;
		max-width: 700px;
		line-height: 1;
	}

	.hero-description {
		color: #ffffff;
		text-align: start;
		font: 400 16px 'Karla', sans-serif;
		position: relative;
		max-width: 411px;
		margin: 30px 0 0 0;
	}

	@media (max-width: 668px) {
		.hero {
			aspect-ratio: 414/638;
		}

		.hero-content {
			padding: 0 20px;
			align-items: center;
		}

		.hero-title {
			font-size: 48px;
			text-align: center;
		}

		.hero-description {
			font-size: 16px;
		}
	}
</style>
