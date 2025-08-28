import type { HttpContext } from '@adonisjs/core/http'
import ContactSetting from '#models/contact_setting'
import app from '@adonisjs/core/services/app'

export default class ContactSettingsController {

    public async show({ response }: HttpContext) {
        const settings = await ContactSetting.firstOrCreate({}, {})
        return response.ok(settings)
    }

    public async update({ request, response }: HttpContext) {
        const settings = await ContactSetting.firstOrCreate({}, {})

        const data = request.except(['successImage'])

        const imageFile = request.file('successImage', {
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg', 'webp'],
        })
        if (imageFile) {
        const fileName = `contact_success_${Date.now()}.${imageFile.extname}`
        await imageFile.move(app.publicPath('images/contact'), { name: fileName, overwrite: true })
        data.successImage = `images/contact/${fileName}`
        }

        settings.merge(data)
        await settings.save()
        
        return response.ok(settings)
    }
}