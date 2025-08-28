import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('header_title').nullable()
      table.text('header_desc1').nullable()
      table.text('header_desc2').nullable()
      table.string('header_image').nullable()
      table.string('section_title').nullable()
      table.jsonb('order_options').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}