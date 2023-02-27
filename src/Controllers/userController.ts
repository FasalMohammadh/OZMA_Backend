import { Request, Response } from 'express';
import { z } from 'zod';
import { USER_ID_PREFIX } from '../Config/database.js';
import generateNextId from '../Helpers/generateNextId.js';

import userModal from './../Models/userModel.js';
import userSchema, { User } from './../Validations/userValidation.js';

const userController: UserController = {
  async post(request, response) {
    try {
      const user = await userSchema.parseAsync(request.body);
      const userId = await getNextUserId();
      await userModal.create({ ...user, userId });
      response.status(201).json({
        userId,
      });
    } catch (error) {
      console.log(error,"asdasdas")
      if (error instanceof z.ZodError) {
        type FieldError = { path: string; error: string };

        const fieldErrors = error.flatten().fieldErrors;
        const allErrs: Array<FieldError> = [];
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

interface CusRequest extends Request {
  body: User;
}

interface UserController {
  post: (request: CusRequest, response: Response) => void;
}

export default userController;
