// import Database from "better-sqlite3";
const Database = require("better-sqlite3");
const fs = require("fs");

function createSqlite3 () {
    // 如果./src/common/db.db不存在，就创建一个
    if (!fs.existsSync("./src/common/db.db")) {
        const db = new Database("db.db", { verbose: console.log, nativeBinding: "./node_modules/better-sqlite3/build/Release/better_sqlite3.node" });
        // 由于直接创建会在根目录下创建，所以需要移动到./src/common/db.db
        fs.renameSync("./db.db", "./src/common/db.db");
    }
}

module.exports = {
    createSqlite3
}
