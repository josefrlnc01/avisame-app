import Database from 'better-sqlite3';

export const db = new Database('inforadar.db', { verbose: console.log });
// Enable foreign key support
db.pragma('foreign_keys = ON');

export const createTables = db.transaction(() => {
  

  // Recreate users table with refresh_token column
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      refresh_token TEXT
    )`).run();

       
    // Create interests table with foreign key
     
    db.prepare(`
      CREATE TABLE IF NOT EXISTS interests  (
        interest_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER ,
        interest TEXT NOT NULL,
        UNIQUE (user_id, interest),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`).run();

    // Create articles table with foreign key
 
    db.prepare(`
      CREATE TABLE IF NOT EXISTS articles  (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
    title TEXT NOT NULL UNIQUE,
    link TEXT NOT NULL,
    topic TEXT NOT NULL,
    
    creationDate ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `).run();
      
    
    db.prepare(`
  CREATE TABLE IF NOT EXISTS articlesSaveds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    link TEXT NOT NULL,
    topic TEXT,
    creationDate TEXT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`).run();
  })


