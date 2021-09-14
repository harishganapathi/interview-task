var express = require('express');
var router = express.Router();
const shortid = require('shortid')
const config = require('../config/globals_config');
const db = config.mysql.getClient();
const Users = db.import('../models/user.js');

/* Get the stub data loaded - /stub */
router.get('/stub', async function (req, res, next) {
  console.log("Stub data endpoint called", get_random_integer());
  try {
    for (i = 0; i < 10000; i++) {
      const stub_data = {
        user_id: get_random_integer(0, 3),
        uuid: generate_uuid(),
        name: req.params.name,
        balance_data_source_1: get_random_integer(1000, 10000),
        balance_data_source_2: get_random_integer(1000, 10000),
        balance_data_source_3: get_random_integer(1000, 10000),
        balance_data_source_4: get_random_integer(1000, 10000),
        created_at: Date.now(),
        updated_at: get_random_date(),
      }
      await Users.create(stub_data);
    }

    return res.status(200).send({
      status: 'ok',
      message: 'Data stubbed successfully'
    });
  }
  catch (err) {
    console.log("Error is ", err);
    return res.status(400).send({
      status: 'ok',
      message: 'Sorry, please try again later'
    })
  }
});

/** /balance/august/3 */
router.get('/balance/:month/:user_id', async function (req, res, next) {
  const user = req.params.user_id;
  const month_text = req.params.month;
  try {
    if (!user || !month_text) {
      return res.status(400).json({
        status: 'error',
        message: 'Please enter proper inputs',
      })
    }
    var month = await get_month(month_text);
    if (month <= -1) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid inputs',
      })
    }
    /**
     * This can also be done with the Sequelize, however
     * for giving an overall idea of understanding about 
     * MySQL I tried this approach.
     * One more approach to be considered here is we can 
     * store the frequently accessed data in Redis and query
     * from there for the user for the particular session.
     */

    var data = await db.query(
      `select user_id, sum(balance_data_source_1),
      sum(balance_data_source_2), sum(balance_data_source_3), sum(balance_data_source_1) +
      sum(balance_data_source_2) + sum(balance_data_source_3) 
      as
      total from users
      where
      month(updated_at) = ${month} 
      and
      user_id = ${user}; 
    `);
    if (data && data[0][0]) {
      return res.status(200).json({
        status: 'ok',
        message: 'Success',
        data: 'Total balance available for ' + user + " in the month " + month_text + " is " + data[0][0].total
      });
    } else {
      return res.status(500).json({
        status: 'error',
        message: 'Please try again later.Internal server error.',
      });
    }
  } catch (err) {
    console.log("Error is ", err);
    return res.status(400).send({
      status: 'ok',
      message: 'Sorry, please try again later'
    })
  }
});

/** Helpers method */
function generate_uuid() {
  /**
   * Just to generate a unique uuid for Tables.
   */
  var short_uuid = shortid.generate()
  short_uuid = short_uuid.toLowerCase()
  short_uuid = short_uuid.replace(/_/g, 'lol')
  short_uuid = short_uuid.replace(/-/g, 'rofl')
  return short_uuid
}

function get_random_integer(floor, celi) {
  return Math.floor(Math.random() * (celi - floor + 1)) + floor;
}

function get_random_date() {
  /** 
   *  To make it easy for testing, I have randomly generated 
   *  some date in different months. However, this can be 
   *  extended by uncommenting the line to generate a random date
   */
  var date_array = ['2021-10-17 11:37:44', '2021-07-17 11:37:44', '2021-09-17 11:37:44', '2021-08-17 11:37:44', '2021-06-17 11:37:44']
  return date_array[get_random_integer(0, 4)];
  // return new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))

}

async function get_month(month) {
  /**
   * Returns a month in numerical format for text format
   */
  var months = {
    "january": 1,
    "february": 2,
    "march": 3,
    "april": 4,
    "may": 5,
    "june": 6,
    "july": 7,
    "august": 8,
    "september": 9,
    "october": 10,
    "november": 11,
    "december": 12
  };
  return months[month.toLowerCase()];
}

module.exports = router;