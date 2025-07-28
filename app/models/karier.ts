import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Karier extends BaseModel {
  public static table = 'kariers'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nama: string

  @column()
  declare jenis: string

  @column()
  declare lokasi: string

  @column()
  declare keahlian: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}