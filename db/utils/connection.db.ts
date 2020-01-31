import mongoose from "mongoose";
import config from '../../config/index' 

export class DbConnection {
    public static async initConnection() {
        await DbConnection.connect(config.dbUrl);
    }

    public static async connect(connStr: string) {
       return mongoose.connect(
            connStr,
            {useNewUrlParser: true, useUnifiedTopology: true},
        )
            .then(() => {
                console.log(`🌲 连接数据库成功:${connStr}`);
            })
            .catch((error) => {
                console.error("Error connecting to database: ", error);
                return process.exit(1);
            });
    }

    public static setAutoReconnect() {
        mongoose.connection.on("disconnected", () => DbConnection.connect(config.dbUrl));
    }

    public static async disconnect() {
       await mongoose.connection.close();
    }
}
