<script setup lang="ts">
import { site } from '~/data/site'

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
        <span class="brand__mark" aria-hidden="true">R/T</span>
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
          class="hero__image"
          src="/images/river-at-sunset.jpg"
          alt=""
          width="2000"
          height="1300"
          sizes="100vw"
          preload
        />
        <div class="hero__overlay" />
        <div class="hero__content">
          <p class="eyebrow">A MasterChef story by {{ site.name }}</p>
          <h1 id="hero-title">River<br>to Table</h1>
          <p>{{ site.description }}</p>
          <a class="button button--light" href="#story">Discover the story</a>
        </div>
        <span class="hero__scroll" aria-hidden="true">Scroll to follow the journey ↓</span>
      </section>

      <section id="story" class="section story" aria-labelledby="story-title">
        <div>
          <p class="eyebrow">My philosophy</p>
          <h2 id="story-title">The best meals begin with a story.</h2>
        </div>
        <div class="story__copy">
          <p v-for="paragraph in site.story" :key="paragraph">{{ paragraph }}</p>
        </div>
      </section>

      <section id="gallery" class="section section--gallery" aria-labelledby="gallery-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">The journey</p>
            <h2 id="gallery-title">From patience to plate.</h2>
          </div>
          <p>Use the arrows, swipe, or select a frame to move through the story.</p>
        </div>
        <PhotoGallery :images="site.gallery" />
      </section>

      <section class="section film" aria-labelledby="film-title">
        <div class="film__intro">
          <p class="eyebrow">In motion</p>
          <h2 id="film-title">A few minutes by the water.</h2>
          <p>
            Some stories are best allowed to unfold slowly. This film brings together
            the places, ingredients, and plates that shape my cooking.
          </p>
        </div>
        <StoryVideo />
      </section>

      <section id="about" class="section about" aria-labelledby="about-title">
        <div class="about__number" aria-hidden="true">25+</div>
        <div class="about__copy">
          <p class="eyebrow">Why MasterChef</p>
          <h2 id="about-title">Experience taught me how to build. Cooking taught me why.</h2>
          <p>
            After more than 25 years creating for the web, I am ready to bring that same
            curiosity, calm under pressure, and appetite for learning into the MasterChef
            kitchen.
          </p>
          <blockquote>“{{ site.application }}”</blockquote>
          <a class="button" :href="site.email">Start a conversation</a>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <a class="brand" href="#">
        <span class="brand__mark" aria-hidden="true">R/T</span>
        <span>River to Table</span>
      </a>
      <p>Made with patience by {{ site.name }}.</p>
      <a href="#main">Back to top ↑</a>
    </footer>
  </div>
</template>
