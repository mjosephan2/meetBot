var Config = {
        host: process.env.SQL_HOST,
        port: "3306",
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DATABASE,
        connectionLimit: 50,
        dateStrings : true
};

exports.SQLconfig = {
    users_table : "users",
    invitees_table : "invitees",
    busy_table : "busytime",
    events_table : "events",
    poll_table : "poll",
    poll_date_table : "poll_date",
}

exports.config = Config;