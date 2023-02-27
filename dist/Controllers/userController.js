import { z } from 'zod';
import { USER_ID_PREFIX } from '../Config/database.js';
import generateNextId from '../Helpers/generateNextId.js';
import userModal from './../Models/userModel.js';
import userSchema from './../Validations/userValidation.js';
const userController = {
    async post(request, response) {
        try {
            const user = await userSchema.parseAsync(request.body);
            const userId = await getNextUserId();
            await userModal.create({ ...user, userId });
            response.status(201).json({
                userId,
            });
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
async function getNextUserId() {
    const user = await userModal.findLastUser();
    return user === null
        ? `${USER_ID_PREFIX}0001`
        : generateNextId(USER_ID_PREFIX, user.userId);
}
export default userController;
