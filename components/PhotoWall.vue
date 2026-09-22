<script setup lang="ts">
type PhotoWallImage = {
  src: string
  alt: string
  width: number
  height: number
}

defineProps<{
  portrait: PhotoWallImage[]
  landscape: PhotoWallImage[]
}>()
</script>

<template>
  <div class="photo-wall">
    <div v-if="portrait.length" class="photo-wall__group">
      <h3 class="photo-wall__label">No Color, no flavor...</h3>
      <div class="photo-wall__grid photo-wall__grid--portrait">
        <NuxtImg
          v-for="image in portrait"
          :key="image.src"
          class="photo-wall__image"
          :src="image.src"
          :alt="image.alt"
          width="400"
          height="600"
          sizes="(max-width: 760px) 30vw, 10vw"
          loading="lazy"
        />
      </div>
    </div>

    <div v-if="landscape.length" class="photo-wall__group">
      <!-- <h3 class="photo-wall__label">Landscape</h3> -->
      <div class="photo-wall__grid photo-wall__grid--landscape">
        <NuxtImg
          v-for="image in landscape"
          :key="image.src"
          class="photo-wall__image"
          :src="image.src"
          :alt="image.alt"
          width="600"
          height="400"
          sizes="(max-width: 760px) 45vw, 15vw"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>
