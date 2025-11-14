import dotenv from 'dotenv'
dotenv.config()
import pkg from 'pg'

const {Pool} = pkg
let pool;
  export function connectToDB(){
    if(!pool){
       pool = new Pool({
        connectionString : process.env.DATABASE_URL,
        ssl: {rejectUnauthorized : false}
      });
      pool.connect()
    }
      return pool
  }


console.log('DATABASE_URL',process.env.DATABASE_URL)


export const createDatabase = async () => {
  try{
    const pool = connectToDB()
    await pool.query(`CREATE DATABASE inforadar;`)

    await pool.query(`CREATE TABLE IF NOT EXISTS users(
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      refresh_token TEXT
      )`
    )

    await pool.query(`CREATE TABLE IF NOT EXISTS interests(
      interest_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      interest TEXT NOT NULL,
      UNIQUE(user_id, interest),
      )`
    
    )

    await pool.query(`CREATE TABLE IF NOT EXISTS articles(
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      link TEXT,
      topic TEXT NOT NULL,
      creationDate TIMESTAMP
      )`
    )


      await pool.query(`CREATE TABLE IF NOT EXISTS articlesSaveds(
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      link TEXT,
      topic TEXT NOT NULL,
      creationDate TIMESTAMP
        )`
      )
    console.log('base de datos creada correctamente')
  } catch (error){
    console.error(error)
  }
}





