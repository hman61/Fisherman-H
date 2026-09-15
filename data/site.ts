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
  name: 'Henrik Javen',
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
  gallery: [
    {
      src: '/images/video-poster.jpg',
      alt: 'River to table story preview',
      title: 'River to table',
      captions: {
        original: 'A patient journey from the river to the table.',
        alternate: 'The river, the catch, and the cooking that follows.',
        custom: '',
        agentInstructions: ''
      }
    },
    {
      src: '/images/river-at-sunset.jpg',
      alt: 'A dog watching the sunset beneath an arched bridge by the river',
      title: 'Where it begins',
      captions: {
        original: 'Evenings by the river are part patience, part possibility.',
        alternate: 'Sunset under the bridge — a familiar stop after a day on the water.',
        custom: '',
        agentInstructions: ''
      }
    },
    {
      src: '/images/cured-salmon.jpg',
      alt: 'Home-cured salmon being sliced beside crispbread',
      title: 'Care in the details',
      captions: {
        original: 'A simple cure lets the character of the fish stay at the centre.',
        alternate: 'Home-cured salmon with dill, salt, and crispbread.',
        custom: '',
        agentInstructions: ''
      }
    },
    {
      src: '/images/catch-1346.jpg',
      alt: 'Two women smiling from a boat on a mountain lake',
      title: 'On the water',
      captions: {
        original: 'The day starts with good company and an open horizon.',
        alternate: 'Out on the lake with the landing net ready.',
        custom: '',
        agentInstructions: ''
      }
    },
    {
      src: '/images/kitchen-2620.jpg',
      alt: 'A kitchen counter covered in home-grown tomatoes and courgettes',
      title: 'A generous harvest',
      captions: {
        original: 'Cook what is abundant, ripe, and good right now.',
        alternate: 'Tomatoes and squash from our Pacific Northwest garden.',
        custom: '',
        agentInstructions: ''
      }
    },
    {
      src: '/images/river-2687.jpg',
      alt: 'A dog relaxing beside a fire on a terrace overlooking the water',
      title: 'At day’s end',
      captions: {
        original: 'The best days outdoors deserve an unhurried finish.',
        alternate: 'Deck overlooking the water at dusk.',
        custom: '',
        agentInstructions: ''
      }
    },
    {
      src: '/images/table-3007.jpg',
      alt: 'Friends and a dog enjoying a sunny day in a fishing boat',
      title: 'Shared adventure',
      captions: {
        original: 'The memories around a meal begin long before the table.',
        alternate: 'Fishing day with family — rod, cooler, and dog on board.',
        custom: '',
        agentInstructions: ''
      }
    },
    {
      src: '/images/catch-3092.jpg',
      alt: 'A flower-decorated campsite and small trailer in the forest',
      title: 'A kitchen anywhere',
      captions: {
        original: 'Good food can begin in even the smallest kitchen.',
        alternate: 'Camp kitchen in the woods — cooking wherever we park.',
        custom: '',
        agentInstructions: ''
      }
    },
    {
      src: '/images/process-3109.jpg',
      alt: 'Henrik fishing with his dog on a calm forest lake',
      title: 'Patience',
      captions: {
        original: 'Time on the water teaches attention, calm, and instinct.',
        alternate: 'Casting on a forest lake with my fishing partner.',
        custom: '',
        agentInstructions: ''
      }
    },
    {
      src: '/images/plating-3164.jpg',
      alt: 'Two whole smoked trout served with lemon and greens',
      title: 'Fire and smoke',
      captions: {
        original: 'A whole fish, gently smoked, needs very little else.',
        alternate: 'Whole smoked trout with lemon and scallions.',
        custom: '',
        agentInstructions: ''
      }
    },
    {
      src: '/images/river-3309.jpg',
      alt: 'Henrik holding up a small freshly caught fish on the beach',
      title: 'The catch',
      captions: {
        original: 'Every catch is a reason to stay curious.',
        alternate: 'Fresh catch from the surf, still on the line.',
        custom: '',
        agentInstructions: ''
      }
    },
    {
      src: '/images/kitchen-3343.jpg',
      alt: 'Several freshly caught surfperch arranged on a white plate',
      title: 'From the surf',
      captions: {
        original: 'Respect for the ingredient starts the moment it leaves the water.',
        alternate: 'Cleaned surfperch, ready for the pan.',
        custom: '',
        agentInstructions: ''
      }
    },
    {
      src: '/images/table-3348.jpg',
      alt: 'Fishing rods and a landing net at the bow of a boat on calm water',
      title: 'Ready',
      captions: {
        original: 'Preparation makes room for the unexpected.',
        alternate: 'Net and rods at the bow on a calm morning.',
        custom: '',
        agentInstructions: ''
      }
    },
    {
      src: '/images/dish-3401.jpg',
      alt: 'Fresh trout and a large salmon fillet prepared on a kitchen counter',
      title: 'The ingredient',
      captions: {
        original: 'Handle it carefully and let quality lead the way.',
        alternate: 'Trout and salmon fillet — most of what I cook, I catch.',
        custom: '',
        agentInstructions: ''
      }
    },
    {
      src: '/images/dish-3421.jpg',
      alt: 'Sunset reflected in the water behind a fishing boat',
      title: 'Return',
      captions: {
        original: 'Another day on the water, another story to bring home.',
        alternate: 'Heading in as the sun drops behind the hills.',
        custom: '',
        agentInstructions: ''
      }
    },
  ] satisfies GalleryImage[],
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
      src: '/images/new-photos/every-piece-refined/2-Columbia-River-Catch.jpeg',
      alt: 'A Columbia River catch',
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
      src: '/images/new-photos/every-piece-refined/6-Scandinavian-Cured-Gravlax.jpeg',
      alt: 'Scandinavian cured salmon gravlax',
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
      src: '/images/new-photos/every-piece-refined/11-Crispy-skinn-tails.jpg',
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
