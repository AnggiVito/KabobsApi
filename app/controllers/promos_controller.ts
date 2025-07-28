import type { HttpContext } from '@adonisjs/core/http'
import Promo from '#models/promo'
import { cuid } from '@adonisjs/core/helpers'

export default class PromosController {
    public async index({ response }: HttpContext) {
        const promos = await Promo.all()
        return response.ok(promos)
    }

    public async store({ request, response }: HttpContext) {
        try {
            const imageFile = request.file('image', {
                size: '2mb',
                extnames: ['jpg', 'png', 'jpeg'],
            })

            if (!imageFile) {
                return response.badRequest({ message: 'Image is required' })
            }

            await imageFile.move('public/images', {
                name: imageFile.clientName,
                overwrite: true,
            })

            const promo = await Promo.create({
                title: request.input('title'),
                description: request.input('description'),
                expired: request.input('expired'),
                image: `images/${imageFile.clientName}`,
            })

            return response.created(promo)
        } catch (err) {
            console.error(err)
            return response.status(500).send({
                message: 'Gagal menyimpan promo',
                error: err.message,
            })
        }
    }


    public async show({ params, response }: HttpContext) {
        const promo = await Promo.find(params.id)
        if (!promo) return response.notFound({ message: 'Promo not found' })
        return response.ok(promo)
    }

    public async update({ params, request, response }: HttpContext) {
        const promo = await Promo.find(params.id)
        if (!promo) return response.notFound({ message: 'Promo not found' })

        const data = request.only(['title', 'description', 'expired']) as {
            title: any
            description: any
            expired: any
            image?: string
        }

        const imageFile = request.file('image', {
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg'],
        })

        if (imageFile) {
            const fileName = `${cuid()}.${imageFile.extname}`
            await imageFile.move('public/images', {
                name: fileName,
                overwrite: true,
            })
            data.image = `images/${fileName}`
        }

        promo.merge(data)
        await promo.save()

        return response.ok(promo)
    }

    public async destroy({ params, response }: HttpContext) {
        const promo = await Promo.find(params.id)
        if (!promo) return response.notFound({ message: 'Promo not found' })

        await promo.delete()
        return response.noContent()
    }
}
