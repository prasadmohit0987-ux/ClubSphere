const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
    "./database/clubsphere.db"
);

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'student',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS clubs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            president TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS memberships (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            club_id INTEGER NOT NULL,
            joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            UNIQUE(user_id, club_id),

            FOREIGN KEY(user_id)
                REFERENCES users(id),

            FOREIGN KEY(club_id)
                REFERENCES clubs(id)
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO clubs
        (id, name, description, category, president)
        VALUES
        (
            1,
            'Coding Club',
            'A community for students interested in programming and software development.',
            'Technology',
            'Aarav Sharma'
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO clubs
        (id, name, description, category, president)
        VALUES
        (
            2,
            'Robotics Club',
            'Students collaborate on robotics, automation and embedded systems.',
            'Technology',
            'Riya Patil'
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO clubs
        (id, name, description, category, president)
        VALUES
        (
            3,
            'Photography Club',
            'A creative community for students interested in photography.',
            'Arts',
            'Kabir Mehta'
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO clubs
        (id, name, description, category, president)
        VALUES
        (
            4,
            'Sports Club',
            'A student community focused on sports and fitness activities.',
            'Sports',
            'Neha Joshi'
        )
    `);

});

module.exports = db;