const db = require("../db/connection");

exports.allUserData = () => {
    let queryAllUserInfo = `SELECT username, name, avatar_url
    FROM users; `
    return db.query(queryAllUserInfo).then(({rows}) => {
        return rows
    })
}

// exports.returnUser = (username) => {
//     let querySingleUser = `SELECT * 
//     FROM users
//     WHERE users.username = $1`
//         return db.query(querySingleUser).then(({rows})=> {
//             return rows
//         });
//       }
