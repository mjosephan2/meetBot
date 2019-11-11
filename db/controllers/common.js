var init = require('./init')

exports.getGenericData = function (rowType, table, fieldsParam, cond) {
    var fields = fieldsParam === null ? '*' : fieldsParam;
    var where = cond == null ? '' : "WHERE " + cond;
    var sqlCommand = "SELECT " + fields + " FROM "
        + (table + " " + where);
    console.info("sqlCommand=" + sqlCommand);
    return new Promise(function (resolve, reject) {
        init.pool.query(sqlCommand, function (err, rs) {
            if (err) {
                return reject(err);
            }
            if (rs.length === 0)
                reject(new Error(rowType + " not found"));
            console.info("Db data: " + JSON.stringify(rs));
            return resolve(rs);
        });
    });
};

exports.insertGenericData = function(rowType, table, data) {
    var sqlCommand = `INSERT INTO ${table} SET ?`
    console.info("sqlCommand=" + sqlCommand + data);
    return new Promise(function (resolve,reject){
        init.pool.query(sqlCommand,data,(err,rs)=>{
            if (err) {
                return reject(err);
            }
            console.info(`Db data: ${JSON.stringify(rs)}`);
            return resolve(rs);
        })
    })
}

exports.insertValueToArray = (array,value) => {
    for (i=0;i<array.length;i++){
        array[i].splice(0,0,value)
    }
}

exports.insertArrayToArray = (array,array2) => {
    for (i=0;i<array.length;i++){
        for (j=0;j<array2.length;j++){
            array[i].splice(j,0,array2[j].toString())
        }
    }
}

exports.addQueryCond = (obj)=>{
    if (obj){
        var str = []
        Object.entries(obj).forEach(([k,v])=>{
            str.push(`${k}=${v}`)
        })
        str = str.join(" AND ")
        return " AND " + str
    }
}

exports.conv1Dto2D = (arr,len)=>{
    if (len) len = 1;
    var newArr = [];
    while(arr.length) newArr.push(arr.splice(0,len));
    return newArr;
}