<script setup lang="ts">
import type { CaptionChoice, GalleryCaptions, GalleryImage } from '~/data/site'

type StoredCaptions = GalleryCaptions & { selected: CaptionChoice }

const props = defineProps<{
  images: GalleryImage[]
}>()

const activeIndex = ref(0)
const isPlaying = ref(false)
const touchStart = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

const storageKey = (src: string) => `gallery-captions:${src}`

const editableCaptions = reactive<Record<string, StoredCaptions>>({})

for (const image of props.images) {
  editableCaptions[image.src] = {
    ...image.captions,
    agentInstructions: image.captions.agentInstructions ?? '',
    selected: 'original'
  }
}

onMounted(() => {
  for (const image of props.images) {
    try {
      const saved = localStorage.getItem(storageKey(image.src))
      if (!saved) continue
      const parsed = JSON.parse(saved) as Partial<StoredCaptions>
      editableCaptions[image.src] = {
        original: parsed.original ?? image.captions.original,
        alternate: parsed.alternate ?? image.captions.alternate,
        custom: parsed.custom ?? image.captions.custom,
        agentInstructions:
          parsed.agentInstructions ?? image.captions.agentInstructions ?? '',
        selected:
          parsed.selected === 'alternate' || parsed.selected === 'custom'
            ? parsed.selected
            : 'original'
      }
    } catch {
      // Ignore invalid local drafts.
    }
  }
})

const activeImage = computed(() => props.images[activeIndex.value])
const activeCaptions = computed(() => editableCaptions[activeImage.value.src])

const captionFields = [
  { key: 'original' as const, label: 'Original', selectable: true },
  { key: 'alternate' as const, label: 'Alternate', selectable: true },
  {
    key: 'custom' as const,
    label: 'Your text',
    selectable: true,
    placeholder: 'Write your caption here…'
  },
  {
    key: 'agentInstructions' as const,
    label: 'Agent Instructions',
    selectable: false,
    placeholder: 'Notes for the agent about this photo…'
  }
]

function persistCaptions(src: string) {
  localStorage.setItem(storageKey(src), JSON.stringify(editableCaptions[src]))
}

function onCaptionInput(
  event: Event,
  key: keyof GalleryCaptions
) {
  const target = event.target as HTMLElement
  editableCaptions[activeImage.value.src][key] = target.innerText.replace(/\n$/, '')
  persistCaptions(activeImage.value.src)
}

function selectCaption(choice: CaptionChoice) {
  editableCaptions[activeImage.value.src].selected = choice
  persistCaptions(activeImage.value.src)
}

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

function isEditingText(target: EventTarget | null) {
  return target instanceof HTMLElement && target.isContentEditable
}

function handleKeydown(event: KeyboardEvent) {
  if (isEditingText(event.target)) return
  if (event.key === 'ArrowRight') next()
  if (event.key === 'ArrowLeft') previous()
  if (event.key === ' ') {
    event.preventDefault()
    isPlaying.value = !isPlaying.value
  }
}

function handleTouchEnd(event: TouchEvent) {
  if (isEditingText(event.target)) return
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
          <div class="gallery__media">
            <NuxtImg
              class="gallery__image"
              :src="activeImage.src"
              :alt="activeImage.alt"
              :style="{ objectPosition: activeImage.position ?? 'center' }"
              width="1600"
              height="1067"
              sizes="(max-width: 760px) 92vw, (max-width: 1200px) 70vw, 880px"
              loading="lazy"
            />

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

          <figcaption class="gallery__caption">
            <span class="eyebrow">{{ activeImage.title }}</span>
            <div
              v-for="field in captionFields"
              :key="`${activeImage.src}-${field.key}`"
              class="gallery__caption-row"
              :class="{
                'is-selected':
                  field.selectable && activeCaptions.selected === field.key,
                'is-instructions': field.key === 'agentInstructions'
              }"
            >
              <div class="gallery__caption-meta">
                <label
                  v-if="field.selectable"
                  class="gallery__caption-choice"
                  :for="`caption-choice-${field.key}`"
                >
                  <input
                    :id="`caption-choice-${field.key}`"
                    type="radio"
                    :name="`caption-choice-${activeImage.src}`"
                    :value="field.key"
                    :checked="activeCaptions.selected === field.key"
                    @change="selectCaption(field.key as CaptionChoice)"
                  >
                  <span>{{ field.label }}</span>
                </label>
                <span
                  v-else
                  class="gallery__caption-label"
                >{{ field.label }}</span>
              </div>
              <div
                class="gallery__caption-text"
                contenteditable="true"
                role="textbox"
                :aria-label="`${field.label} caption`"
                :data-placeholder="field.placeholder || undefined"
                @input="onCaptionInput($event, field.key)"
              >{{ activeCaptions[field.key] }}</div>
            </div>
          </figcaption>
        </figure>
      </Transition>
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
