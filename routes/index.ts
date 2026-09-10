const express = require('express');
const router = express.Router();

const hotelRouter = require('./hotel.ts');

router.use('/hotels', hotelRouter);

module.exports = router;
