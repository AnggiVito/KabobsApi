import type { HttpContext } from '@adonisjs/core/http'
import Karier from '#models/karier'
import { schema, rules } from '@adonisjs/validator'

export default class KariersController {
    public async index({ request, response }: HttpContext) {
        const { lokasi, posisi, keyword } = request.qs()

        let query = Karier.query()

        if (lokasi && lokasi !== 'Semua Lokasi') {
            query = query.where('lokasi', 'LIKE', `%${lokasi}%`)
        }

        if (posisi && posisi !== 'Semua Posisi') {
            query = query.where('jenis', 'LIKE', `%${posisi}%`).orWhere('nama', 'LIKE', `%${posisi}%`)
        }

        if (keyword) {
            query = query.where((subQuery) => {
                subQuery.where('nama', 'LIKE', `%${keyword}%`)
                .orWhere('lokasi', 'LIKE', `%${keyword}%`)
                .orWhere('keahlian', 'LIKE', `%${keyword}%`)
                .orWhere('jenis', 'LIKE', `%${keyword}%`)
            })
        }

        const kariers = await query.orderBy('created_at', 'desc')
        return response.ok(kariers)
    }

    public async store({ request, response }: HttpContext) {
        const karierSchema = schema.create({
                nama: schema.string([rules.trim(), rules.minLength(3)]),
                jenis: schema.string([rules.trim(), rules.minLength(2)]),
                lokasi: schema.string([rules.trim(), rules.minLength(3)]),
                keahlian: schema.string([rules.trim(), rules.minLength(10)]),
            })

        try {
            const payload = await request.validate({ schema: karierSchema })
            const karier = await Karier.create(payload)
            return response.created({
                message: 'Posisi karier berhasil ditambahkan!',
                data: karier.serialize(),
            })
        } catch (error) {
            console.error('Error saat menyimpan posisi karier:', error)
            if (error.messages) {
                return response.badRequest({
                    message: 'Data posisi tidak valid.',
                    errors: error.messages,
                })
            }
            return response.internalServerError({
                message: 'Gagal menyimpan posisi karier. Silakan coba lagi nanti.',
                error: error.message,
            })
        }
    }

    public async show({ params, response }: HttpContext) {
        const karier = await Karier.find(params.id)
        if (!karier) {
            return response.notFound({ message: 'Posisi karier tidak ditemukan' })
        }
        return response.ok(karier)
    }

    public async update({ params, request, response }: HttpContext) {
        const karier = await Karier.find(params.id)
        if (!karier) {
            return response.notFound({ message: 'Posisi karier tidak ditemukan' })
        }

        const karierSchema = schema.create({
            nama: schema.string.optional([rules.trim(), rules.minLength(3)]),
            jenis: schema.string.optional([rules.trim(), rules.minLength(2)]),
            lokasi: schema.string.optional([rules.trim(), rules.minLength(3)]),
            keahlian: schema.string.optional([rules.trim(), rules.minLength(10)]),
        })

        try {
            const payload = await request.validate({ schema: karierSchema })
            karier.merge(payload)
            await karier.save()
            return response.ok({
                message: 'Posisi karier berhasil diperbarui!',
                data: karier.serialize(),
            })
        } catch (error) {
            console.error('Error saat memperbarui posisi karier:', error)
            if (error.messages) {
                return response.badRequest({
                    message: 'Data posisi tidak valid.',
                    errors: error.messages,
                })
            }
            return response.internalServerError({
                message: 'Gagal memperbarui posisi karier. Silakan coba lagi nanti.',
                error: error.message,
            })
        }
    }

    public async destroy({ params, response }: HttpContext) {
        const karier = await Karier.find(params.id)
        if (!karier) {
            return response.notFound({ message: 'Posisi karier tidak ditemukan' })
        }
        await karier.delete()
        return response.noContent()
    }
}