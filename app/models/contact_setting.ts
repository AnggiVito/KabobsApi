import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ContactSetting extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'page_title' })
  declare pageTitle: string | null

  @column({ columnName: 'page_subtitle' })
  declare pageSubtitle: string | null

  @column({ columnName: 'contact_info_heading' })
  declare contactInfoHeading: string | null

  @column({ columnName: 'contact_info_description' })
  declare contactInfoDescription: string | null

  @column()
  declare phone: string | null

  @column()
  declare email: string | null

  @column()
  declare address: string | null

  @column({ columnName: 'success_image' })
  declare successImage: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}