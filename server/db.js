import pg from 'pg'
const { Client } = pg

const user = 'armstrong';
const password = '123321';
const host = 'localhost';
const port = '5432';
const database = 'demo2025';

const client = new Client({
  user, password, host, port, database
})

export default client;