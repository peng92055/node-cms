# EXE 管理界面项目

# CMS项目安装和启动

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



## build 流程

### 开发环境
```
grunt build
```

### 测试环境 -- cms.loveqiche.com
```
grunt build:test
```

### 生产环境 -- cms.jingfree.com
```
grunt build:production
```


## fix bug

### 浏览器控制台出现 mOxie is not defined

client/app/bower_components/pulpload/.bower.json文件里添加："main": "js/plupload.full.min.js",


# client中
## EXEAdmin
通用代码，包括布局，和通用组件

## eps EXE Promotion System -- EXE推广平台

### 开发
```
gulp dev:eps //gulp dev:<appname>
```

### 打包
```
gulp build:eps:prod //build:<appname>:<env>
```

## epsadmin EXE Promotion System Admin-- EXE推广平台后台

### 开发
```
gulp dev:epsadmin //gulp dev:<appname>
```

### 打包
```
gulp build:epsadmin:prod //build:<appname>:<env>
```