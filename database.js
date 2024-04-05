import mysql from 'mysql2'

const pool=mysql.createPool({
    host:'bqxniistxgnfvjllmcxt-mysql.services.clever-cloud.com',
    user: 'uukyhrc6ubl69wvb',
    password: 'Aj9i7bggQ2XOVw1uF5EK',
    database: 'bqxniistxgnfvjllmcxt'

}).promise()

export default pool;
