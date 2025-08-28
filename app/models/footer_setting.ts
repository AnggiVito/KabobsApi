import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class FooterSetting extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'logo_image' }) 
  declare logoImage: string | null

  @column({ columnName: 'company_name' }) 
  declare companyName: string | null

  @column({ columnName: 'company_address' }) 
  declare companyAddress: string | null

  @column({ columnName: 'company_email' }) 
  declare companyEmail: string | null

  @column({ columnName: 'company_phone' }) 
  declare companyPhone: string | null

  @column({ columnName: 'sign_up_text' }) 
  declare signUpText: string | null

  @column({ columnName: 'nav_links' }) 
  public navLinks: any | null

  @column({ columnName: 'social_media_links' }) 
  public socialMediaLinks: any | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}