export type CaptionChoice = 'original' | 'alternate' | 'custom'

export type GalleryCaptions = {
  original: string
  alternate: string
  custom: string
  agentInstructions: string
}

export type GalleryImage = {
  src: string
  alt: string
  title: string
  captions: GalleryCaptions
  position?: string
}

export type RefinedImage = {
  src: string
  alt: string
}

export const site = {
  name: 'Henrik Javén',
  title: 'River to Table',
  description:
    'A personal food story shaped by patient days on the river, respect for ingredients, and the pleasure of cooking for others.',
  email: 'mailto:hello@example.com',
  instagram: '',
  story: [
    'For me, cooking begins long before the kitchen. It begins outdoors—with attention, patience, and a deep respect for where every ingredient comes from.',
    'River to Table is my record of that journey: the catch, the craft, and the simple pleasure of turning something carefully gathered into food worth sharing.'
  ],
  application:
    'I am applying to MasterChef to test my instincts, learn at full speed, and show how an honest connection to ingredients can become memorable food.',
  refinedGallery: [
    {
      src: '/images/new-photos/every-piece-refined/00-Columbia-River.JPEG',
      alt: 'A fresh salmon resting in a landing net',
    },
    {
      src: '/images/new-photos/every-piece-refined/1-Spring-Chinook-Salmon.jpeg',
      alt: 'A spring Chinook salmon',
    },
    {
      src: '/images/new-photos/every-piece-refined/3-Ready-to-fillet.jpeg',
      alt: 'A salmon ready to be filleted',
    },
    {
      src: '/images/new-photos/every-piece-refined/5-Perfectly-Smoked.jpg',
      alt: 'A perfectly smoked salmon',
    },
    {
      src: '/images/new-photos/every-piece-refined/55-Smoked-salmon-portions.jpg',
      alt: 'Portions of smoked salmon',
    },
    {
      src: '/images/new-photos/every-piece-refined/6-Scandinavian-Style-Cured-Gravlax.jpeg',
      alt: 'Scandinavian style cured salmon gravlax',
    },
    {
      src: '/images/new-photos/every-piece-refined/9-Fresh-Salmon-Broth-Risotto.jpeg',
      alt: 'Fresh salmon broth risotto',
    },
    {
      src: '/images/new-photos/every-piece-refined/12-Salmon-Crepes-with-crispy-gravlax-skin.JPEG',
      alt: 'Salmon crepes with crispy gravlax skin',
    },
    {
      src: '/images/new-photos/every-piece-refined/7-Hot-Smoked-Salmon-Liver.jpeg',
      alt: 'Hot smoked salmon liver',
    },
    {
      src: '/images/new-photos/every-piece-refined/11-Crispy-skin-tails.jpg',
      alt: 'Crispy salmon skin tails',
    },
    {
      src: '/images/new-photos/every-piece-refined/8-Salmon-Roe.jpg',
      alt: 'Fresh salmon roe',
    },
    {
      src: '/images/new-photos/every-piece-refined/salmon-scraps.JPEG',
      alt: 'Salmon scraps ready to be used',
    },
    {
      src: '/images/new-photos/every-piece-refined/10-Tomato-and-Leek-based-Salmon-Chowder.jpg',
      alt: 'Tomato and leek salmon chowder',
    }
  ] satisfies RefinedImage[]
}
