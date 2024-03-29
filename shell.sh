#!/bin/bash

# 定义变量
LOCAL_DIST_RAR="/dist.rar"
SERVER_IP="120.25.232.80"
SERVER_DIR="/usr/onlyAdmin/dist"

# 配置本地SSH免密登录，自行配置
ssh-copy-id -i ~/.ssh/id_rsa.pub root@$SERVER_IP

# 打包项目
npm run build

#把打包dist压缩为rar
rar a $LOCAL_DIST_RAR dist

# 上传打包文件到服务器
scp $LOCAL_DIST_RAR root@$SERVER_IP:$SERVER_DIR

# 登录服务器，解压文件并删除压缩包
ssh root@$SERVER_IP << EOF
    cd $SERVER_DIR
    unrar x $LOCAL_DIST_RAR
    rm $LOCAL_DIST_RAR
EOF

# 重启Nginx服务
ssh root@$SERVER_IP "systemctl restart nginx"
echo "部署完成！"