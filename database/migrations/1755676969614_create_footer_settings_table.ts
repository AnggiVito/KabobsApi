import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'footer_settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      
      table.string('logo_image').nullable()
      table.string('company_name').nullable()
      table.text('company_address').nullable()
      table.string('company_email').nullable()
      table.string('company_phone').nullable()
      table.string('sign_up_text').nullable()
      table.jsonb('nav_links').nullable()
      table.jsonb('social_media_links').nullable()

      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}