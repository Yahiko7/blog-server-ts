// 'use strict';

import mongoose from 'mongoose';
import config from '../config/index' 
import * as chalk from 'chalk';
import autoIncrement from 'mongoose-auto-increment'

console.log('test--------',config)

mongoose.set('useCreateIndex', true) 
mongoose.set('useFindAndModify', false)
mongoose.connect(config.dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
// mongoose Promise
mongoose.Promise = global.Promise

db.once('open' ,() => {
	console.log(
    chalk.green('🌲 连接数据库成功')
  );
})

db.on('error', function(error) {
    console.error(
      chalk.red('Error in MongoDb connection: ' + error)
    );
    mongoose.disconnect();
});

db.on('close', function() {
    console.log(
      chalk.red('数据库断开，重新连接数据库')
    );
    mongoose.connect(config.dbUrl, {server:{auto_reconnect:true}});
});

// 自增 ID 初始化
autoIncrement.initialize(mongoose.connection)

export default db;
