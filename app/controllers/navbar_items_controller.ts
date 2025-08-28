import type { HttpContext } from '@adonisjs/core/http'
import NavbarItem from '#models/navbar_item'
import app from '@adonisjs/core/services/app'
import { schema, rules } from '@adonisjs/validator'
import * as fs from 'node:fs/promises'

export default class NavbarItemsController {
    public async index({ request, response }: HttpContext) {
        const itemType = request.input('item_type')
        const query = NavbarItem.query()

        if (itemType) {
        query.where('itemType', itemType)
        }
        const items = await query.orderBy('sort_order', 'asc')
        return response.ok(items)
    }

    public async store({ request, response }: HttpContext) {
        const itemSchema = schema.create({
        // Sesuaikan daftar enum di validator
        itemType: schema.enum(['Thumb', 'Link', 'NavLink', 'Logo', 'TentangLink']),
        title: schema.string.optional([rules.trim()]),
        linkUrl: schema.string.optional([rules.trim()]),
        sortOrder: schema.number.optional(),
        })

        const payload = await request.validate({ schema: itemSchema })
        
        const imageFile = request.file('image', {
            size: '2mb',
            extnames: ['png', 'jpg', 'jpeg', 'webp', 'svg'],
        })

        const dataToSave: Partial<NavbarItem> = { 
            ...payload, 
            itemType: payload.itemType as 'Thumb' | 'Link' | 'NavLink' | 'Logo' | 'TentangLink'
        }

        if (imageFile) {
            if (!imageFile.isValid) {
                return response.badRequest({ message: imageFile.errors.map((err) => err.message).join(', ') })
            }
            const fileName = `${payload.itemType}_${Date.now()}.${imageFile.extname}`
            await imageFile.move(app.publicPath('images/navbar'), { name: fileName, overwrite: true })
            dataToSave.imageUrl = `images/navbar/${fileName}`
        }

        const item = await NavbarItem.create(dataToSave)
        return response.created(item)
    }

    public async show({ params, response }: HttpContext) {
        const item = await NavbarItem.findOrFail(params.id)
        return response.ok(item)
    }

    public async update({ params, request, response }: HttpContext) {
        const item = await NavbarItem.findOrFail(params.id)

        const payload = await request.validate({
            schema: schema.create({
                title: schema.string.optional([rules.trim()]),
                linkUrl: schema.string.optional([rules.trim()]),
                sortOrder: schema.number.optional(),
                itemType: schema.enum.optional(['Thumb', 'Link', 'NavLink', 'Logo', 'TentangLink']),
            }),
        })

        const imageFile = request.file('image', {
            size: '2mb',
            extnames: ['png', 'jpg', 'jpeg', 'webp', 'svg'],
        })

        const dataToUpdate: Partial<NavbarItem> = { 
            ...payload, 
            itemType: payload.itemType as 'Thumb' | 'Link' | 'NavLink' | 'Logo' | 'TentangLink' | undefined 
        }

        if (imageFile) {
            if (!imageFile.isValid) {
                return response.badRequest({ message: imageFile.errors.map((err) => err.message).join(', ') })
            }
            if (item.imageUrl) {
                await fs.unlink(app.publicPath(item.imageUrl)).catch(() => {})
            }
            const fileName = `${item.itemType}_${Date.now()}.${imageFile.extname}`
            await imageFile.move(app.publicPath('images/navbar'), { name: fileName, overwrite: true })
            dataToUpdate.imageUrl = `images/navbar/${fileName}`
        }

        item.merge(dataToUpdate)
        await item.save()
        return response.ok(item)
    }

    public async destroy({ params, response }: HttpContext) {
        const item = await NavbarItem.findOrFail(params.id)
        if (item.imageUrl) {
            await fs.unlink(app.publicPath(item.imageUrl)).catch(() => {})
        }
        await item.delete()
        return response.noContent()
    }
}