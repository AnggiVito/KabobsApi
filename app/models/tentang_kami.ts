import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TentangKami extends BaseModel {
  public static table = 'tentang_kami'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'store_count' })
  declare storeCount: string | null
  
  @column({ columnName: 'store_description' })
  declare storeDescription: string | null

  @column({ columnName: 'rating_title' })
  declare ratingTitle: string | null

  @column({ columnName: 'rating_description' })
  declare ratingDescription: string | null
  
  @column({ columnName: 'about_us_title' })
  declare aboutUsTitle: string | null

  @column({ columnName: 'about_us_body1' })
  declare aboutUsBody1: string | null

  @column({ columnName: 'about_us_body2' })
  declare aboutUsBody2: string | null

  @column({ columnName: 'img_utama_src' })
  declare imgUtamaSrc: string | null

  @column({ columnName: 'img_sosmed1_src' })
  declare imgSosmed1Src: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}