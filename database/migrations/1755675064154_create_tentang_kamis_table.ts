import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tentang_kami'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      
      table.string('store_count').nullable()
      table.text('store_description').nullable()
      table.string('rating_title').nullable()
      table.text('rating_description').nullable()
      table.string('about_us_title').nullable()
      table.text('about_us_body1').nullable()
      table.text('about_us_body2').nullable()
      table.string('img_utama_src').nullable()
      table.string('img_sosmed1_src').nullable()

      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}