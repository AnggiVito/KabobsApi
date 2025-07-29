import type { HttpContext } from '@adonisjs/core/http'
import Karier from '#models/karier'
import { schema, rules } from '@adonisjs/validator'

export default class KariersController {
    public async index({ request, response }: HttpContext) {
        const { lokasi, posisi, keyword } = request.qs()

        let query = Karier.query()

        if (lokasi && lokasi !== 'Semua Lokasi') {
            query = query.where('kota', 'LIKE', `%${lokasi}%`)
        }

        if (posisi && posisi !== 'Semua Posisi') {
            query = query.where('worktype', 'LIKE', `%${posisi}%`).orWhere('namaposisi', 'LIKE', `%${posisi}%`)
        }

        if (keyword) {
            query = query.where((subQuery) => {
                subQuery.where('namaposisi', 'LIKE', `%${keyword}%`)
                .orWhere('kota', 'LIKE', `%${keyword}%`)
                .orWhere('provinsi', 'LIKE', `%${keyword}%`)
                .orWhere('job_summary', 'LIKE', `%${keyword}%`)
                .orWhere('worktype', 'LIKE', `%${keyword}%`)
                .orWhere('deskripsi', 'LIKE', `%${keyword}%`)
                .orWhere('job_requirement', 'LIKE', `%${keyword}%`)
            })
        }

        const kariers = await query.orderBy('db_created_at', 'desc')
        return response.ok(kariers)
    }

    public async store({ request, response }: HttpContext) {
        const karierSchema = schema.create({
            posting: schema.date({ format: 'iso' }),
            namaposisi: schema.string([rules.trim(), rules.minLength(3)]),
            kota: schema.string([rules.trim(), rules.minLength(3)]),
            provinsi: schema.string([rules.trim(), rules.minLength(2)]),
            workplace: schema.string([rules.trim()]),
            worktype: schema.string([rules.trim()]),
            paytype: schema.string([rules.trim()]),
            payrangeFrom: schema.number.nullableAndOptional(),
            payrangeTo: schema.number.nullableAndOptional(),
            deskripsi: schema.string([rules.trim(), rules.minLength(10)]),
            job_summary: schema.string([rules.trim(), rules.minLength(10)]),
            job_requirement: schema.string([rules.trim(), rules.minLength(10)]),
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
                error: error.message || 'Terjadi kesalahan server.',
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

        const updateSchema = schema.create({
            posting: schema.date.optional(),
            namaposisi: schema.string.optional([rules.trim(), rules.minLength(3)]),
            kota: schema.string.optional([rules.trim(), rules.minLength(3)]),
            provinsi: schema.string.optional([rules.trim(), rules.minLength(2)]),
            workplace: schema.string.optional([rules.trim()]),
            worktype: schema.string.optional([rules.trim()]),
            paytype: schema.string.optional([rules.trim()]),
            payrangeFrom: schema.number.nullableAndOptional(),
            payrangeTo: schema.number.nullableAndOptional(),
            deskripsi: schema.string.optional([rules.trim(), rules.minLength(10)]),
            jobSummary: schema.string.optional([rules.trim(), rules.minLength(10)]),
            jobRequirement: schema.string.optional([rules.trim(), rules.minLength(10)]),
        })

        try {
            const payload = await request.validate({ schema: updateSchema })
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
                error: error.message || 'Terjadi kesalahan server.',
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