module.exports = {
    user            :   process.env.NODE_ORACLEDB_USER||'suzi',
    password        :   process.env.NODE_ORACLEDB_PASSWORD||'a123',
    connectString   :   process.env.NODE_ORACLEDB_CONNECTIONSTRING||'localhost:1521/xe',
    externalAuth    :   process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
}