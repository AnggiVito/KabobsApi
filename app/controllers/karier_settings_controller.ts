import type { HttpContext } from '@adonisjs/core/http'
import KarierSetting from '#models/karier_setting'
import app from '@adonisjs/core/services/app'

export default class KarierSettingsController {
    public async show({ response }: HttpContext) {
        const settings = await KarierSetting.firstOrCreate({}, {})
        return response.ok(settings)
    }

    public async update({ request, response }: HttpContext) {
        const settings = await KarierSetting.firstOrCreate({}, {})

        const data = request.except(['headerImage'])

        const imageFile = request.file('headerImage', {
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg', 'webp'],
        })
        if (imageFile) {
        const fileName = `karier_header_${Date.now()}.${imageFile.extname}`
        await imageFile.move(app.publicPath('images/karier'), { name: fileName, overwrite: true })
        data.headerImage = `images/karier/${fileName}`
        }

        settings.merge(data)
        await settings.save()
        
        return response.ok(settings)
    }
}