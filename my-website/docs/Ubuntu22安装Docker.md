# Ubuntu 22 安装 Docker 教程

## 概述

本教程将指导您在 Ubuntu 22.04 LTS 系统上安装 Docker Engine 和 Docker Compose。Docker 是一个开源的容器化平台，允许开发者将应用程序及其依赖项打包到轻量级、可移植的容器中。

## 前置要求

- Ubuntu 22.04 LTS (Jammy Jellyfish)
- 具有 sudo 权限的用户账户
- 稳定的网络连接

## 方法一：使用官方仓库安装（推荐）

### 步骤 1：卸载旧版本（如果存在）

```bash
sudo apt-get remove docker docker-engine docker.io containerd runc
```

### 步骤 2：更新软件包索引

```bash
sudo apt-get update
```

### 步骤 3：安装必要的依赖包

```bash
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

### 步骤 4：添加 Docker 官方 GPG 密钥

```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

### 步骤 5：设置 Docker 仓库

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### 步骤 6：安装 Docker Engine

```bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 步骤 7：验证安装

```bash
sudo docker run hello-world
```

如果看到 "Hello from Docker!" 消息，说明安装成功。

## 方法二：使用便捷脚本安装（快速但不推荐生产环境）

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

## 配置 Docker（可选但推荐）

### 1. 将当前用户添加到 docker 组（避免每次使用 sudo）

```bash
sudo usermod -aG docker $USER
```

**注意**：需要重新登录或运行以下命令使更改生效：

```bash
newgrp docker
```

### 2. 配置 Docker 开机自启

```bash
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
```

### 3. 启动 Docker 服务

```bash
sudo systemctl start docker
```

### 4. 检查 Docker 服务状态

```bash
sudo systemctl status docker
```

## 安装 Docker Compose

### 方法一：使用 Docker Compose Plugin（推荐，Docker 2.0+）

Docker Compose Plugin 已在上述安装步骤中自动安装。使用方式：

```bash
docker compose version
```

使用示例：

```bash
docker compose up -d
docker compose down
```

### 方法二：独立安装 Docker Compose V2

```bash
# 下载最新版本（替换版本号）
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 添加执行权限
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

## 验证安装

### 检查 Docker 版本

```bash
docker --version
docker version
```

### 检查 Docker Compose 版本

```bash
docker compose version
# 或（如果使用独立安装）
docker-compose --version
```

### 运行测试容器

```bash
docker run hello-world
```

### 查看 Docker 信息

```bash
docker info
```

## 常用 Docker 命令

### 镜像管理

```bash
# 搜索镜像
docker search ubuntu

# 拉取镜像
docker pull ubuntu:22.04

# 列出本地镜像
docker images

# 删除镜像
docker rmi <image_id>

# 构建镜像
docker build -t myimage:tag .
```

### 容器管理

```bash
# 运行容器
docker run -d --name mycontainer ubuntu:22.04

# 列出运行中的容器
docker ps

# 列出所有容器（包括停止的）
docker ps -a

# 启动容器
docker start <container_id>

# 停止容器
docker stop <container_id>

# 删除容器
docker rm <container_id>

# 查看容器日志
docker logs <container_id>

# 进入容器
docker exec -it <container_id> /bin/bash
```

### Docker Compose 命令

```bash
# 启动服务
docker compose up -d

# 停止服务
docker compose down

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs

# 重新构建并启动
docker compose up -d --build
```

## 卸载 Docker（如需要）

### 卸载 Docker Engine、CLI、Containerd 和 Docker Compose

```bash
sudo apt-get purge docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 删除镜像、容器、卷和自定义配置文件
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
```

## 故障排查

### 问题 1：权限被拒绝

**错误信息**：`Got permission denied while trying to connect to the Docker daemon socket`

**解决方案**：
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### 问题 2：无法连接到 Docker 守护进程

**错误信息**：`Cannot connect to the Docker daemon`

**解决方案**：
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### 问题 3：镜像拉取失败

**解决方案**：
- 检查网络连接
- 配置 Docker 镜像加速器（见下方）

## 配置 Docker 镜像加速器（可选）

### 配置阿里云镜像加速器

1. 登录 [阿里云容器镜像服务](https://cr.console.aliyun.com/)
2. 获取专属加速地址
3. 编辑或创建 `/etc/docker/daemon.json`：

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://your-mirror.mirror.aliyuncs.com"]
}
EOF
```

4. 重启 Docker 服务：

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 其他常用镜像加速器

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
```

## 安全建议

1. **不要在生产环境中使用 root 用户运行 Docker**
   - 使用非 root 用户并添加到 docker 组

2. **定期更新 Docker**
   ```bash
   sudo apt-get update
   sudo apt-get upgrade docker-ce docker-ce-cli containerd.io
   ```

3. **限制容器资源**
   - 使用 `--memory` 和 `--cpus` 限制资源使用

4. **使用只读文件系统**
   ```bash
   docker run --read-only ...
   ```

5. **扫描镜像漏洞**
   ```bash
   docker scan <image_name>
   ```

## 参考资源

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Ubuntu Docker 安装指南](https://docs.docker.com/engine/install/ubuntu/)

## 总结

完成以上步骤后，您已成功在 Ubuntu 22.04 上安装了 Docker 和 Docker Compose。现在可以开始使用 Docker 来容器化您的应用程序了！

如有任何问题，请参考 Docker 官方文档或社区支持。

