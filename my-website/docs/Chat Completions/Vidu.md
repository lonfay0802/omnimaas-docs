# 视频生成

## 概述
OmniMaaS 目前已支持对 Sora、Veo、Vidu、Wan、Seedance等 文生视频大模型的统一接入与调用。通过本章节提供的接口说明，您可以在同一套API下发起视频生成请求，屏蔽底层厂商差异，实现参数格式的统一管理与灵活扩展，完成通过文本对话生成视频的场景接入。

注意，调用视频生成模型生成视频时，系统会返回一个任务ID；用户需要轮询状态页面来获取具体视频链接。

## 文生视频

### 支持模型
- Vidu系列
viduq2、viduq1、vidu1.5

其他模型正在上架测试，持续更新中～

### 创建视频

#### 端点

``` 
POST /v1/video/generations
```

#### 请求体

- **model** `string`（必填）
    用于生成视频的模型ID，可选值：`viduq2`、`viduq1`、`vidu1.5`
- **prompt** `string` (必填)
    文本提示词，生成视频的文本描述。字符串长度不能超过2000字符
- **stype** `string` (可选)
    风格，默认值：`general`，可选值：`general`、`anime`  
    注意⚠️：仅在Vidu系列模型下生效
- **duration** `int` (可选)  
    视频时长参数，默认值依据模型而定：
    - viduq2 : 默认5秒，可选：1-10
    - viduq1 : 默认5秒，可选：5
    - vidu1.5 : 默认4秒，可选：4、8
- **seed** `int` (可选)  
    随机种子，当默认不传或者传0时，会使用随机数替代，手动设置则使用手动设置的种子值
- **size** `string` (可选)  
    分辨率参数，默认值依据模型和视频时长而定：
    - viduq2(1-10秒)：默认 720p，可选：540p、720p、1080p
    - viduq1(5秒)：默认 1080p，可选：1080p
    - vidu1.5(4秒)：默认 360p，可选：360p、720p、1080p
    - vidu1.5(8秒)：默认 720p，可选：720p
- **metadata** `string` (可选)
    扩展参数（JSON字符串格式）（如 negative_prompt, style, quality_level 等）
```
其他具体参数可参考官方支持的参数即可，具体地址：
Vidu：https://platform.vidu.cn/docs/text-to-video
```

#### metadata参数说明
metadata参数的作用是传递非Sora特有的参数，例如Vidu的Label、ContentProducer，通义万相的图片URL、水印、智能改写等。如：
```json
{
    "Label": "your_label","ContentProducer": "yourcontentproducer"
}
```

### Vidu请求示例

```curl
curl -X POST -H "Authorization: {your_api_key}" -H "Content-Type: application/json" -d '
{
    "model": "viduq2",
    "style": "general",
    "prompt": "史诗级的鲤鱼跳龙门场景，一条金色巨鲤奋力跃出湍急的瀑布，飞向空中隐约可见的古代巨型石雕龙门。画面聚焦于鲤鱼在空中化作神龙的瞬间，水花四溅，祥云缭绕。",
    "duration": 5,
    "metadata": {
        "seed": 0,
        "resolution": "1080p",
        "movement_amplitude": "auto",
        "bgm": false,
        "payload": "",
        "callback_url": "https://your-callback-url.com/webhook"
    }
}' https://api.omnimaas.com/v1/video/generations
```

## 图生视频

### 支持模型
- Vidu系列
viduq2-pro-fast、viduq2-pro、viduq2-turbo、viduq1、vidu2.0、vidu1.5

其他模型正在上架测试，持续更新中～

### 创建视频

#### 端点

``` 
POST /v1/video/generations
```

#### 请求体

- **model** `string`（必填）  
    用于生成视频的模型ID，可选值：`viduq2`、`viduq1`、`vidu1.5`
- **prompt** `string` (必填)  
    文本提示词，生成视频的文本描述。字符串长度不能超过2000字符
- **images** `[]string` (必填)  
    图片输入（URL/Base64）,仅支持输入一张图片。模型将以此参数中传入的图片为首帧画面来生成视频，支持传入图片 Base64 编码或图片URL（确保可访问）；  
    图片大小不超过 50 MB；
- **stype** `string` (可选)
    风格，默认值：`general`，可选值：`general`、`anime`  
    注意⚠️：仅在Vidu系列模型下生效
- **duration** `int` (可选)  
    视频时长参数，默认值依据模型而定：
    - viduq2 : 默认5秒，可选：1-10
    - viduq1 : 默认5秒，可选：5
    - vidu1.5 : 默认4秒，可选：4、8
- **seed** `int` (可选)  
    随机种子，当默认不传或者传0时，会使用随机数替代，手动设置则使用手动设置的种子值
