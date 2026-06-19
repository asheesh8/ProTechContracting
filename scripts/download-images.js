import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const imagesDir = path.join(__dirname, '..', 'public', 'images')

if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true })

const images = [
  {
    url: 'https://protechcontractingvt.com/wp-content/uploads/2018/03/renovations-e1520370037254-300x200.jpg',
    name: 'renovations.jpg',
  },
  {
    url: 'https://protechcontractingvt.com/wp-content/uploads/2018/03/home-restorations-300x225.jpg',
    name: 'home-restorations.jpg',
  },
  {
    url: 'https://protechcontractingvt.com/wp-content/uploads/2018/03/additions-300x200.jpg',
    name: 'additions.jpg',
  },
  {
    url: 'https://protechcontractingvt.com/wp-content/uploads/bb-plugin/cache/painting_00007-landscape-5f4990d1b204eef7f4922e90929b9b93-.jpg',
    name: 'painting.jpg',
  },
  {
    url: 'https://protechcontractingvt.com/wp-content/uploads/2020/05/decks_00003.jpg',
    name: 'decks.jpg',
  },
  {
    url: 'https://protechcontractingvt.com/wp-content/uploads/2020/05/siding_00003.jpg',
    name: 'siding.jpg',
  },
  {
    url: 'https://protechcontractingvt.com/wp-content/uploads/2018/03/flooring-installation-and-repair-300x199.jpg',
    name: 'flooring.jpg',
  },
  {
    url: 'https://protechcontractingvt.com/wp-content/uploads/2018/03/room-ready-for-drywall-from-wikimedia-300x200.jpg',
    name: 'drywall.jpg',
  },
  {
    url: 'https://protechcontractingvt.com/wp-content/uploads/2018/03/concrete-and-steel-demolition-debris-300x169.jpg',
    name: 'demolition.jpg',
  },
  {
    url: 'https://protechcontractingvt.com/wp-content/uploads/bb-plugin/cache/brown-house-1814x1300-portrait-d6b3ae61cfc2cee2b1b34c26e6ba267e-5758c868f0fae.jpg',
    name: 'brown-house.jpg',
  },
]

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    const protocol = url.startsWith('https') ? https : http

    const request = (targetUrl) => {
      protocol.get(targetUrl, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          request(response.headers.location)
          return
        }
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode} for ${targetUrl}`))
          return
        }
        response.pipe(file)
        file.on('finish', () => { file.close(); resolve() })
      }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err) })
    }

    request(url)
  })
}

async function main() {
  console.log(`Downloading ${images.length} images to ${imagesDir}...\n`)
  for (const img of images) {
    const dest = path.join(imagesDir, img.name)
    if (fs.existsSync(dest)) {
      console.log(`  ✓ ${img.name} (already exists)`)
      continue
    }
    try {
      await download(img.url, dest)
      console.log(`  ✓ ${img.name}`)
    } catch (err) {
      console.error(`  ✗ ${img.name}: ${err.message}`)
    }
  }
  console.log('\nDone.')
}

main()
