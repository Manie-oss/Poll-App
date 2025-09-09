import {body, check} from 'express-validator'

export const createPoll = [
  body('title', 'title required').trim().notEmpty(),
  body('options', 'options should be minimum 2 and maximum 10.').isArray({ min: 2, max: 10 }),
  check("options.*.title", "title should not be empty").trim().notEmpty(),
  body('closesAt', "expiry date required").notEmpty(),
  body('visibility', 'poll visibility required').notEmpty(),
]