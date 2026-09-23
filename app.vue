<script setup lang="ts">
import { site } from '~/data/site'
import { landscapePhotos, portraitPhotos } from '~/data/photo-wall'

const canonicalUrl = 'https://example.netlify.app'

useSeoMeta({
  title: `${site.name} — ${site.title}`,
  description: site.description,
  ogTitle: `${site.name} — ${site.title}`,
  ogDescription: site.description,
  ogImage: `${canonicalUrl}/images/social-preview.jpg`,
  ogType: 'website',
  ogUrl: canonicalUrl,
  twitterCard: 'summary_large_image'
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        name: `${site.name} — ${site.title}`,
        description: site.description,
        mainEntity: {
          '@type': 'Person',
          name: site.name,
          knowsAbout: ['Cooking', 'Fishing', 'River-to-table food']
        }
      })
    }
  ]
})
</script>

<template>
  <div>
    <a class="skip-link" href="#main">Skip to content</a>

    <header class="site-header">
      <a class="brand" href="#" aria-label="River to Table, home">
        <span class="brand__mark" aria-hidden="true" style="background-image: url('/favicon.jpeg');background-size: 130%;background-position: center;"></span>
        <span>River to Table</span>
      </a>
      <nav aria-label="Main navigation">
        <a href="#story">Story</a>
        <a href="#gallery">Gallery</a>
        <a href="#about">About</a>
      </nav>
    </header>

    <main id="main">
      <section class="hero" aria-labelledby="hero-title">
        <NuxtImg
          class="hero__portrait"
          src="/images/Fisherman-H.jpg"
          alt="Fisherman H"
          width="1461"
          height="2411"
          sizes="(max-width: 760px) 68vw, 30vw"
          preload
        />
        <div class="hero__content">
          <p class="eyebrow">A story by Fisherman-H</p>
          <h1 id="hero-title">River<br>to Table</h1>
          <p>{{ site.description }}</p>
          <a class="button button--light" href="#story">Discover the story</a>
        </div>
        <span class="hero__scroll" aria-hidden="true">Scroll to follow the journey ↓</span>
      </section>

      <section id="story" class="section story" style="background-color: var(--cream);" aria-labelledby="story-title">
        <div>
          <p class="eyebrow">My philosophy</p>
          <h2 id="story-title" style="font-size: clamp(3rem, 5vw, 6.5rem)">The best meals begin with a story.</h2>
        </div>
        <div class="story__copy">
          <p v-for="paragraph in site.story" :key="paragraph">{{ paragraph }}</p>
        </div>
      </section>

      <!-- <section id="gallery" class="section section--gallery" aria-labelledby="gallery-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">The journey</p>
            <h2 id="gallery-title">From patience to plate.</h2>
          </div>
          <p>Use the arrows, swipe, or select a frame to move through the story.</p>
        </div>
        <PhotoGallery :images="site.gallery" />
      </section> -->

      <section id="gallery" class="section section--refined" aria-labelledby="refined-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">The Journey, where nothing goes to waste</p>
            <h2 id="refined-title">Catch, Refine, Cook and Enjoy</h2>
          </div>
        </div>
        <RefinedGallery :images="site.refinedGallery" />
      </section>
<section id="album1" class="section" aria-labelledby="album-1"><video width="100%" height="auto" controls loop muted playsinline>
  <source src="https://fisherman-h.netlify.app/video/Dishes-by-H.m4v" type="video/mp4">
  Your browser does not support the video tag.
</video></section>
      <section class="section section--photo-wall" aria-labelledby="photo-wall-title">

  
        <PhotoWall :portrait="portraitPhotos" :landscape="landscapePhotos" />
      </section>

      <section id="about" class="section about" aria-labelledby="about-title">
        <div class="about__number" style="font-size: clamp(2rem, 5vw, 4rem);" aria-hidden="true">Åland Islands meets Pacific Northwest</div>
        <div class="about__copy">
          <p class="eyebrow">Why MasterChef</p>
<h2 id="about-title">Experience taught me how to build. Cooking taught me why.</h2>
<p>
  After years of navigating tech stacks and culinary scenes from the Åland Islands to LA and the Pacific Northwest, I know how to perform under pressure. Software engineering gave me the structure, but cooking gives me the purpose and the passion. I’m bringing that curiosity and appetite for growth directly to the MasterChef kitchen.
</p>          <blockquote>“{{ site.application }}”</blockquote>
          <a class="button" :href="site.email">Start a conversation</a>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <a class="brand" href="#">
        <span class="brand__mark" aria-hidden="true" style="background-image: url('/favicon.jpeg');background-size: 130%;background-position: center;"></span>
        <span>River to Table</span>
      </a>
      <p>Made with patience by {{ site.name }}.</p>
      <a href="#main">Back to top ↑</a>
    </footer>
  </div>
</template>
