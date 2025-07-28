import type { HttpContext } from '@adonisjs/core/http'
import Contact from '#models/contact'
import { schema, rules } from '@adonisjs/validator'

export default class ContactsController {
    public async store({ request, response }: HttpContext) {
        const contactMessageSchema = schema.create({
            firstName: schema.string([rules.trim(), rules.minLength(2)]),
            lastName: schema.string([rules.trim(), rules.minLength(2)]),
            email: schema.string([rules.email(), rules.trim()]),
            phone: schema.string([rules.trim(), rules.minLength(8)]),
            category: schema.enum(['umum', 'komplain', 'saran']),
            message: schema.string([rules.trim(), rules.minLength(10)]),
        })

        try {
            const payload = await request.validate({ schema: contactMessageSchema })
            const contactMessage = await Contact.create(payload)

            return response.created({
                message: 'Pesan kontak berhasil dikirim!',
                data: contactMessage.serialize(),
            })
        } catch (error) {
            console.error('Error saat menyimpan pesan kontak:', error)
            if (error.messages) {
                return response.badRequest({
                    message: 'Data formulir tidak valid.',
                    errors: error.messages,
                })
            }
            return response.internalServerError({
                message: 'Gagal menyimpan pesan kontak. Silakan coba lagi nanti.',
                error: error.message,
            })
        }
    }

    public async index({ response }: HttpContext) {
        const messages = await Contact.all()
        return response.ok(messages)
    }

    public async show({ params, response }: HttpContext) {
        const message = await Contact.find(params.id)
        if (!message) {
            return response.notFound({ message: 'Pesan kontak tidak ditemukan' })
        }
        return response.ok(message)
    }

    public async destroy({ params, response }: HttpContext) {
        const message = await Contact.find(params.id)
        if (!message) {
            return response.notFound({ message: 'Pesan kontak tidak ditemukan' })
        }
        await message.delete()
        return response.noContent()
    }
}