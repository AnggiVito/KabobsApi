import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Karier extends BaseModel {
  public static table = 'kariers'

  @column({ isPrimary: true })
  declare id: number

  @column.date()
  declare posting: DateTime 

  @column()
  declare namaposisi: string

  @column()
  declare kota: string

  @column()
  declare provinsi: string

  @column()
  declare workplace: string

  @column()
  declare worktype: string

  @column()
  declare paytype: string

  @column()
  declare payrangeFrom: number | null

  @column()
  declare payrangeTo: number | null

  @column()
  declare deskripsi: string

  @column()
  declare job_summary: string

  @column()
  declare job_requirement: string

  @column.dateTime({ autoCreate: true })
  declare dbCreatedAt: DateTime 

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare dbUpdatedAt: DateTime
}