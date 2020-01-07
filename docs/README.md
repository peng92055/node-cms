# 全栈CMS项目安装和启动

## 初始化数据库
 
- 在mysql数据库中创建相应的数据库
- 数据库配置文件： server/datasources*.json，配置相应的数据库名称/用户名/密码
- 调用以下命令创建数据库
``` 
NODE_ENV=*** node bin/initdb.js
``` 
- 调用以下命令创建初始用户和数据
```
  NODE_ENV=*** INITDATA=true node bin/initdata.js
```

## 启动项目

npm start

或

nodemon server/server.js
