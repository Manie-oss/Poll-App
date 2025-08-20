import {body} from 'express-validator'

export const formValidator = [
  body('email', 'Invalid does not Empty').not().isEmpty(),
  body('email', 'Invalid email').trim().isEmail(),
  body('firstName', 'first name required').trim().notEmpty(),
  body('password', 'The minimum password length is 6 characters').customSanitizer(value => value.replace(/\s/g, "")).isLength({min: 6}),
]