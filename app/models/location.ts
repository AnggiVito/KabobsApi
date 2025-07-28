import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Location extends BaseModel {
  public static table = 'locations'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare address: string

  @column()
  declare mapUrl: string

  @column()
  declare regionName: string

  @column()
  declare lat: number | null

  @column()
  declare lng: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}