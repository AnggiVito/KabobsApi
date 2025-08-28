import type { HttpContext } from '@adonisjs/core/http'
import HomeItem from '#models/home_item'
import { schema, rules } from '@adonisjs/validator'
import app from '@adonisjs/core/services/app'
import * as fs from 'node:fs/promises'

export default class HomeItemsController {
  public async index({ request, response }: HttpContext) {
    const itemType = request.input('item_type')
    const query = HomeItem.query()

    if (itemType) {
      query.where('itemType', itemType)
    }

    const items = await query.orderBy('sort_order').orderBy('id', 'desc')
    return response.ok(items)
  }

  public async store({ request, response }: HttpContext) {
    const itemSchema = schema.create({
      itemType: schema.enum(['MenuFav', 'Penawaran', 'Gallery', 'kStar', 'SosmedIcon', 'InstagramPost']),
      title: schema.string.nullableAndOptional([rules.trim(), rules.minLength(3)]),
      linkUrl: schema.string.nullableAndOptional([rules.url()]),
      sortOrder: schema.number.nullableAndOptional(),
      isActive: schema.boolean.nullableAndOptional(),
    })

    try {
      const payload = await request.validate({ schema: itemSchema })
      
      const imageFile = request.file('image')

      if (!imageFile) {
        return response.badRequest({ message: 'Gambar wajib diunggah.' })
      }
      if (!imageFile.isValid) {
        return response.badRequest({ message: imageFile.errors.map((err) => err.message).join(', ') })
      }

      const fileName = imageFile.clientName

      await imageFile.move(app.publicPath('images'), {
        name: fileName,
        overwrite: true,
      })

      const item = await HomeItem.create({
        itemType: payload.itemType,
        title: payload.title ?? undefined,
        linkUrl: payload.linkUrl,
        sortOrder: payload.sortOrder || 0,
        isActive: payload.isActive ?? true,
        imageUrl: `images/${fileName}`,
      })

      return response.created(item)
    } catch (error) {
      console.error('Error saat menyimpan item home:', error)
      if (error.messages) {
        return response.badRequest({
          message: 'Validasi data gagal.',
          errors: error.messages,
        })
      }
      return response.internalServerError({
        message: 'Gagal menyimpan item. Silakan coba lagi nanti.',
        error: error.message || 'Terjadi kesalahan server.',
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    const item = await HomeItem.find(params.id)
    if (!item) {
      return response.notFound({ message: 'Item tidak ditemukan' })
    }
    return response.ok(item)
  }

  public async update({ params, request, response }: HttpContext) {
    const item = await HomeItem.find(params.id)
    if (!item) {
      return response.notFound({ message: 'Item tidak ditemukan' })
    }

    const updateSchema = schema.create({
      itemType: schema.enum.optional(['MenuFav', 'Penawaran', 'Gallery', 'kStar', 'SosmedIcon', 'InstagramPost']),
      title: schema.string.nullableAndOptional([rules.trim()]),
      linkUrl: schema.string.nullableAndOptional([rules.url()]),
      sortOrder: schema.number.nullableAndOptional(),
      isActive: schema.boolean.nullableAndOptional(),
    })

    try {
      const payload = await request.validate({ schema: updateSchema })
      
      const dataToUpdate: { [key: string]: any } = { ...payload }

      const imageFile = request.file('image')

      if (imageFile) {
        if (!imageFile.isValid) {
          return response.badRequest({ message: imageFile.errors.map((err) => err.message).join(', ') })
        }

        const fileName = imageFile.clientName
        
        await imageFile.move(app.publicPath('images'), {
          name: fileName,
          overwrite: true,
        })

        dataToUpdate.imageUrl = `images/${fileName}`

        if (item.imageUrl) {
          const oldFilePath = app.publicPath(item.imageUrl)
          await fs.unlink(oldFilePath).catch(err => console.error('Gagal menghapus file lama:', err))
        }
      }

      item.merge(dataToUpdate)
      await item.save()
      return response.ok(item)
    } catch (error) {
      console.error('Error saat memperbarui item home:', error)
      if (error.messages) {
        return response.badRequest({
          message: 'Validasi data gagal.',
          errors: error.messages,
        })
      }
      return response.internalServerError({
        message: 'Gagal memperbarui item. Silakan coba lagi nanti.',
        error: error.message || 'Terjadi kesalahan server.',
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    const item = await HomeItem.find(params.id)
    if (!item) {
      return response.notFound({ message: 'Item tidak ditemukan.' })
    }

    if (item.imageUrl) {
        const filePath = app.publicPath(item.imageUrl)
        await fs.unlink(filePath).catch(err => console.error('Gagal menghapus file:', err))
    }
    
    await item.delete()
    return response.noContent()
  }
}