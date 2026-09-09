export type GalleryImage = {
  src: string
  alt: string
  title: string
  caption: string
  position?: string
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
      src: '/images/river-at-sunset.jpg',
      alt: 'A dog watching the sunset beneath an arched bridge by the river',
      title: 'Where it begins',
      caption: 'Evenings by the river are part patience, part possibility.'
    },
    {
      src: '/images/cured-salmon.jpg',
      alt: 'Home-cured salmon being sliced beside crispbread',
      title: 'Care in the details',
      caption: 'A simple cure lets the character of the fish stay at the centre.'
    },
    {
      src: '/images/catch-1346.jpg',
      alt: 'Two women smiling from a boat on a mountain lake',
      title: 'On the water',
      caption: 'The day starts with good company and an open horizon.'
    },
    {
      src: '/images/kitchen-2620.jpg',
      alt: 'A kitchen counter covered in home-grown tomatoes and courgettes',
      title: 'A generous harvest',
      caption: 'Cook what is abundant, ripe, and good right now.'
    },
    {
      src: '/images/river-2687.jpg',
      alt: 'A dog relaxing beside a fire on a terrace overlooking the water',
      title: 'At day’s end',
      caption: 'The best days outdoors deserve an unhurried finish.'
    },
    {
      src: '/images/table-3007.jpg',
      alt: 'Friends and a dog enjoying a sunny day in a fishing boat',
      title: 'Shared adventure',
      caption: 'The memories around a meal begin long before the table.'
    },
    {
      src: '/images/catch-3092.jpg',
      alt: 'A flower-decorated campsite and small trailer in the forest',
      title: 'A kitchen anywhere',
      caption: 'Good food can begin in even the smallest kitchen.'
    },
    {
      src: '/images/process-3109.jpg',
      alt: 'Henrik fishing with his dog on a calm forest lake',
      title: 'Patience',
      caption: 'Time on the water teaches attention, calm, and instinct.'
    },
    {
      src: '/images/plating-3164.jpg',
      alt: 'Two whole smoked trout served with lemon and greens',
      title: 'Fire and smoke',
      caption: 'A whole fish, gently smoked, needs very little else.'
    },
    {
      src: '/images/river-3309.jpg',
      alt: 'Henrik holding up a small freshly caught fish on the beach',
      title: 'The catch',
      caption: 'Every catch is a reason to stay curious.'
    },
    {
      src: '/images/kitchen-3343.jpg',
      alt: 'Several freshly caught surfperch arranged on a white plate',
      title: 'From the surf',
      caption: 'Respect for the ingredient starts the moment it leaves the water.'
    },
    {
      src: '/images/table-3348.jpg',
      alt: 'Fishing rods and a landing net at the bow of a boat on calm water',
      title: 'Ready',
      caption: 'Preparation makes room for the unexpected.'
    },
    {
      src: '/images/dish-3401.jpg',
      alt: 'Fresh trout and a large salmon fillet prepared on a kitchen counter',
      title: 'The ingredient',
      caption: 'Handle it carefully and let quality lead the way.'
    },
    {
      src: '/images/dish-3421.jpg',
      alt: 'Sunset reflected in the water behind a fishing boat',
      title: 'Return',
      caption: 'Another day on the water, another story to bring home.'
    },
    {
      src: '/images/dish-3428.jpg',
      alt: 'Homemade salmon roe on crispbread with cream cheese and dill',
      title: 'Nothing wasted',
      caption: 'A simple bite that honours every part of the catch.'
    }
  ] satisfies GalleryImage[]
}
