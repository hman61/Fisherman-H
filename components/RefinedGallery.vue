<script setup lang="ts">
type RefinedImage = {
  src: string
  alt: string
}

const props = defineProps<{
  images: RefinedImage[]
}>()

const activeIndex = ref(0)
const touchStart = ref(0)

const activeImage = computed(() => props.images[activeIndex.value])
const activeCaption = computed(() => {
  const filename = activeImage.value.src.split('/').pop() ?? ''
  return filename
    .replace(/^\d+-/, '')
    .replace(/\.[^.]+$/, '')
    .replace(/-/g, ' ')
})

function select(index: number) {
  activeIndex.value = (index + props.images.length) % props.images.length
}

function next() {
  select(activeIndex.value + 1)
}

function previous() {
  select(activeIndex.value - 1)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') next()
  if (event.key === 'ArrowLeft') previous()
}

function handleTouchEnd(event: TouchEvent) {
  const distance = event.changedTouches[0].clientX - touchStart.value
  if (Math.abs(distance) < 45) return
  distance < 0 ? next() : previous()
}
</script>

<template>
  <div
    class="refined-gallery"
    role="region"
    aria-roledescription="carousel"
    aria-label="Fish, catch, refine and cook photo story"
    tabindex="0"
    @keydown="handleKeydown"
    @touchstart="touchStart = $event.changedTouches[0].clientX"
    @touchend="handleTouchEnd"
  >
    <button
      class="refined-gallery__arrow refined-gallery__arrow--previous"
      type="button"
      aria-label="Previous refined photo"
      @click="previous"
    >
      <span aria-hidden="true">&lt;</span>
    </button>

    <div class="refined-gallery__stage">
      <Transition name="gallery-fade" mode="out-in">
        <figure :key="activeImage.src" class="refined-gallery__figure">
          <p class="eyebrow refined-gallery__caption">{{ activeCaption }}</p>
          <NuxtImg
            class="refined-gallery__image"
            :src="activeImage.src"
            :alt="activeImage.alt"
            width="1600"
            height="1067"
            sizes="(max-width: 760px) 92vw, 1200px"
            loading="lazy"
          />
          <figcaption>
            {{ String(activeIndex + 1).padStart(2, '0') }} /
            {{ String(images.length).padStart(2, '0') }}
          </figcaption>
        </figure>
      </Transition>

      <div class="refined-gallery__dots" aria-label="Choose a photo">
        <button
          v-for="(image, index) in images"
          :key="image.src"
          type="button"
          :class="{ 'is-active': index === activeIndex }"
          :aria-label="`Show refined photo ${index + 1}`"
          :aria-current="index === activeIndex ? 'true' : undefined"
          @click="select(index)"
        />
      </div>
    </div>

    <button
      class="refined-gallery__arrow refined-gallery__arrow--next"
      type="button"
      aria-label="Next refined photo"
      @click="next"
    >
      <span aria-hidden="true">&gt;</span>
    </button>
  </div>
</template>
