import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'navbar_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('item_type', ['Thumb', 'Link', 'NavLink', 'Logo', 'TentangLink']).notNullable()
      table.string('title').nullable()
      table.string('link_url').nullable()
      table.string('image_url').nullable()
      table.integer('sort_order').defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}