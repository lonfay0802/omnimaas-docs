# Cherry Studio客户端配置
## Cherry Studio下载地址
官方地址：https://www.cherry-ai.com/

![image.png](../../static/img/image.png)

## 获取API地址和密钥

1. 打开OmniMaas平台获取API地址，可以通过点击“模型广场”中的任意一个模型进入到“模型详情”，可通过模型详情来查API地址.

![cherry_studio_5.png](../../static/img/cherry_studio_5.png)

2. 打开OmniMaaS，点击左侧“账户”-“API Keys”菜单，在该页面完成Key创建并复制key

![cherry_studio_6.png](../../static/img/cherry_studio_6.png)

![cherry_studio_7.png](../../static/img/cherry_studio_7.png)


## 配置步骤

### 进入设置

打开Cherry Studio首页，点击右上角设置

![cherry_studio_1.png](../../static/img/cherry_studio_1.png)

### 配置模型

#### 方案一：直接使用官方提供商模式

在“模型服务”页面找到“阿里云百炼”提供商，将这里的“API密钥”更换为从OmniMaaS平台获取的API_Key，以及将API地址改为：https://api.omnimaas.com即可.

![cherry_studio_2.png](../../static/img/cherry_studio_2.png)


#### 方案二：自定义OmniMaaS集成方式

1. 点击下列的添加按钮，输入"OmniMaaS"提供商名称，并选择对应的提供商类型，这里以“OpenAI”为例：

![cherry_studio_3.png](../../static/img/cherry_studio_3.png)

2. 输入OmniMaaS的API地址和密钥

将这里的“API密钥”更换为从OmniMaaS平台获取的API_Key，以及将API地址改为：https://api.omnimaas.com即可。

![cherry_studio_4.png](../../static/img/cherry_studio_4.png)

3. 添加模型

![cherry_studio_8.png](../../static/img/cherry_studio_8.png)

4. 模型名称填写

![cherry_studio_9.png](../../static/img/cherry_studio_9.png)

这里的模型ID对应的是OmniMaaS平台中“模型广场”-“模型详情”里的模型“模型名称”:

![cherry_studio_10.png](../../static/img/cherry_studio_10.png)

需要注意的是，这里的"分组名称"默认为：default

5. 使用模型

在使用时，只需要选择已经配置好的模型名称即可：

![cherry_studio_11.png](../../static/img/cherry_studio_11.png)