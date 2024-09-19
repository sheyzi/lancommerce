<!-- Hero Section -->
<section class="relative">
    <div class="hero relative h-screen w-full ">
		<div class="hero-content justify-center items-center w-full">

			<div class="flex flex-col md:items-start gap-8">
				<div class="flex flex-col gap-3">
					<h1 class="hero-title text-2xl">Snap Back Specials</h1>
					<p class="hero-description">
						Holiness meets contemporary swag in our latest cloth collection. Stay slick in the lord.
					</p>
					
				</div>
				
								<a class="flex items-center text-2xl uppercase group"
				   href="#featured">
					<span>Shop Now</span> 
					<img src="/icons/arrow-right.svg" alt="" class="transform transition-transform duration-300 group-hover:rotate-90">
				</a>

				<!-- <a
					href="#featured"
					class="rounded-full bg-egreen uppercase mt-[40px] text-black text-center font-medium py-2 px-5 hover:bg-[#1f5a7d] transition-all"
					>Shop Now</a
				> -->
			</div>
		 
        <div class="absolute inset-x-0 bottom-0 flex flex-col items-center pb-4 w-full max-w-7xl mx-auto pointer-events-none">
            <div class="hero-name w-full text-start text-white text-[15vw] font-universo font-semibold">EVOLV.</div>
		
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
    }

    .hero-content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        color: white;
        font-family: 'Karla', sans-serif;
    }

    .hero-title {
        color: #ffffff;
        text-align: start;
        /* font: 600 60px 'Universo', sans-serif; */
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
        /* margin: 30px 0 0 0; */
    }

    @media (max-width: 668px) {
        .hero {
            aspect-ratio: 414/638;
        }

        .hero-name {
            font-size: 8rem; /* Adjust the font size for mobile */
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