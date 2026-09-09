<script setup lang="ts">
import type { GalleryImage } from '~/data/site'

const props = defineProps<{
  images: GalleryImage[]
}>()

const activeIndex = ref(0)
const isPlaying = ref(false)
const touchStart = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

const activeImage = computed(() => props.images[activeIndex.value])

function select(index: number) {
  activeIndex.value = (index + props.images.length) % props.images.length
}

function next() {
  select(activeIndex.value + 1)
}

function previous() {
  select(activeIndex.value - 1)
}

function stopTimer() {
  if (timer) clearInterval(timer)
  timer = undefined
}

function syncTimer() {
  stopTimer()
  if (isPlaying.value) timer = setInterval(next, 5000)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') next()
  if (event.key === 'ArrowLeft') previous()
  if (event.key === ' ') {
    event.preventDefault()
    isPlaying.value = !isPlaying.value
  }
}

function handleTouchEnd(event: TouchEvent) {
  const distance = event.changedTouches[0].clientX - touchStart.value
  if (Math.abs(distance) < 45) return
  distance < 0 ? next() : previous()
}

watch(isPlaying, syncTimer)
onBeforeUnmount(stopTimer)
</script>

<template>
  <div
    class="gallery"
    role="region"
    aria-roledescription="carousel"
    aria-label="River to Table photo story"
    tabindex="0"
    @keydown="handleKeydown"
    @touchstart="touchStart = $event.changedTouches[0].clientX"
    @touchend="handleTouchEnd"
  >
    <div class="gallery__stage">
      <Transition name="gallery-fade" mode="out-in">
        <figure :key="activeImage.src" class="gallery__figure">
          <NuxtImg
            class="gallery__image"
            :src="activeImage.src"
            :alt="activeImage.alt"
            :style="{ objectPosition: activeImage.position ?? 'center' }"
            width="1800"
            height="1200"
            sizes="100vw md:90vw xl:1400px"
            loading="lazy"
          />
          <figcaption class="gallery__caption">
            <span class="eyebrow">{{ activeImage.title }}</span>
            <p>{{ activeImage.caption }}</p>
          </figcaption>
        </figure>
      </Transition>

      <div class="gallery__controls">
        <button type="button" aria-label="Previous photo" @click="previous">
          <span aria-hidden="true">←</span>
        </button>
        <span aria-live="polite">
          {{ String(activeIndex + 1).padStart(2, '0') }} /
          {{ String(images.length).padStart(2, '0') }}
        </span>
        <button type="button" aria-label="Next photo" @click="next">
          <span aria-hidden="true">→</span>
        </button>
        <button
          class="gallery__play"
          type="button"
          :aria-label="isPlaying ? 'Pause slideshow' : 'Play slideshow'"
          :aria-pressed="isPlaying"
          @click="isPlaying = !isPlaying"
        >
          {{ isPlaying ? 'Pause' : 'Play' }}
        </button>
      </div>
    </div>

    <div class="gallery__thumbs" aria-label="Choose a photo">
      <button
        v-for="(image, index) in images"
        :key="image.src"
        type="button"
        :class="{ 'is-active': index === activeIndex }"
        :aria-label="`Show photo ${index + 1}: ${image.title}`"
        :aria-current="index === activeIndex ? 'true' : undefined"
        @click="select(index)"
      >
        <NuxtImg
          :src="image.src"
          alt=""
          width="144"
          height="96"
          sizes="72px"
          loading="lazy"
        />
      </button>
    </div>
  </div>
</template>
