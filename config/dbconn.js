const mongo = require('mongodb')

const connMongoDB = () => {

    const db = new mongo.Db(
        'got',
        new mongo.Server(
            'localhost',
            27017
        )
    )

    return db

}

module.exports = () => {
    return connMongoDB
}