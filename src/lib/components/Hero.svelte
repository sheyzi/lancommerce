<script lang="ts">
    import { onMount } from 'svelte';
    import emblaCarouselSvelte from 'embla-carousel-svelte';
    import Autoplay from 'embla-carousel-autoplay';
    import { animate, spring } from "motion"

    let emblaApi;
    const options = { loop: true };
    let plugins = [Autoplay()];

    const slides = [

  {
    image: "/img/img1.jpg",
    title: "Snap Back Specials",
    description: "Holiness meets contemporary swag in our latest cloth collection. Stay slick in the lord."
  },
  {
    image: "/img/img2.jpg",
    title: "Urban Edge",
    description: "Cutting-edge designs that redefine modern fashion. Stay sharp, stay edgy."
  },
  {
    image: "/img/img3.jpg",
    title: "Classic Cool",
    description: "Timeless pieces with a fresh twist. Your go-to look for any occasion."
  },
  {
    image: "/img/img4.jpg",
    title: "Effortless Vibe",
    description: "Laid-back but never lazy. Casual wear that speaks volumes about your style."
  },
  {
    image: "/img/img5.jpg",
    title: "Bold Statements",
    description: "Fashion that dares to be different. Stand out with our exclusive collection."
  }


	];
  
    function onInit(event: { detail: any; }) {
        emblaApi = event.detail;
    }

    function animateSlide(element: Element, isEntering: boolean) {
        const titleElement = element.querySelector('.hero-title .text');
        const descriptionElement = element.querySelector('.hero-description');

        if (isEntering) {
            if (titleElement) {
                animate(titleElement, 
                    { 
                        transform: ['translateY(100%) skewY(10deg)', 'translateY(0%) skewY(0deg)'],
                        opacity: [0, 1],
                        scale: [0.8, 1]
                    },
                    {   
                        duration: 0.8,
                        easing: spring({ stiffness: 100, damping: 15 })
                    }
                );
            }

            if (descriptionElement) {
                animate(descriptionElement,
                    {
                        opacity: [0, 1],
                        transform: ['translateY(20px)', 'translateY(0px)']
                    },
                    {
                        duration: 0.5,
                        delay: 0.3,
                        easing: spring({ stiffness: 100, damping: 15 })
                    }
                );
            }
        } else {
            if (titleElement instanceof HTMLElement) {
                titleElement.style.opacity = '0';
                titleElement.style.transform = 'translateY(100%) skewY(10deg) scale(0.8)';
            }
            if (descriptionElement instanceof HTMLElement) {
                descriptionElement.style.opacity = '0';
                descriptionElement.style.transform = 'translateY(20px)';
            }
        }
    }

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                animateSlide(entry.target, entry.isIntersecting);
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.embla__slide').forEach(slide => {
            observer.observe(slide);
        });

        return () => {
            observer.disconnect();
        };
    });
</script>
  
<section class="relative overflow-y-hidden">
    <div class="embla h-[90vh] lg:h-screen w-full" use:emblaCarouselSvelte="{{ options, plugins }}" on:emblaInit={onInit}>
        <div class="embla__container h-full">
            {#each slides as slide}
                <div class="embla__slide relative h-full w-full flex-shrink-0 bg-fixed">
                    <div 
                        class="hero relative h-full w-full bg-cover bg-center bg-no-repeat bg-fixed"
                        style="background-image: url('{slide.image}');"
                    >
                        <div class="overlay absolute inset-0 bg-black opacity-50"></div>
                        <div class="hero-content flex flex-col justify-start items-start w-full px-4 text-white font-karla lg:max-w-7xl pl-2">
                            <div class="flex flex-col md:items-start gap-8">
                                <div class="flex flex-col gap-3">
                                    <h1 class="hero-title text-5xl md:text-8xl lg:text-5xl xl:text-6xl text-left max-w-[700px] leading-none text-white py-10 overflow-hidden">
                                      <div class="text opacity-0 transform translate-y-full skew-y-[10deg] scale-90">
                                        {slide.title}
                                      </div>  
                                    </h1>
                                    <p class="hero-description text-base md:text-lg xl:text-lg text-left font-normal max-w-[411px] opacity-0 transform translate-y-5">
                                        {slide.description}
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
                    </div>
                </div>
            {/each}
        </div>
    </div>
    <div class="absolute inset-x-0 bottom-0 flex flex-col items-start w-full lg:max-w-7xl mx-auto hero-name text-start text-white text-2xl lg:text-[9rem] xl:text-[13vw] font-universo font-semibold h-28 lg:h-[10rem] px-5 lg:px-0">
        <div class="text-left ">EVOLV.</div>
    </div>
</section>
  
<style>
    .embla {
        overflow: hidden;
    }
    .embla__container {
        display: flex;
    }
    .embla__slide {
        flex: 0 0 100%;
        min-width: 0;
    }
    .hero {
        position: relative;
    }
    .overlay {
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }
    @media (max-width: 668px) {
        .hero {
            aspect-ratio: 414/638;
        }
        .hero-name {
            font-size: 4rem;
            text-align: left;
        }
        .hero-content {
            padding: 0 20px;
            align-items: flex-start;
        }
        .hero-title {
            text-align: left;
        }
        .hero-description {
            font-size: 1rem;
            text-align: left;
        }
    }
</style>