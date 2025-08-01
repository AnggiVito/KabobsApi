import type { HttpContext } from '@adonisjs/core/http'
import Submission from '#models/submission'
import { schema, rules } from '@adonisjs/validator'
import app from '@adonisjs/core/services/app'
import * as fs from 'node:fs/promises'

export default class SubmissionsController {
    public async store({ request, response }: HttpContext) {
        const applicationSchema = schema.create({
            firstName: schema.string([rules.trim(), rules.minLength(1)]),
            lastName: schema.string([rules.trim(), rules.minLength(1)]),
            address: schema.string([rules.trim(), rules.minLength(5)]),
            phoneNumber: schema.string([rules.trim(), rules.minLength(8)]),
            email: schema.string([rules.email(), rules.trim()]),
            linkedin: schema.string.nullableAndOptional([rules.url()]),
            gender: schema.enum(['Pria', 'Wanita', 'Lainnya']),
            education: schema.enum(['SMA/SMK', 'D3', 'S1', 'S2', 'S3']),
            fatherName: schema.string([rules.trim(), rules.minLength(1)]) ,
            motherName: schema.string([rules.trim(), rules.minLength(1)]) ,
            maritalStatus: schema.enum(['Lajang', 'Menikah', 'Cerai', 'Janda/Duda']),
            previousJob: schema.string([rules.trim(), rules.minLength(5)]),
            whyKabobs: schema.string([rules.trim(), rules.minLength(10)]),
            reasonForLeaving: schema.string([rules.trim(), rules.minLength(10)]),
            expectedSalary: schema.number.nullableAndOptional(),
            positionId: schema.number(),
            cvFile: schema.file({ size: '5mb', extnames: ['pdf'] }),
            ktpFile: schema.file({ size: '5mb', extnames: ['jpg', 'png', 'jpeg'] }),
            npwpFile: schema.file({ size: '5mb', extnames: ['jpg', 'png', 'jpeg', 'pdf'] }),
        })

        try {
            const payload = await request.validate({ schema: applicationSchema })

            const emailToSanitize = payload.email.replace(/[^a-zA-Z0-9]/g, '_');
            const baseFileName = `${emailToSanitize}_${Date.now()}`;

            const cvFileName = `${baseFileName}_cv.${payload.cvFile.extname}`;
            const ktpFileName = `${baseFileName}_ktp.${payload.ktpFile.extname}`;
            const npwpFileName = `${baseFileName}_npwp.${payload.npwpFile.extname}`;

            await payload.cvFile.move(app.publicPath('submissions/cvs'), { name: cvFileName })
            await payload.ktpFile.move(app.publicPath('submissions/ktp'), { name: ktpFileName })
            await payload.npwpFile.move(app.publicPath('submissions/npwp'), { name: npwpFileName })

            const submission = await Submission.create({
                firstName: payload.firstName,
                lastName: payload.lastName,
                address: payload.address,
                phoneNumber: payload.phoneNumber,
                email: payload.email,
                linkedin: payload.linkedin,
                gender: payload.gender,
                education: payload.education,
                fatherName: payload.fatherName,
                motherName: payload.motherName,
                maritalStatus: payload.maritalStatus,
                previousJob: payload.previousJob,
                whyKabobs: payload.whyKabobs,
                reasonForLeaving: payload.reasonForLeaving,
                expectedSalary: payload.expectedSalary,
                positionId: payload.positionId,
                cvPath: `submissions/cvs/${cvFileName}`,
                ktpPath: `submissions/ktp/${ktpFileName}`,
                npwpPath: `submissions/npwp/${npwpFileName}`,
            })

            return response.created({
                message: 'Lamaran berhasil dikirim!',
                data: submission.serialize(),
            })
        } catch (error) {
            if (error.messages) {
                return response.badRequest({
                    message: 'Validasi data lamaran gagal.',
                    errors: error.messages,
                })
            }
            return response.internalServerError({
                message: 'Gagal menyimpan lamaran. Silakan coba lagi nanti.',
                error: error.message || 'Terjadi kesalahan server.',
            })
        }
    }

    public async index({ response }: HttpContext) {
        const submissions = await Submission.query().preload('position').orderBy('created_at', 'desc')
        return response.ok(submissions)
    }

    public async show({ params, response }: HttpContext) {
        const submission = await Submission.query().where('id', params.id).preload('position').first()
        if (!submission) {
            return response.notFound({ message: 'Lamaran tidak ditemukan.' })
        }
        return response.ok(submission)
    }

