# auto-scripts 

一些简单的脚本记录

## 使用  

1. `yarn`  
2. `yarn add pm2 -g`  
3. `yarn start`   

## 设置开机自启  
1. `yarn save`  
2. `yarn startup`  
3. 复制`2`中的提示命令到**命令行**中执行。  

## 脚本  

### auto-sign-v2free  
自动签到`v2free`


## 可能的问题  

### 关于试用到的账密  
所有的账密信息都可以放在项目根目录的`.env.json`文件中，然后脚本中使用`./src/utils/tool.js`里的`getEvnData`方法获取。  
关于脚本使用的账密的字段名称，直接搜索`getEvnData`就能找到他们用的那些字段名称。  

### puppeteer安装问题  
如果安装失败，就先执行`export PUPPETEER_SKIP_DOWNLOAD='true'`  
安装成功后，出现`Could not find Chrome (ver. 117.0.5938.88).`类似问题的，再执行`node node_modules/puppeteer/install.js`  

### 为什么我指定了puppeteer的版本  
因为gs的电脑太辣鸡了，高版本的他根本运行不起来。(`へ´*)ノ  