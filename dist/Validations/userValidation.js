import { z } from 'zod';
import userModal from './../Models/userModel.js';
const userSchema = z.object({
    firstName: z.string().trim().min(1, 'First Name is a required field'),
    lastName: z.string().trim(),
    dob: z.string().trim().min(1, 'Date of Birth is a required field'),
    email: z
        .string()
        .trim()
        .email()
        .transform(async (value, ctx) => {
        const response = await userModal.findUserByEmail(value);
        if (response.length > 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Email is already taken',
            });
            return z.NEVER;
        }
        return value;
    }),
    mobileNumber: z
        .string()
        .trim()
        .nullable()
        .transform(async (value, ctx) => {
        if (value === null)
            return value;
        const response = await userModal.findUserByMobileNumber(value);
        if (response.length > 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Mobile Number is already taken',
            });
            return z.NEVER;
        }
        return value;
    }),
    whatsappNumber: z
        .string()
        .trim()
        .min(1, 'Whatsapp Number is a required field'),
    nic: z.string().trim().min(1, 'NIC is a required field'),
    address: z.string().trim().min(1, 'Address is a required field'),
    olYear: z
        .number()
        .max(new Date().getFullYear(), 'Not a valid year')
        .min(1000, 'Not a valid year'),
    alYear: z
        .number()
        .nullable()
        .transform((value, ctx) => {
        if (value !== null) {
            const isValid = z
                .number()
                .max(new Date().getFullYear(), 'Not a valid year')
                .min(1000, 'Not a valid year')
                .safeParse(value).success;
            if (isValid)
                return value;
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Not a valid year',
            });
            return z.NEVER;
        }
        return value;
    }),
    profession: z
        .string()
        .trim()
        .nullable()
        .transform(value => {
        if (value === null)
            return 'Not Employed';
        return value;
    }),
    indexNo: z
        .string()
        .trim()
        .nullable()
        .transform(value => {
        if (value === null)
            return 'Not Available';
        return value;
    }),
    photoUrl: z.string().trim().url(),
    signatureFileUrl: z.string().trim().url(),
    partOfSmf: z.boolean(),
    contributionToOzma: z.array(z.string()),
});
export default userSchema;
