<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  export let progress = 0;
  export let isLoading = true;

  let icons = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path fill="#ffffff" d="m288 16l32 16s-25.2 44.02-16 64c5 10.8 32 16 32 16c-16 32-32 80-32 96c80 48 80 144 160 176c0 64-80 112-208 112S48 448 48 384c80-32 80-128 160-176c0-16-16-64-32-96c0 0 27-5.2 32-16c9.2-19.98-16-64-16-64l32-16c0 32 16 48 32 48s32-16 32-48"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M480 96L320 48c-13.988 27.227-30.771 40.223-63.769 40.223C223.723 87.676 205.722 75 192 48L32 96l32 88 64-8-16 288h288l-16-288 64 8 32-88z" fill="#ffffff"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path fill="#ffffff" d="M29.183 20C31.264 15.054 36.35 10.667 39 8c1.104.667 5 2.604 5 7c0 4-1.455 7.111-3 8l-5.987 4.191a23 23 0 0 0-6.533 7.01L25 40H4v-4c2.429-1.333 9.82-5.867 13-8c7 4 10.5-4 12.183-8"/><path d="M43 21v19"/></g></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path fill="#ffffff" d="M192 32c0 16 0 32-16 48l-64 32l-37.646 163.139c20.315 9.254 41.137 16.022 62.947 19.007L160 192c0 64 0 192-32 304c16.315-4.079 36.8-7.112 59.313-9.111c9.09-14.67 17.425-42.087 23.058-76.11c.097-.585.188-1.19.283-1.779H192v-18h21.293c1.271-9.625 2.386-19.655 3.35-30H192v-18h26.148c.727-9.803 1.322-19.829 1.795-30H192v-18h28.646c.14-4.382.262-8.777.356-13.191c.119-5.583.2-11.19.246-16.809H192v-18h29.275c-.051-10.022-.22-20.04-.49-30H192v-18h28.176a1290 1290 0 0 0-1.557-30H192v-18h25.334a1049 1049 0 0 0-2.797-30H192v-18h20.404c-3.451-26.732-7.839-50.259-13.058-68.527l.199-.057A346 346 0 0 1 192 32m128 0c-2.562.854-5.07 1.653-7.545 2.416l.2.057c-5.22 18.268-9.608 41.795-13.06 68.527H320v18h-22.537a1049 1049 0 0 0-2.797 30H320v18h-26.62a1301 1301 0 0 0-1.556 30H320v18h-28.785c-.27 9.96-.439 19.978-.49 30H320v18h-29.248c.046 5.619.127 11.226.246 16.809c.094 4.414.217 8.809.356 13.191H320v18h-27.943a1096 1096 0 0 0 1.795 30H320v18h-24.643c.964 10.345 2.079 20.375 3.35 30H320v18h-18.654c.095.59.186 1.194.283 1.78c5.633 34.022 13.967 61.439 23.058 76.109C347.2 488.888 367.685 491.92 384 496c-32-112-32-240-32-304l22.7 102.146c21.809-2.985 42.63-9.753 62.946-19.007L400 112l-64-32c-16-16-16-32-16-48m-100.639 7.72c14.695 59.028 21.537 153.15 19.637 242.471c-1.007 47.323-4.517 93.164-10.87 131.53c-4.77 28.82-10.831 53.327-19.462 71.619c30.778-1.773 63.89-1.773 94.668 0c-8.631-18.292-14.691-42.798-19.463-71.62c-6.352-38.365-9.862-84.206-10.869-131.529c-1.9-89.32 4.942-183.443 19.637-242.47c-25.553 5.69-47.725 5.69-73.278 0zM54.671 285.396c-1.49 7.72-2.976 15.435-3.648 22.43c-1.022 10.64.299 18.44 3.645 22.13c17.186 18.957 41.688 25.915 67.963 28.494c7.592-15.13 12.333-30.41 12.566-46.512c-28.605-3.87-55.172-13.757-80.525-26.542zm402.657 0c-25.353 12.785-51.92 22.672-80.525 26.543c.233 16.102 4.974 31.382 12.566 46.511c26.275-2.579 50.777-9.537 67.963-28.494c3.346-3.69 4.667-11.49 3.645-22.13c-.672-6.995-2.159-14.71-3.649-22.43"/></svg>'
  ];

  let currentIconIndex = 0;
  let fontsLoaded = false;

  function checkFontsLoaded() {
    return new Promise((resolve) => {
      if (document.fonts.ready) {
        document.fonts.ready.then(() => {
          fontsLoaded = true;
          resolve(true);
        });
      } else {
        // Fallback for browsers that don't support document.fonts
        setTimeout(() => {
          fontsLoaded = true;
          resolve(true);
        }, 2000);
      }
    });
  }

  onMount(() => {
    checkFontsLoaded();

    const interval = setInterval(() => {
      if (progress < 100) {
        progress += 10;
        currentIconIndex = (currentIconIndex + 1) % icons.length;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (fontsLoaded) {
            isLoading = false;
          }
        }, 500);
      }
    }, 200);

    return () => clearInterval(interval);
  });
</script>

{#if isLoading}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black"
    transition:fade={{ duration: 300 }}
  >
    <div class="text-center">
      <div class="mb-4 text-4xl font-bold text-white font-universo">
        {@html icons[currentIconIndex]}
      </div>
     
      <div class="mt-2 text-xl text-white font-work-sans">{progress}%</div>
    </div>
  </div>
{/if}

<style>
  @font-face {
    font-family: 'Universo';
    src: url('/fonts/universo-thin.otf') format('opentype');
    font-weight: 100;
    font-display: swap;
  }

  @font-face {
    font-family: 'Universo';
    src: url('/fonts/universo-light.otf') format('opentype');
    font-weight: 300;
    font-display: swap;
  }

  @font-face {
    font-family: 'Universo';
    src: url('/fonts/universo-regular.otf') format('opentype');
    font-weight: 400;
    font-display: swap;
  }

  @font-face {
    font-family: 'Universo';
    src: url('/fonts/universo-bold.otf') format('opentype');
    font-weight: 700;
    font-display: swap;
  }

  @font-face {
    font-family: 'Universo';
    src: url('/fonts/universo-black.otf') format('opentype');
    font-weight: 900;
    font-display: swap;
  }
</style>