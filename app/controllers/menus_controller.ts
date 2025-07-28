import type { HttpContext } from '@adonisjs/core/http'
import Menu from '#models/menu'
import { schema, rules } from '@adonisjs/validator'

export default class MenusController {
  public async index({ request, response }: HttpContext) {
    const category = request.input('category');

    let query = Menu.query();

    if (category && category !== 'Semua Menu') {
        query = query.where('category', category);
    }

    const menus = await query.orderBy('category', 'asc').orderBy('name', 'asc');
    return response.ok(menus);
  }

  public async store({ request, response }: HttpContext) {
    const menuSchema = schema.create({
      name: schema.string([rules.trim(), rules.minLength(3)]),
      category: schema.enum([
          'Kebab', 'Drinks', 'Snacks', 'Fun Box', 'Fun Set', 'Combobs', 'Combo Seru', 'Seasonal Menu'
      ]),
    });

    try {
      const { name, category } = await request.validate({ schema: menuSchema });

      const imageFile = request.file('image', {
          size: '5mb',
          extnames: ['jpg', 'png', 'jpeg', 'gif'],
      });

      if (!imageFile) {
          return response.badRequest({ message: 'Gambar (image) wajib diunggah.' });
      }

      if (!imageFile.isValid) {
          return response.badRequest({ message: imageFile.errors.map(err => err.message).join(', ') });
      }

      const fileName = imageFile.clientName; 

      await imageFile.move('public/images', {
          name: fileName,
          overwrite: true,
      });

      const imagePath = `images/${fileName}`;

      const menu = await Menu.create({
          name: name,
          category: category,
          image: imagePath,
      });

      return response.created(menu);
    } catch (error) {
      console.error('Error saat menyimpan item menu:', error);
      if (error.messages) {
          return response.badRequest({
            message: 'Data menu tidak valid.',
            errors: error.messages,
          });
      }
      return response.internalServerError({
          message: 'Gagal menyimpan item menu. Silakan coba lagi nanti.',
          error: error.message || 'Terjadi kesalahan server.',
      });
    }
  }

  public async show({ params, response }: HttpContext) {
    const menu = await Menu.find(params.id);
    if (!menu) {
        return response.notFound({ message: 'Item menu tidak ditemukan' });
    }
    return response.ok(menu);
  }

  public async update({ params, request, response }: HttpContext) {
    const menu = await Menu.find(params.id);
    if (!menu) {
        return response.notFound({ message: 'Item menu tidak ditemukan' });
    }

    const updateSchema = schema.create({
      name: schema.string.optional([rules.trim(), rules.minLength(3)]),
      category: schema.enum.optional([
          'Kebab', 'Drinks', 'Snacks', 'Fun Box', 'Fun Set', 'Combobs', 'Combo Seru', 'Seasonal Menu'
      ]),
    });

    try {
      const payload = await request.validate({ schema: updateSchema });
      const dataToUpdate: { [key: string]: any } = { ...payload };

      const imageFile = request.file('image', {
          size: '5mb',
          extnames: ['jpg', 'png', 'jpeg', 'gif'],
      });

      if (imageFile) {
          if (!imageFile.isValid) {
              return response.badRequest({ message: imageFile.errors.map(err => err.message).join(', ') });
          }
          const fileName = imageFile.clientName;

          await imageFile.move('public/images', {
              name: fileName,
              overwrite: true,
          });
          dataToUpdate.image = `images/${fileName}`;
      }

      menu.merge(dataToUpdate);
      await menu.save();

      return response.ok(menu);
    } catch (error) {
      console.error('Error saat memperbarui item menu:', error);
      if (error.messages) {
          return response.badRequest({
            message: 'Data menu tidak valid.',
            errors: error.messages,
          });
      }
      return response.internalServerError({
          message: 'Gagal memperbarui item menu. Silakan coba lagi nanti.',
          error: error.message || 'Terjadi kesalahan server.',
      });
    }
  }

  public async destroy({ params, response }: HttpContext) {
    const menu = await Menu.find(params.id);
    if (!menu) {
        return response.notFound({ message: 'Item menu tidak ditemukan' });
    }
    await menu.delete();
    return response.noContent();
  }
}