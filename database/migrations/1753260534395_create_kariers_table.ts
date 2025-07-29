import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'kariers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.date('posting').notNullable()
      table.string('namaposisi', 255).notNullable()
      table.string('kota', 255).notNullable()
      table.string('provinsi', 255).notNullable()
      table.string('workplace', 100).notNullable()
      table.string('worktype', 100).notNullable()
      table.string('paytype', 100).notNullable()
      table.bigInteger('payrange_from').nullable()
      table.bigInteger('payrange_to').nullable()
      table.text('deskripsi').notNullable()
      table.text('job_summary').notNullable()
      table.text('job_requirement').notNullable()

      table.timestamp('db_created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('db_updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}