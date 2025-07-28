import type { HttpContext } from '@adonisjs/core/http'
import Location from '#models/location'
import { schema, rules } from '@adonisjs/validator'

export default class LocationsController {
    public async index({ request, response }: HttpContext) {
        const searchKeyword = request.input('search');

        let query = Location.query();

        if (searchKeyword) {
            query = query.where((subQuery) => {
                subQuery.where('name', 'LIKE', `%${searchKeyword}%`)
                        .orWhere('address', 'LIKE', `%${searchKeyword}%`)
                        .orWhere('region_name', 'LIKE', `%${searchKeyword}%`);
            });
        }

        const locations = await query.orderBy('region_name', 'asc').orderBy('name', 'asc');
        return response.ok(locations);
    }

    public async store({ request, response }: HttpContext) {
        const locationSchema = schema.create({
            name: schema.string([rules.trim(), rules.minLength(3)]),
            address: schema.string([rules.trim(), rules.minLength(10)]),
            mapUrl: schema.string([rules.url()]),
            regionName: schema.string([rules.trim(), rules.minLength(2)]),
            lat: schema.number.nullableAndOptional(),
            lng: schema.number.nullableAndOptional(),
        });

        try {
            const payload = await request.validate({ schema: locationSchema });
            const location = await Location.create(payload);
            return response.created({
                message: 'Lokasi berhasil ditambahkan!',
                data: location.serialize(),
            });
        } catch (error) {
            console.error('Error saat menyimpan lokasi:', error);
            if (error.messages) {
                return response.badRequest({
                    message: 'Data lokasi tidak valid.',
                    errors: error.messages,
                });
            }
            return response.internalServerError({
                message: 'Gagal menyimpan lokasi. Silakan coba lagi nanti.',
                error: error.message,
            });
        }
    }

    public async show({ params, response }: HttpContext) {
        const location = await Location.find(params.id);
        if (!location) {
            return response.notFound({ message: 'Lokasi tidak ditemukan' });
        }
        return response.ok(location);
    }

    public async update({ params, request, response }: HttpContext) {
        const location = await Location.find(params.id);
        if (!location) {
            return response.notFound({ message: 'Lokasi tidak ditemukan' });
        }

        const locationSchema = schema.create({
            name: schema.string.optional([rules.trim(), rules.minLength(3)]),
            address: schema.string.optional([rules.trim(), rules.minLength(10)]),
            mapUrl: schema.string.optional([rules.url()]),
            regionName: schema.string.optional([rules.trim(), rules.minLength(2)]),
            lat: schema.number.nullableAndOptional(),
            lng: schema.number.nullableAndOptional(),
        });

        try {
            const payload = await request.validate({ schema: locationSchema });
            location.merge(payload);
            await location.save();
            return response.ok({
                message: 'Lokasi berhasil diperbarui!',
                data: location.serialize(),
            });
        } catch (error) {
            console.error('Error saat memperbarui lokasi:', error);
            if (error.messages) {
                return response.badRequest({
                    message: 'Data lokasi tidak valid.',
                    errors: error.messages,
                });
            }
            return response.internalServerError({
                message: 'Gagal memperbarui lokasi. Silakan coba lagi nanti.',
                error: error.message,
            });
        }
    }

    public async destroy({ params, response }: HttpContext) {
        const location = await Location.find(params.id);
        if (!location) {
            return response.notFound({ message: 'Lokasi tidak ditemukan' });
        }
        await location.delete();
        return response.noContent();
    }
}