- **size** `string` (可选)  
    分辨率参数，默认值依据模型和视频时长而定：
    - viduq2-pro-fast 1-10秒：默认 720p，可选：720p、1080p
    - viduq2-pro 1-10秒：默认 720p，可选：540p、720p、1080p
    - viduq2-turbo 1-10秒：默认 720p，可选：540p、720p、1080p
    - viduq1 5秒：默认 1080p，可选：1080p
    - viduq1-classic 5秒：默认 1080p，可选：1080p
    - vidu2.0 4秒：默认 360p，可选：360p、720p、1080p
    - vidu2.0 8秒：默认 720p，可选：720p
    - vidu1.5 4秒：默认 360p，可选：360p、720p、1080p
    - vidu1.5 8秒：默认 720p，可选：720p
- **metadata** `string` (可选)
    扩展参数（JSON字符串格式）（如 negative_prompt, style, quality_level 等）
```
其他具体参数可参考官方支持的参数即可，具体地址：
Vidu：https://platform.vidu.cn/docs/text-to-video
```

#### metadata参数说明
metadata参数的作用是传递非Sora特有的参数，例如Vidu的Label、ContentProducer，通义万相的图片URL、水印、智能改写等。如：
```json
{
    "Label": "your_label","ContentProducer": "yourcontentproducer"
}
```

### Vidu请求示例

```curl
curl -X POST -H "Authorization: {your_api_key}" -H "Content-Type: application/json" -d '
{
    "model": "viduq2-pro-fast",
    "prompt": "史诗级的鲤鱼跳龙门场景，一条金色巨鲤奋力跃出湍急的瀑布，飞向空中隐约可见的古代巨型石雕龙门。画面聚焦于鲤鱼在空中化作神龙的瞬间，水花四溅，祥云缭绕。",
    "images": ["data:image/png;base64,{base64_encode}"]
}' https://api.omnimaas.com/v1/video/generations
```

## 首尾桢生视频

### 支持模型
- Vidu系列
viduq2-pro-fast、viduq2-pro、viduq2-turbo、viduq1、vidu2.0、vidu1.5

其他模型正在上架测试，持续更新中～

### 创建视频

#### 端点

``` 
POST /v1/video/generations
```

#### 请求体

- **model** `string`（必填）  
    用于生成视频的模型ID，可选值：`viduq2`、`viduq1`、`vidu1.5`
- **prompt** `string` (必填)  
    文本提示词，生成视频的文本描述。字符串长度不能超过2000字符
- **images** `[]string` (必填)  
    图片输入（URL/Base64）,支持输入两张图，上传的第一张图片视作首帧图，第二张图片视作尾帧图，模型将以此参数中传入的图片来生成视频.  
    支持传入图片 Base64 编码或图片URL（确保可访问）；  
    图片大小不超过 50 MB；
- **stype** `string` (可选)
    风格，默认值：`general`，可选值：`general`、`anime`   
    注意⚠️：仅在Vidu系列模型下生效
- **duration** `int` (可选)  
    视频时长参数，默认值依据模型而定：
    - viduq2 : 默认5秒，可选：1-10
    - viduq1 : 默认5秒，可选：5
    - vidu1.5 : 默认4秒，可选：4、8
- **seed** `int` (可选)  
    随机种子，当默认不传或者传0时，会使用随机数替代，手动设置则使用手动设置的种子值
- **size** `string` (可选)  
    分辨率参数，默认值依据模型和视频时长而定：
    - viduq2-pro-fast 1-8秒：默认 720p，可选：720p、1080p
    - viduq2-pro 1-8秒：默认 720p，可选：540p、720p、1080p
    - viduq2-turbo 1-8秒：默认 720p，可选：540p、720p、1080p
    - viduq1 和 viduq1-classic 5秒：默认 1080p，可选：1080p
    - vidu2.0 4秒：默认 360p，可选：360p、720p、1080p
    - vidu2.0 8秒：默认 720p，可选：720p
    - vidu1.5 4秒：默认 360p，可选：360p、720p、1080p
    - vidu1.5 8秒：默认 720p，可选：720p
- **metadata** `string` (可选)
    扩展参数（JSON字符串格式）（如 negative_prompt, style, quality_level 等）
```
其他具体参数可参考官方支持的参数即可，具体地址：
Vidu：https://platform.vidu.cn/docs/text-to-video
```

#### metadata参数说明
metadata参数的作用是传递非Sora特有的参数，例如Vidu的Label、ContentProducer，通义万相的图片URL、水印、智能改写等。如：
```json
{
    "Label": "your_label","ContentProducer": "yourcontentproducer"
}
```

### Vidu请求示例

```curl
curl -X POST -H "Authorization: {your_api_key}" -H "Content-Type: application/json" -d '
{
    "model": "viduq2-pro-fast",
    "prompt": "史诗级的鲤鱼跳龙门场景，一条金色巨鲤奋力跃出湍急的瀑布，飞向空中隐约可见的古代巨型石雕龙门。画面聚焦于鲤鱼在空中化作神龙的瞬间，水花四溅，祥云缭绕。",
    "images": ["data:image/png;base64,{base64_encode}", "data:image/png;base64,{base64_encode}"]
}' https://api.omnimaas.com/v1/video/generations
```


## 参考生视频

### 支持模型
- Vidu系列
viduq2、viduq1、vidu2.0、vidu1.5

其他模型正在上架测试，持续更新中～

### 创建视频

