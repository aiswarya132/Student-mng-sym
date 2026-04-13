const mysql = require("mysql2");

const con = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
});

function mapRow(row) {
    if (!row) return null;
    return {
        id: row.ID ?? row.id,
        name: row.NAME ?? row.name,
        age: row.AGE ?? row.age,
        city: row.CITY ?? row.city,
    };
}

exports.apiList = (req, res) => {
    const search = req.query.search;
    let sql = "SELECT * FROM users";
    const params = [];

    if (search) {
        sql += " WHERE NAME LIKE ? OR CITY LIKE ?";
        params.push(`%${search}%`, `%${search}%`);
    }

    con.query(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: "Failed to load students." });
        res.json(rows.map(mapRow));
    });
};

exports.apiGetById = (req, res) => {
    const id = req.params.id;
    con.query("SELECT * FROM users WHERE ID = ?", [id], (err, rows) => {
        if (err) return res.status(500).json({ error: "Failed to load student." });
        const user = rows[0];
        if (!user) return res.status(404).json({ error: "Student not found." });
        res.json(mapRow(user));
    });
};

exports.apiCreate = (req, res) => {
    const { name, age, city } = req.body || {};
    if (!name || age === undefined || age === "" || !city) {
        return res.status(400).json({ error: "Name, age, and city are required." });
    }

    con.query(
        "INSERT INTO users (NAME, AGE, CITY) VALUES (?, ?, ?)",
        [name, age, city],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Could not create student." });
            res.status(201).json({
                id: result.insertId,
                name,
                age: Number(age),
                city,
            });
        }
    );
};

exports.apiUpdate = (req, res) => {
    const id = req.params.id;
    const { name, age, city } = req.body || {};
    if (!name || age === undefined || age === "" || !city) {
        return res.status(400).json({ error: "Name, age, and city are required." });
    }

    con.query(
        "UPDATE users SET NAME = ?, AGE = ?, CITY = ? WHERE ID = ?",
        [name, age, city, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Could not update student." });
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Student not found." });
            }
            res.json({ id: Number(id), name, age: Number(age), city });
        }
    );
};

exports.apiDelete = (req, res) => {
    const id = req.params.id;
    con.query("DELETE FROM users WHERE ID = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Could not delete student." });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Student not found." });
        }
        res.status(204).send();
    });
};
