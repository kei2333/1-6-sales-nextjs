const config = {
    user: 'team6',                    // Azure SQL のユーザー名
    password: 'Password1234',                // パスワード
    server: 'team6-sql-server.mysql.database.azure.com',         // 例: myserver.database.windows.net
    database: 'sales_management',                // データベース名
    options: {
      encrypt: true,                          // Azure SQL では必須
      enableArithAbort: true,
    },
  };
  
  module.exports = config;