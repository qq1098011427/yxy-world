// import Database from "better-sqlite3";
const Database = require("better-sqlite3");

function createSqlite3 () {
    console.log(111)
    const db = new Database("db.db", { verbose: console.log, nativeBinding: "./node_modules/better-sqlite3/build/Release/better_sqlite3.node" });
}

module.exports = {
    createSqlite3
}
