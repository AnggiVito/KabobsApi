import type { HttpContext } from '@adonisjs/core/http'
import FooterSetting from '#models/footer_setting'
import app from '@adonisjs/core/services/app'

export default class FootersController {
    public async show({ response }: HttpContext) {
        const settings = await FooterSetting.firstOrCreate({}, {})
        return response.ok(settings)
    }

    public async update({ request, response }: HttpContext) {
        const settings = await FooterSetting.firstOrCreate({}, {})
        
        const data = request.except(['logoImage'])

        const imageFile = request.file('logoImage')
        if (imageFile) {
            const fileName = `footer_logo_${Date.now()}.${imageFile.extname}`
            await imageFile.move(app.publicPath('images/footer'), { name: fileName, overwrite: true })
            data.logoImage = `images/footer/${fileName}`
        }
        
        settings.merge(data)
        await settings.save()
        
        return response.ok(settings)
    }
}