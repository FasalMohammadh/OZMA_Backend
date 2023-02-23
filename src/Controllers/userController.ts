import { Request, Response } from 'express';
import { z } from 'zod';

import userModal from './../Models/userModel.js';
import userSchema, { User } from './../Validations/userValidation.js';

const userController: UserController = {
  async post(request, response) {
    try {
      const user = await userSchema.parseAsync(request.body);
      await userModal.create(user);
      response.sendStatus(201);
    } catch (error) {
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

interface CusRequest extends Request {
  body: User;
}

interface UserController {
  post: (request: CusRequest, response: Response) => void;
}

export default userController;
