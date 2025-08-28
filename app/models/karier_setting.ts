import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class KarierSetting extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  
  @column({ columnName: 'header_title' })
  declare headerTitle: string | null

  @column({ columnName: 'header_desc1' })
  declare headerDesc1: string | null

  @column({ columnName: 'header_desc2' })
  declare headerDesc2: string | null

  @column({ columnName: 'header_image' })
  declare headerImage: string | null

  @column({ columnName: 'section_title' })
  declare sectionTitle: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}