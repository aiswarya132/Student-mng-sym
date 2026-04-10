const mysql = require("mysql2");

const con = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

exports.view = (req, res) => {

    // // Check Database Connection
    con.getConnection((err, connection) => {
        if (err) throw err
        connection.query("select* from users", (err, rows) => {
            connection.release();
            if (!err) {
                console.log("Good");
                res.render("home", { rows });
            } else {
                console.log("Error in Listening data" + err);

            }
        })
    })
}




exports.adduser = (req, res) => {
    res.render("adduser");
}

exports.save = (req, res) => {
    con.getConnection((err, connection) => {
        if (err) throw err;

        const { name, age, city } = req.body;

        connection.query(
            "INSERT INTO users (NAME,AGE,CITY) values (?,?,?)",
            [name, age, city],
            (err, rows) => {
                connection.release();
                if (!err) {
                    res.render("adduser", { msg: "User Details Added Success" });
                } else {
                    console.log("Error in Listening data" + err);
                }
            })
    })
}

exports.edituser = (req, res) => {

    con.getConnection((err, connection) => {
        if (err) throw err

        //Get ID from URL
        let id=req.params.id;
        connection.query("select* from users where id=?",[id], (err, rows) => {
            connection.release();
            if (!err) {
                console.log("Good");
                res.render("edituser", { user:rows[0] });
            } else {
                console.log("Error in Listening data" + err);

            }
        })
    })

}

exports.edit = (req, res) => {
    con.getConnection((err, connection) => {
        if (err) throw err;

        const { name, age, city } = req.body;
         
        let id=req.params.id;

        connection.query
            ("UPDATE users set NAME=?,AGE=?,CITY=? where ID=?",
            [name, age, city,id],
            (err, rows) => {
                connection.release();
                if (!err) {
                    //res.redirect("/")
                    res.render("edituser", { msg: "User Details Updated Success" });
                } else {
                    console.log("Error in Updating data" + err);
                }
            })
    })
}

exports.delete=(req,res)=>{
    con.getConnection((err,connection)=>{
        if(err) throw err
        //Get UD from URL
        let id=req.params.id;
        connection.query("delete from users where id=?", [id],
            (err,rows)=>{
                connection.release();
                if(!err) {
                    res.redirect("/");
                }else{
                    console.log(err);
                    
                }
            }
        )
    })
}

// add search
exports.view = (req, res) => {
    const search = req.query.search;
    let sql = "SELECT * FROM users";
    let params = [];

    if(search){
        sql += " WHERE NAME LIKE ? OR CITY LIKE ?";
        params.push(`%${search}%`, `%${search}%`);
    }

    con.query(sql, params, (err, rows)=>{
        if(err) throw err;
        res.render("home", { rows, search });
    });
}



// pagination
// exports.view = (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = 10;
//     const offset = (page - 1) * limit;

//     const search = req.query.search;
//     let sqlCount = "SELECT COUNT(*) as count FROM users";
//     let sqlData = "SELECT * FROM users";
//     let params = [];

//     if(search){
//         sqlCount += " WHERE NAME LIKE ? OR CITY LIKE ?";
//         sqlData += " WHERE NAME LIKE ? OR CITY LIKE ?";
//         params.push(`%${search}%`, `%${search}%`);
//     }

//     sqlData += " LIMIT ? OFFSET ?";
//     params.push(limit, offset);

//     // Get total count
//     con.query(sqlCount, search ? [`%${search}%`,`%${search}%`] : [], (err, countResult)=>{
//         if(err) throw err;
//         const totalRows = countResult[0].count;
//         const totalPages = Math.ceil(totalRows/limit);

//         // Get data
//         con.query(sqlData, params, (err, rows)=>{
//             if(err) throw err;
//             res.render("home", { 
//                 rows, 
//                 currentPage: page, 
//                 totalPages,
//                 search
//             });
//         });
//     });
// }


