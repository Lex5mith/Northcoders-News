const db = require("../db/connection");

exports.allUserData = () => {
    let queryAllUserInfo = `SELECT username, name, avatar_url
    FROM users; `
    return db.query(queryAllUserInfo).then(({rows}) => {
        return rows
    })
}