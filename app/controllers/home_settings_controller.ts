import type { HttpContext } from '@adonisjs/core/http'
import HomeSetting from '#models/home_setting'
import { schema, rules } from '@adonisjs/validator'
import app from '@adonisjs/core/services/app'
import * as fs from 'node:fs/promises'

export default class HomeSettingsController {
  public async index({ response }: HttpContext) {
    const settings = await HomeSetting.all()
    return response.ok(settings)
  }

  public async store({ request, response }: HttpContext) {
    const settingSchema = schema.create({
      settingKey: schema.string([rules.trim(), rules.minLength(3)]),
    })

    try {
      const { settingKey } = await request.validate({ schema: settingSchema })

      const existingSetting = await HomeSetting.findBy('setting_key', settingKey)
      if (existingSetting) {
        return response.badRequest({
          message: 'Setting key sudah digunakan.',
        })
      }
      
      const file = request.file('settingValue', {
        size: '5mb',
        extnames: ['jpg', 'png', 'jpeg', 'svg'],
      })

      let settingValue = request.input('settingValue') as string | null

      if (file) {
        if (!file.isValid) {
          return response.badRequest({ message: file.errors.map((err) => err.message).join(', ') })
        }
        const fileName = file.clientName
        await file.move(app.publicPath('home_assets'), {
          name: fileName,
          overwrite: true,
        })
        settingValue = `home_assets/${fileName}`
      }

      const setting = await HomeSetting.create({
        settingKey: settingKey,
        settingValue: settingValue,
      })

      return response.created(setting)
    } catch (error) {
      console.error('Error saat menyimpan pengaturan:', error)
      if (error.messages) {
        return response.badRequest({
          message: 'Validasi data pengaturan gagal.',
          errors: error.messages,
        })
      }
      return response.internalServerError({
        message: 'Gagal menyimpan pengaturan. Silakan coba lagi nanti.',
        error: error.message || 'Terjadi kesalahan server.',
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    const setting = await HomeSetting.findByOrFail('setting_key', params.settingKey) 
    return response.ok(setting)
  }

  public async update({ request, response }: HttpContext) {
    const validationSchema = schema.create({
        settingKey: schema.string(),
        settingValue: schema.string.optional(),
        settingFile: schema.file.optional({ size: '2mb', extnames: ['jpg', 'png', 'jpeg', 'webp'] })
    })
    
    try {
        const payload = await request.validate({ schema: validationSchema })
        const { settingKey, settingValue, settingFile } = payload

        let valueToStore = settingValue

        if (settingFile) {
            const fileName = `${settingKey}_${Date.now()}.${settingFile.extname}`
            await settingFile.move(app.publicPath('images/settings'), { name: fileName, overwrite: true })
            valueToStore = `images/settings/${fileName}`
        }

        if (valueToStore !== undefined) {
            await HomeSetting.updateOrCreate(
                { settingKey: settingKey },
                { settingValue: valueToStore }
            )
        }

        return response.ok({ message: `Setting ${settingKey} berhasil diperbarui` })

    } catch (error) {
        console.error('Error saat memperbarui pengaturan:', error)
        if (error.messages) {
            return response.badRequest({
                message: 'Validasi data gagal.',
                errors: error.messages,
            })
        }
        return response.internalServerError({
            message: 'Gagal memperbarui pengaturan.',
            error: error.message || 'Terjadi kesalahan server.',
        })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    const setting = await HomeSetting.findByOrFail('setting_key', params.settingKey)
    
    if (setting.settingValue && (setting.settingValue.endsWith('.jpg') || setting.settingValue.endsWith('.png') || setting.settingValue.endsWith('.jpeg') || setting.settingValue.endsWith('.svg'))) {
        const filePath = app.publicPath(setting.settingValue);
        await fs.unlink(filePath).catch(err => console.error('Gagal menghapus file:', err));
    }
    await setting.delete()
    return response.noContent()
  }
}