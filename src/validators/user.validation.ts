import {body} from 'express-validator'

export const updateUser = [
    body('firstName', 'first name required').optional().trim().notEmpty(),
   body('lastName', 'last name required').optional().trim().notEmpty(),
]