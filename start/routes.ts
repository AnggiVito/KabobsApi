/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { readFile } from 'node:fs/promises'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'

const FaqsController = () => import('#controllers/faqs_controller')
const PromosController = () => import('#controllers/promos_controller')
const ContactsController = () => import('#controllers/contacs_controller')
const KariersController = () => import('#controllers/kariers_controller')
const MenusController = () => import('#controllers/menus_controller')
const LocationsController = () => import('#controllers/locations_controller')
const SubmissionsController = () => import('#controllers/submissions_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Promo
router.get('promos', [PromosController, 'index']) 
router.post('promos', [PromosController, 'store'])
router.get('promos/:id', [PromosController, 'show'])
router.put('promos/:id', [PromosController, 'update'])
router.delete('promos/:id', [PromosController, 'destroy'])

// FAQ
router.get('faqs', [FaqsController, 'index'])
router.post('faqs', [FaqsController, 'store'])
router.get('faqs/:id', [FaqsController, 'show'])
router.put('faqs/:id', [FaqsController, 'update'])
router.delete('faqs/:id', [FaqsController, 'destroy'])

// Contact Us
router.get('contacts', [ContactsController, 'index'])
router.post('contacts', [ContactsController, 'store'])
router.get('contacts/:id', [ContactsController, 'show'])
router.delete('contacts/:id', [ContactsController, 'destroy'])

// Karier
router.get('kariers', [KariersController, 'index'])
router.get('kariers/:id', [KariersController, 'show'])
router.post('kariers', [KariersController, 'store'])
router.put('kariers/:id', [KariersController, 'update'])
router.delete('kariers/:id', [KariersController, 'destroy'])

// Menu
router.get('menus', [MenusController, 'index'])
router.post('menus', [MenusController, 'store'])
router.get('menus/:id', [MenusController, 'show'])
router.put('menus/:id', [MenusController, 'update'])
router.delete('menus/:id', [MenusController, 'destroy'])

// Lokasi
router.get('locations', [LocationsController, 'index'])
router.post('locations', [LocationsController, 'store'])
router.get('locations/:id', [LocationsController, 'show'])
router.put('locations/:id', [LocationsController, 'update'])
router.delete('locations/:id', [LocationsController, 'destroy'])

// Subbmission
router.get('submissions', [SubmissionsController, 'index'])
router.post('submissions', [SubmissionsController, 'store'])
router.get('submissions/:id', [SubmissionsController, 'show'])
router.put('submissions/:id', [SubmissionsController, 'update'])
router.delete('submissions/:id', [SubmissionsController, 'destroy'])

// Gambar
router.get('/images/:filename', async ({ response, params }) => {
  try {
    const filePath = app.makePath(`public/images/${params.filename}`)
    const file = await readFile(filePath)
    return response.type(getMimeType(params.filename)).send(file)
  } catch {
    return response.notFound('Image not found')
  }
})

function getMimeType(filename: string) {
  const ext = filename.split('.').pop()
  if (ext === 'png') return 'image/png'
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
  return 'application/octet-stream'
}
