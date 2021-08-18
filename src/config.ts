import dotenv from 'dotenv'
dotenv.config()

export default {
    prefix: '.',
    token: process.env.CLIENT_TOKEN,
    secret: process.env.CLIENT_SECRET,
    owner: '557746795543789568',
    server: {
        id: '869640514088108052',
        logs: '876248207250837555'
    },
    database: {
        uri: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@krowka.wqxzy.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
        params: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }
}
