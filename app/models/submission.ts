import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Karier from '#models/karier'

export default class Submission extends BaseModel {
  public static table = 'submissions'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare address: string

  @column()
  declare phoneNumber: string

  @column()
  declare email: string

  @column()
  declare linkedin: string | null

  @column()
  declare gender: string

  @column()
  declare education: string

  @column()
  declare fatherName: string

  @column()
  declare motherName: string

  @column()
  declare maritalStatus: string

  @column()
  declare previousJob: string

  @column()
  declare whyKabobs: string

  @column()
  declare reasonForLeaving: string

  @column()
  declare cvPath: string | null

  @column()
  declare expectedSalary: number | null

  @column()
  declare ktpPath: string | null

  @column()
  declare npwpPath: string | null

  @column()
  declare positionId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare status: number

  // Relasi ke model Karier
  @belongsTo(() => Karier, {
    foreignKey: 'positionId',
  })
  declare position: BelongsTo<typeof Karier>
}