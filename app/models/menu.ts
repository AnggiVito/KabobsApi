import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Menu extends BaseModel {
  public static table = 'menus'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare image: string

  @column()
  declare category: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}