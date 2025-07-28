import type { HttpContext } from '@adonisjs/core/http'
import Faq from '#models/faq'

export default class FaqsController {
    public async index({ response }: HttpContext) {
        const faqs = await Faq.query().orderBy('question', 'asc')
        return response.ok(faqs)
    }

    public async store({ request, response }: HttpContext) {
        const data = request.only(['question', 'answer'])
        const faq = await Faq.create(data)
        return response.created(faq)
    }

    public async show({ params, response }: HttpContext) {
        const faq = await Faq.find(params.id)
        if (!faq) {
            return response.notFound({ message: 'FAQ tidak ditemukan' })
        }
        return response.ok(faq)
    }

    public async update({ params, request, response }: HttpContext) {
        const faq = await Faq.find(params.id)
        if (!faq) {
            return response.notFound({ message: 'FAQ tidak ditemukan' })
        }
        const data = request.only(['question', 'answer'])
        faq.merge(data)
        await faq.save()
        return response.ok(faq)
    }

    public async destroy({ params, response }: HttpContext) {
        const faq = await Faq.find(params.id)
        if (!faq) {
            return response.notFound({ message: 'FAQ tidak ditemukan' })
        }
        await faq.delete()
        return response.ok({ message: 'FAQ berhasil dihapus' })
    }
}