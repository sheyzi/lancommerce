<script lang="ts">
    import ProductCard from '$lib/components/ProductCard.svelte';
    import emblaCarouselSvelte from 'embla-carousel-svelte';
    import EmblaCarousel from 'embla-carousel';
    import { onMount } from 'svelte';
    import ArrowLeft from './icons/ArrowLeft.svelte';
    import ArrowRight from './icons/ArrowRight.svelte';
    export let products;
    export let title;

    let options = { loop: false, containScroll: 'trimSnaps', dragFree: true, speed: 10, dragThreshold: 1, selectedClass: 'selected' };

    let embla;
    let emblaNode;
    let prevButtonNode;
    let nextButtonNode;
    let canScrollPrev = false;
    let canScrollNext = true;

    onMount(() => {
        emblaNode = document.querySelector('.embla__viewport');
        prevButtonNode = document.querySelector('.embla__prev');
        nextButtonNode = document.querySelector('.embla__next');
        embla = EmblaCarousel(emblaNode);

        const updateButtons = () => {
            canScrollPrev = embla.canScrollPrev();
            canScrollNext = embla.canScrollNext();
        };

        embla.on('select', updateButtons);
        embla.on('init', updateButtons);

        prevButtonNode?.addEventListener('click', embla.scrollPrev, false);
        nextButtonNode?.addEventListener('click', embla.scrollNext, false);
    });
</script>

<section role="contentinfo" class="max-w-[94rem] mx-auto md:px-10 px-5 mt-[60px]">
    <div class="text text-black flex flex-col gap-10 w-full">
       <div class="min-w-full flex justify-between items-center">
        <h3 class="text-2xl font-bold max-w-[50%] uppercase">{title}</h3>
        <a href="/products" class=" text-sm lg:text-lg flex gap-2 hover:gap-4 transition-all duration-200 items-center">
        <span>View All</span>
        <ArrowRight/>
        </a>
       </div>

        <div class="embla">
            <div class="embla__viewport" use:emblaCarouselSvelte={{ options }}>
                <div class="embla__container">
                    {#each products as product}
                        <div class="embla__slide">
                            <ProductCard {product} />
                        </div>
                    {/each}
                </div>
            </div>
            {#if canScrollPrev}
                <button class="embla__prev hidden lg:block"><ArrowLeft/></button>
            {/if}
            {#if canScrollNext}
                <button class="embla__next hidden lg:block"><ArrowRight/></button>
            {/if}
        </div>


    </div>
</section>

<style>
    .embla {
        position: relative;
        overflow: hidden;
    }
    .embla__viewport {
        overflow: hidden;
        width: 100%;
    }
    .embla__container {
        display: flex;
        gap: 40px;
    }
    .embla__slide {
        flex: 0 0 auto;
        width: auto;
    }
    .embla__prev,
    .embla__next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        border: none;
        padding: 10px;
        cursor: pointer;
    }
    .embla__prev {
        left: 10px;
    }
    .embla__next {
        right: 10px;
    }
</style>