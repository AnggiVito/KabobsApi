import type { HttpContext } from '@adonisjs/core/http'
import TentangKami from '#models/tentang_kami'
import app from '@adonisjs/core/services/app'

export default class TentangKamiController {
    public async show({ response }: HttpContext) {
        const settings = await TentangKami.firstOrCreate({}, {})
        return response.ok(settings)
    }

    public async update({ request, response }: HttpContext) {
        const settings = await TentangKami.firstOrCreate({}, {})

        const data = request.except(['imgUtamaSrc', 'imgSosmed1Src'])

        const imageUtamaFile = request.file('imgUtamaSrc', {
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg', 'webp'],
        })
        if (imageUtamaFile) {
            const fileName = `tentang_utama_${Date.now()}.${imageUtamaFile.extname}`
            await imageUtamaFile.move(app.publicPath('images/about'), { name: fileName, overwrite: true })
            data.imgUtamaSrc = `images/about/${fileName}`
        }

        const imageSosmedFile = request.file('imgSosmed1Src', {
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg', 'webp'],
        })
        if (imageSosmedFile) {
            const fileName = `tentang_sosmed_${Date.now()}.${imageSosmedFile.extname}`
            await imageSosmedFile.move(app.publicPath('images/about'), { name: fileName, overwrite: true })
            data.imgSosmed1Src = `images/about/${fileName}`
        }

        settings.merge(data)
        await settings.save()
        
        return response.ok(settings)
    }
}