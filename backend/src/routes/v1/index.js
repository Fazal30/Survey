const express = require('express');

const router = express.Router();
const controller = require('../../controllers/v1/index');
const authRouter = require('./auth');
const userRouter = require('./user');
const formRouter = require('./form');
const surveyRouter = require('./survey');

router.get('/status', controller.getStatus);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/forms', formRouter);
router.use('/survey', surveyRouter);

module.exports = router;
