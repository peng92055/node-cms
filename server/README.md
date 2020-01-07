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

### 测试环境 --
```
grunt build:test
```

### 生产环境 -- 
```
grunt build:production
```


## fix bug

### 浏览器控制台出现 mOxie is not defined

client/app/bower_components/pulpload/.bower.json文件里添加："main": "js/plupload.full.min.js",


# client中
通用代码，包括布局，和通用组件


### 开发
```
gulp dev:cms //gulp dev:<appname>
```

### 打包
```
gulp build:cms:prod //build:<appname>:<env>
```


### 开发
```
gulp dev:cmsadmin //gulp dev:<appname>
```

### 打包
```
gulp build:cmsadmin:prod //build:<appname>:<env>
```