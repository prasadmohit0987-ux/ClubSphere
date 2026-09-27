require("dotenv").config();

const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");

const db = require("./database");

const app = express();

const PORT = process.env.PORT || 3000;

const COMMIT =
    (process.env.RENDER_GIT_COMMIT ||
        process.env.GIT_SHA ||
        "local").slice(0, 7);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "clubsphere-development-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true
        }
    })
);

app.use(express.static("public"));

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "ClubSphere server is running"
    });
});

app.get("/health", (req, res) => {

    res.json({
        status: "ok",
        commit: process.env.GIT_SHA || "local"
    });

});

app.get("/api/version", (req, res) => {
    res.json({
        commit: COMMIT
    });
});

app.post("/api/register", async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            error: "Password must be at least 6 characters"
        });
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            `
            INSERT INTO users
            (name, email, password)
            VALUES (?, ?, ?)
            `,
            [name, email, hashedPassword],
            function (err) {

                if (err) {

                    return res.status(400).json({
                        error: "Email already exists"
                    });

                }

                res.status(201).json({
                    message: "Registration successful",
                    userId: this.lastID
                });

            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Server error"
        });

    }

});

app.post("/api/login", async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required"
        });
    }

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {

            if (err) {

                return res.status(500).json({
                    error: "Database error"
                });

            }

            if (!user) {

                return res.status(401).json({
                    error: "Invalid email or password"
                });

            }

            const validPassword = await bcrypt.compare(
                password,
                user.password
            );

            if (!validPassword) {

                return res.status(401).json({
                    error: "Invalid email or password"
                });

            }

            req.session.userId = user.id;

            res.json({
                message: "Login successful"
            });

        }
    );

});

app.post("/api/logout", (req, res) => {

    req.session.destroy(() => {

        res.json({
            message: "Logged out successfully"
        });

    });

});

app.get("/api/me", (req, res) => {

    if (!req.session.userId) {

        return res.status(401).json({
            error: "Not logged in"
        });

    }

    db.get(
        `
        SELECT id, name, email, role
        FROM users
        WHERE id = ?
        `,
        [req.session.userId],
        (err, user) => {

            if (err) {

                return res.status(500).json({
                    error: "Database error"
                });

            }

            if (!user) {

                return res.status(404).json({
                    error: "User not found"
                });

            }

            res.json(user);

        }
    );

});

app.get("/api/clubs", (req, res) => {

    db.all(
        "SELECT * FROM clubs ORDER BY name",
        [],
        (err, clubs) => {

            if (err) {

                return res.status(500).json({
                    error: "Database error"
                });

            }

            res.json(clubs);

        }
    );

});

app.get("/api/clubs/:id", (req, res) => {

    db.get(
        "SELECT * FROM clubs WHERE id = ?",
        [req.params.id],
        (err, club) => {

            if (err) {

                return res.status(500).json({
                    error: "Database error"
                });

            }

            if (!club) {

                return res.status(404).json({
                    error: "Club not found"
                });

            }

            res.json(club);

        }
    );

});

app.post("/api/clubs/:id/join", (req, res) => {

    if (!req.session.userId) {

        return res.status(401).json({
            error: "Please login first"
        });

    }

    const userId = req.session.userId;
    const clubId = req.params.id;

    db.run(
        `
        INSERT INTO memberships
        (user_id, club_id)
        VALUES (?, ?)
        `,
        [userId, clubId],
        function (err) {

            if (err) {

                return res.status(400).json({
                    error: "Already joined or invalid club"
                });

            }

            res.status(201).json({
                message: "Joined club successfully"
            });

        }
    );

});

app.delete("/api/clubs/:id/leave", (req, res) => {

    if (!req.session.userId) {

        return res.status(401).json({
            error: "Please login first"
        });

    }

    db.run(
        `
        DELETE FROM memberships
        WHERE user_id = ?
        AND club_id = ?
        `,
        [req.session.userId, req.params.id],
        function (err) {

            if (err) {

                return res.status(500).json({
                    error: "Database error"
                });

            }

            res.json({
                message: "Left club successfully"
            });

        }
    );

});

app.get("/api/my-clubs", (req, res) => {

    if (!req.session.userId) {

        return res.status(401).json({
            error: "Please login first"
        });

    }

    db.all(
        `
        SELECT
            clubs.id,
            clubs.name,
            clubs.description,
            clubs.category,
            clubs.president,
            memberships.joined_at
        FROM memberships
        INNER JOIN clubs
        ON memberships.club_id = clubs.id
        WHERE memberships.user_id = ?
        ORDER BY clubs.name
        `,
        [req.session.userId],
        (err, clubs) => {

            if (err) {

                return res.status(500).json({
                    error: "Database error"
                });

            }

            res.json(clubs);

        }
    );

});

if (require.main === module) {

    app.listen(PORT, () => {

        console.log(
            `ClubSphere running on http://localhost:${PORT}`
        );

    });

}

module.exports = app;