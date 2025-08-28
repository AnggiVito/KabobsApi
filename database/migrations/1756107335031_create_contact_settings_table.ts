import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contact_settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('page_title').nullable()
      table.text('page_subtitle').nullable()
      table.string('contact_info_heading').nullable()
      table.text('contact_info_description').nullable()
      table.string('phone').nullable()
      table.string('email').nullable()
      table.string('address').nullable()
      table.string('success_image').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}