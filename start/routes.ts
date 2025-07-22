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

const PromosController = () => import('#controllers/promos_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('promos', [PromosController, 'index']) 
router.post('promos', [PromosController, 'store'])
router.get('promos/:id', [PromosController, 'show'])
router.put('promos/:id', [PromosController, 'update'])
router.delete('promos/:id', [PromosController, 'destroy'])

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
