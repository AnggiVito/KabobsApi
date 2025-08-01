import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'submissions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('first_name', 255).notNullable()
      table.string('last_name', 255).notNullable()
      table.text('address').notNullable()
      table.string('phone_number', 20).notNullable()
      table.string('email', 255).notNullable()
      table.string('linkedin', 255).nullable()
      table.string('gender', 50).notNullable()
      table.string('education', 50).notNullable()
      table.string('father_name', 255).notNullable()
      table.string('mother_name', 255).notNullable()
      table.string('marital_status', 50).notNullable()
      table.text('previous_job').notNullable()
      table.text('why_kabobs').notNullable()
      table.text('reason_for_leaving').notNullable()
      table.string('cv_path', 255).notNullable()
      table.string('ktp_path', 255).notNullable()
      table.string('npwp_path', 255).notNullable()
      table.bigInteger('expected_salary').nullable()

      table.integer('position_id').unsigned().notNullable() 
      table.foreign('position_id').references('id').inTable('kariers').onDelete('RESTRICT')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}