    public async update({ params, request, response }: HttpContext) {
        const submission = await Submission.find(params.id)
        if (!submission) {
            return response.notFound({ message: 'Lamaran tidak ditemukan.' })
        }

        const updateSchema = schema.create({
            firstName: schema.string.optional([rules.trim(), rules.minLength(1)]),
            lastName: schema.string.optional([rules.trim(), rules.minLength(1)]),
            address: schema.string.optional([rules.trim(), rules.minLength(5)]),
            phoneNumber: schema.string.optional([rules.trim(), rules.minLength(8)]),
            email: schema.string.optional([rules.email(), rules.trim()]),
            linkedin: schema.string.nullableAndOptional([rules.url()]),
            gender: schema.enum.optional(['Pria', 'Wanita', 'Lainnya']),
            education: schema.enum.optional(['SMA/SMK', 'D3', 'S1', 'S2', 'S3']),
            fatherName: schema.string.optional([rules.trim(), rules.minLength(1)]),
            motherName: schema.string.optional([rules.trim(), rules.minLength(1)]),
            maritalStatus: schema.enum.optional(['Lajang', 'Menikah', 'Cerai', 'Janda/Duda']),
            previousJob: schema.string.optional([rules.trim(), rules.minLength(5)]),
            whyKabobs: schema.string.optional([rules.trim(), rules.minLength(10)]),
            reasonForLeaving: schema.string.optional([rules.trim(), rules.minLength(10)]),
            expectedSalary: schema.number.nullableAndOptional(),
            positionId: schema.number.optional(),
            cvFile: schema.file.optional({ size: '5mb', extnames: ['pdf'] }),
            ktpFile: schema.file.optional({ size: '5mb', extnames: ['jpg', 'png', 'jpeg'] }),
            npwpFile: schema.file.optional({ size: '5mb', extnames: ['jpg', 'png', 'jpeg', 'pdf'] }),
        })

        try {
            const payload = await request.validate({ schema: updateSchema })
            
            const dataToUpdate: { [key: string]: any } = { ...payload }
            delete dataToUpdate.cvFile
            delete dataToUpdate.ktpFile
            delete dataToUpdate.npwpFile

            const emailToSanitize = (payload.email || submission.email || 'unknown');
            const emailSanitized = emailToSanitize.replace(/[^a-zA-Z0-9]/g, '_');
            const baseFileName = `${emailSanitized}_${Date.now()}`;

            const { cvFile, ktpFile, npwpFile } = payload

            if (cvFile) {
                if (!cvFile.isValid) {
                    return response.badRequest({ message: cvFile.errors.map((err) => err.message).join(', ') })
                }
                const cvFileName = `${baseFileName}_cv.pdf`
                await cvFile.move(app.publicPath('submissions/cvs'), {
                    name: cvFileName,
                    overwrite: true,
                })
                dataToUpdate.cvPath = `submissions/cvs/${cvFileName}`
            }
            
            if (ktpFile) {
                if (!ktpFile.isValid) return response.badRequest({ message: ktpFile.errors.map((err) => err.message).join(', ') })
                const ktpFileName = `${baseFileName}_ktp.${ktpFile.extname}`
                await ktpFile.move(app.publicPath('submissions/ktp'), { name: ktpFileName, overwrite: true })
                dataToUpdate.ktpPath = `submissions/ktp/${ktpFileName}`
            }

            if (npwpFile) {
                if (!npwpFile.isValid) return response.badRequest({ message: npwpFile.errors.map((err) => err.message).join(', ') })
                const npwpFileName = `${baseFileName}_npwp.${npwpFile.extname}`
                await npwpFile.move(app.publicPath('submissions/npwp'), { name: npwpFileName, overwrite: true })
                dataToUpdate.npwpPath = `submissions/npwp/${npwpFileName}`
            }

            submission.merge(dataToUpdate)
            await submission.save()

            return response.ok(submission)
        } catch (error) {
            console.error('Error saat memperbarui lamaran:', error)
            if (error.messages) {
                return response.badRequest({
                    message: 'Validasi data lamaran gagal.',
                    errors: error.messages,
                })
            }
            return response.internalServerError({
                message: 'Gagal memperbarui lamaran. Silakan coba lagi nanti.',
                error: error.message || 'Terjadi kesalahan server.',
            })
        }
    }

    public async destroy({ params, response }: HttpContext) {
        const submission = await Submission.find(params.id)
        if (!submission) {
            return response.notFound({ message: 'Lamaran tidak ditemukan.' })
        }

        if (submission.cvPath) {
            const fullPath = app.publicPath(submission.cvPath);
            await fs.unlink(fullPath).catch(err => console.error(`Gagal menghapus file CV: ${fullPath}`, err));
        }
        if (submission.ktpPath) {
            const fullPath = app.publicPath(submission.ktpPath);
            await fs.unlink(fullPath).catch(err => console.error(`Gagal menghapus file KTP: ${fullPath}`, err));
        }
        if (submission.npwpPath) {
            const fullPath = app.publicPath(submission.npwpPath);
            await fs.unlink(fullPath).catch(err => console.error(`Gagal menghapus file NPWP: ${fullPath}`, err));
        }

        await submission.delete()
        return response.noContent()
    }
}