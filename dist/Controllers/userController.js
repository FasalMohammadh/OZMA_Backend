import { z } from 'zod';
import userModal from './../Models/userModel.js';
import userSchema from './../Validations/userValidation.js';
const userController = {
    async post(request, response) {
        try {
            const user = await userSchema.parseAsync(request.body);
            await userModal.create(user);
            response.sendStatus(201);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.flatten().fieldErrors;
                const allErrs = [];
                for (const key in fieldErrors) {
                    allErrs.push({
                        path: key,
                        error: fieldErrors[key]?.at(0) ?? '',
                    });
                }
                response.status(400).json(allErrs);
                return undefined;
            }
            response.sendStatus(500);
        }
    },
};
export default userController;
