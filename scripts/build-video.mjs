import { mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import ffmpegPath from 'ffmpeg-static'

const images = [
  'river-at-sunset.jpg',
  'catch-1346.jpg',
  'table-3007.jpg',
  'process-3109.jpg',
  'river-3309.jpg',
  'kitchen-3343.jpg',
  'table-3348.jpg',
  'dish-3401.jpg',
  'plating-3164.jpg',
  'cured-salmon.jpg',
  'dish-3428.jpg',
  'dish-3421.jpg'
]

const secondsPerImage = 3.5
const transitionSeconds = 0.8
const inputArgs = images.flatMap((image) => [
  '-loop',
  '1',
  '-t',
  String(secondsPerImage),
  '-i',
  `public/images/${image}`
])

const filters = images.map((_, index) => {
  const direction = index % 2 === 0 ? 'zoom+0.00045' : '1.08-0.00045*on'
  return [
    `[${index}:v]`,
    'scale=1400:800:force_original_aspect_ratio=increase,',
    'crop=1280:720,',
    `zoompan=z='${direction}':`,
    "x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=30,",
    `trim=duration=${secondsPerImage},setpts=PTS-STARTPTS,setsar=1[v${index}]`
  ].join('')
})

let previous = 'v0'
for (let index = 1; index < images.length; index += 1) {
  const output = index === images.length - 1 ? 'video' : `x${index}`
  const offset = (secondsPerImage - transitionSeconds) * index
  filters.push(
    `[${previous}][v${index}]xfade=transition=fade:duration=${transitionSeconds}:offset=${offset.toFixed(1)}[${output}]`
  )
  previous = output
}

mkdirSync('public/video', { recursive: true })

const result = spawnSync(
  ffmpegPath,
  [
    '-y',
    ...inputArgs,
    '-filter_complex',
    filters.join(';'),
    '-map',
    '[video]',
    '-an',
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '24',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    'public/video/river-to-table.mp4'
  ],
  { stdio: 'inherit' }
)

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}
