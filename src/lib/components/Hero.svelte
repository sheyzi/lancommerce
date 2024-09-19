<!-- Hero Section -->
<section class="relative">
	<div
		class="hero relative h-[90vh] lg:h-screen w-full bg-cover bg-center-right bg-no-repeat"
		style="background-image: url('/EVOLV5.jpg'); aspect-ratio: 360/179;"
	>
		<div
			class="hero-content flex flex-col justify-start items-start w-full px-4 text-white font-karla lg:max-w-7xl pl-2"
		>
			<div class="flex flex-col md:items-start gap-8">
				<div class="flex flex-col gap-3">
					<h1 class="hero-title text-2xl md:text-4xl text-left max-w-[700px] leading-none">
						Snap Back Specials
					</h1>
					<p class="hero-description text-base md:text-lg text-left font-normal max-w-[411px]">
						Holiness meets contemporary swag in our latest cloth collection. Stay slick in the lord.
					</p>

				</div>

				<a class="flex items-center text-2xl uppercase group" href="#featured">
					<span>Shop Now</span>
					<img
						src="/icons/arrow-right.svg"
						alt=""
						class="transform transition-transform duration-300 group-hover:rotate-90"
					/>
				</a>
			</div>
		</div>
		<div
			class="absolute inset-x-0 bottom-0 flex flex-col items-start w-full lg:max-w-7xl mx-auto hero-name text-start text-white text-2xl lg:text-[13vw] font-universo font-semibold h-28 lg:h-[10rem] px-5 lg:px-0"
		>
			<div>EVOLV.</div>
		</div>

     
	</div>
</section>

<style>
	@media (max-width: 668px) {
		.hero {
			aspect-ratio: 414/638;
		}

		.hero-name {
			font-size: 4rem;
		}

		.hero-content {
			padding: 0 20px;
			align-items: center;
		}

		.hero-title {
			font-size: 2rem;
		}

		.hero-description {
			font-size: 1rem;
		}
	}
</style>