#### 端点

``` 
POST /v1/video/generations
```

#### 请求体

- **model** `string`（必填）  
    用于生成视频的模型ID，可选值：`viduq2`、`viduq1`、`vidu1.5`
- **prompt** `string` (必填)  
    文本提示词，生成视频的文本描述。字符串长度不能超过2000字符
- **stype** `string` (可选)
    风格，默认值：`general`，可选值：`general`、`anime`   
    注意⚠️：仅在Vidu系列模型下生效
- **duration** `int` (可选)  
    视频时长参数，默认值依据模型而定：
    - viduq2 : 默认5秒，可选：1-10
    - viduq1 : 默认5秒，可选：5
    - vidu1.5 : 默认4秒，可选：4、8
- **seed** `int` (可选)  
    随机种子，当默认不传或者传0时，会使用随机数替代，手动设置则使用手动设置的种子值
- **size** `string` (可选)  
    分辨率参数，默认值依据模型和视频时长而定：
    viduq2 （1-10秒）：默认 720p, 可选：540p、720p、1080p
    viduq1 （5秒）：默认 1080p, 可选：1080p
    vidu2.0 （4秒）：默认 360p, 可选：360p、720p
    vidu1.5（4秒）：默认 360p，可选：360p、720p、1080p
    vidu1.5（8秒）：默认 720p，可选：720p
- **metadata** `string`  
    扩展参数（JSON字符串格式）（如 negative_prompt, style, quality_level,subjects 等）   
    ⚠️注意：参考生图场景必须传以下参数  
    - **subjects** `[]Subject` (必填)   
        - **id** `string` (必须)  
        主体id，后续生成时可以通过@主体id的方式使用  
        - **images** `[]string` (必须)   
        该主体对应的图片url，每个主体最多支持3张图片  
        - **voice_id** `string` (可选)  
        音色ID用来决定视频中的声音音色，为空时系统会自动推荐，可参考Vidu官方银色列表
```
其他具体参数可参考官方支持的参数即可，具体地址：
Vidu：https://platform.vidu.cn/docs/text-to-video
```

#### metadata参数说明
metadata参数的作用是传递非Sora特有的参数，例如Vidu的Label、ContentProducer，通义万相的图片URL、水印、智能改写等。如：
```json
{
    "Label": "your_label","ContentProducer": "yourcontentproducer"
}
```

### Vidu请求示例

```curl
curl -X POST -H "Authorization: {your_api_key}" -H "Content-Type: application/json" -d '
{
    "model": "viduq1",
    "prompt": "参考@1生成视频，@2和@3也需要参考",
    "metadata": {
        "subjects": [
            {
                "id": "1",
                "images": ["https://h2.inkwai.com/bs2/upload-ylab-stunt/se/ai_portal_queue_mmu_image_upscale_aiweb/3214b798-e1b4-4b00-b7af-72b5b0417420_raw_image_0.jpg"]
            },
            {
                "id": "2",
                "images": ["https://h2.inkwai.com/bs2/upload-ylab-stunt/se/ai_portal_queue_mmu_image_upscale_aiweb/3214b798-e1b4-4b00-b7af-72b5b0417420_raw_image_0.jpg"]
            },
            {
                "id": "3",
                "images": ["https://h2.inkwai.com/bs2/upload-ylab-stunt/se/ai_portal_queue_mmu_image_upscale_aiweb/3214b798-e1b4-4b00-b7af-72b5b0417420_raw_image_0.jpg"]
            }
        ]
    }
}' https://api.omnimaas.com/v1/video/generations
```


## 查询视频

根据任务ID查询视频生成任务的状态和进度。

### API端点
```
GET /v1/video/generations/{task_id}
```

### 路径参数
- **task_id** `string` (必填)
    任务id

### 请求示例
``` curl
curl 'https://api.omnimaas.com/v1/video/generations/{task_id}'
```

### 响应格式
#### 200 响应成功

- **code** `string` (必填)
    success
- **message** `string` (可选)
    默认为''
- **data** `object` (必填)
    相应结果对象内容
    - **error** `string` (可选)
        错误信息，默认为null
    - **format** `string` (必填)
        视频格式，默认为mp4
    - **metadata** `object` (可选)
        元数据，默认为null
    - **status** `string` (必填)
        任务状态，成功为`succeeded`
    - **task_id** `string` (必填)
        任务id，此次任务id
    - **url** `string` (必填)
        视频地址url

#### 响应示例
```
{
    "code": "success",
    "message": "",
    "data": {
        "error": null,
        "format": "mp4",
        "metadata": null,
        "status": "succeeded",
        "task_id": "897408604372475904",
        "url": "string"
    }
}
```

#### 400 请求参数错误

- **code** `string` (必填)
    null
- **message** `string` (可选)
    错误信息
- **param** `string` (可选)
    参数信息
- **type** `string` (可选)
    错误类型


#### 500 服务器内部错误

- **code** `string` (必填)
    null
- **message** `string` (可选)
    错误信息
- **param** `string` (可选)
    参数信息
- **type** `string` (可选)
    错误类型

