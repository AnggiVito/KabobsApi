import type { HttpContext } from '@adonisjs/core/http'
import OrderSetting from '#models/order_setting'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'

export default class OrderSettingsController {
    public async show({ response }: HttpContext) {
        const settings = await OrderSetting.firstOrCreate({}, {})
        return response.ok(settings)
    }

    public async update({ request, response }: HttpContext) {
        const settings = await OrderSetting.firstOrCreate({}, {})
        
        const data = request.except(['headerImage', 'order_options'])

        const headerImageFile = request.file('headerImage')
        if (headerImageFile) {
        const fileName = `order_header_${cuid()}.${headerImageFile.extname}`
        await headerImageFile.move(app.publicPath('uploads/order'), { name: fileName, overwrite: true })
        data.headerImage = `uploads/order/${fileName}`
        }

        const processedOptions = []
        const rawOptions = request.input('order_options', [])

        for (let i = 0; i < 4; i++) {
        const optionData = rawOptions[i]
        const optionImageFile = request.file(`order_options.${i}.image`)

        if (optionData && optionData.name && optionData.url) {
            const newOption: { name: string; url: string; image?: string } = {
            name: optionData.name,
            url: optionData.url,
            }

            if (optionImageFile) {
                const fileName = `option_${cuid()}.${optionImageFile.extname}`
                await optionImageFile.move(app.publicPath('uploads/order/options'), { name: fileName, overwrite: true })
                newOption.image = `uploads/order/options/${fileName}`
            } else if (settings.orderOptions && Array.isArray(settings.orderOptions) && settings.orderOptions[i] && settings.orderOptions[i].image) {
                newOption.image = settings.orderOptions[i].image
            }
            
            processedOptions.push(newOption)
        }
        }

        settings.merge(data)
        if (processedOptions.length >= 0) {
        settings.orderOptions = processedOptions
        }
        
        await settings.save()

        return response.ok(settings)
    }
}