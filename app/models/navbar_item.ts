// app/models/navbar_item.ts

import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class NavbarItem extends BaseModel {
  public static table = 'navbar_items'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare itemType: 'Thumb' | 'Link' | 'NavLink' | 'Logo' | 'TentangLink'

  @column()
  declare title: string | null

  @column({ columnName: 'link_url' })
  declare linkUrl: string | null

  @column({ columnName: 'image_url' })
  declare imageUrl: string | null

  @column({ columnName: 'sort_order' })
  declare sortOrder: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}