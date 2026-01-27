# Vidu 视频生成

## 概述
OmniMaaS 目前已支持对 Sora、Veo、Vidu、Wan、Seedance等 文生视频大模型的统一接入与调用。通过本章节提供的接口说明，您可以在同一套API下发起视频生成请求，屏蔽底层厂商差异，实现参数格式的统一管理与灵活扩展，完成通过文本对话生成视频的场景接入。

注意，调用视频生成模型生成视频时，系统会返回一个任务ID；用户需要轮询状态页面来获取具体视频链接。

## 文生视频

### 支持模型
- **Vidu系列**: viduq2、viduq1、vidu1.5

其他模型正在上架测试，持续更新中～

### 创建视频

#### 接口地址
```
POST https://api.omnimaas.com/v1/video/generations
```

#### 请求头

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token，格式：`Bearer YOUR_API_KEY` |
| Content-Type | string | 是 | 请求体格式，固定为 `application/json` |

#### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| model | string | 是 | - | 用于生成视频的模型ID，可选值：viduq2、viduq1、vidu1.5 |
| prompt | string | 是 | - | 文本提示词，生成视频的文本描述。字符串长度不能超过2000字符 |
| stype | string | 否 | general | 风格，可选值：general、anime。注意⚠️：仅在Vidu系列模型下生效 |
| duration | int | 否 | 依据模型 | 视频时长参数。viduq2默认5秒，可选1-10；viduq1默认5秒，可选5；vidu1.5默认4秒，可选4、8 |
| seed | int | 否 | 0 | 随机种子，当默认不传或者传0时，会使用随机数替代，手动设置则使用手动设置的种子值 |
| size | string | 否 | 依据模型 | 分辨率参数。viduq2(1-10秒)默认720p，可选540p、720p、1080p；viduq1(5秒)默认1080p；vidu1.5(4秒)默认360p，可选360p、720p、1080p；vidu1.5(8秒)默认720p |
| metadata | string | 否 | - | 扩展参数（JSON字符串格式），如 negative_prompt, style, quality_level 等 |
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

#### 请求示例

```bash
curl -X POST https://api.omnimaas.com/v1/video/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "viduq2",
    "stype": "general",
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
}'
```

## 图生视频

### 支持模型
- **Vidu系列**: viduq2-pro-fast、viduq2-pro、viduq2-turbo、viduq1、vidu2.0、vidu1.5

其他模型正在上架测试，持续更新中～

### 创建视频

#### 接口地址
```
POST https://api.omnimaas.com/v1/video/generations
```

#### 请求头

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token，格式：`Bearer YOUR_API_KEY` |
| Content-Type | string | 是 | 请求体格式，固定为 `application/json` |

#### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| model | string | 是 | - | 用于生成视频的模型ID，可选值：viduq2、viduq1、vidu1.5 |
| prompt | string | 是 | - | 文本提示词，生成视频的文本描述。字符串长度不能超过2000字符 |
| images | []string | 是 | - | 图片输入（URL/Base64），仅支持输入一张图片。模型将以此参数中传入的图片为首帧画面来生成视频，支持传入图片Base64编码或图片URL（确保可访问）；图片大小不超过50MB |
| stype | string | 否 | general | 风格，可选值：general、anime。注意⚠️：仅在Vidu系列模型下生效 |
| duration | int | 否 | 依据模型 | 视频时长参数。viduq2默认5秒，可选1-10；viduq1默认5秒，可选5；vidu1.5默认4秒，可选4、8 |
| seed | int | 否 | 0 | 随机种子，当默认不传或者传0时，会使用随机数替代，手动设置则使用手动设置的种子值 |
| size | string | 否 | 依据模型 | 分辨率参数。viduq2-pro-fast(1-10秒)默认720p，可选720p、1080p；viduq2-pro(1-10秒)默认720p，可选540p、720p、1080p；viduq2-turbo(1-10秒)默认720p，可选540p、720p、1080p；viduq1(5秒)默认1080p；viduq1-classic(5秒)默认1080p；vidu2.0(4秒)默认360p，可选360p、720p、1080p；vidu2.0(8秒)默认720p；vidu1.5(4秒)默认360p，可选360p、720p、1080p；vidu1.5(8秒)默认720p |
| metadata | string | 否 | - | 扩展参数（JSON字符串格式），如 negative_prompt, style, quality_level 等 |
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

#### 请求示例

```bash
curl -X POST https://api.omnimaas.com/v1/video/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "viduq2-pro-fast",
    "prompt": "史诗级的鲤鱼跳龙门场景，一条金色巨鲤奋力跃出湍急的瀑布，飞向空中隐约可见的古代巨型石雕龙门。画面聚焦于鲤鱼在空中化作神龙的瞬间，水花四溅，祥云缭绕。",
    "images": ["data:image/png;base64,{base64_encode}"]
}'
```

## 首尾桢生视频

### 支持模型
- **Vidu系列**: viduq2-pro-fast、viduq2-pro、viduq2-turbo、viduq1、vidu2.0、vidu1.5

其他模型正在上架测试，持续更新中～

### 创建视频

#### 接口地址
```
POST https://api.omnimaas.com/v1/video/generations
```

#### 请求头

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token，格式：`Bearer YOUR_API_KEY` |
| Content-Type | string | 是 | 请求体格式，固定为 `application/json` |

#### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| model | string | 是 | - | 用于生成视频的模型ID，可选值：viduq2、viduq1、vidu1.5 |
| prompt | string | 是 | - | 文本提示词，生成视频的文本描述。字符串长度不能超过2000字符 |
| images | []string | 是 | - | 图片输入（URL/Base64），支持输入两张图，上传的第一张图片视作首帧图，第二张图片视作尾帧图，模型将以此参数中传入的图片来生成视频。支持传入图片Base64编码或图片URL（确保可访问）；图片大小不超过50MB |
| stype | string | 否 | general | 风格，可选值：general、anime。注意⚠️：仅在Vidu系列模型下生效 |
| duration | int | 否 | 依据模型 | 视频时长参数。viduq2默认5秒，可选1-10；viduq1默认5秒，可选5；vidu1.5默认4秒，可选4、8 |
| seed | int | 否 | 0 | 随机种子，当默认不传或者传0时，会使用随机数替代，手动设置则使用手动设置的种子值 |
| size | string | 否 | 依据模型 | 分辨率参数。viduq2-pro-fast(1-8秒)默认720p，可选720p、1080p；viduq2-pro(1-8秒)默认720p，可选540p、720p、1080p；viduq2-turbo(1-8秒)默认720p，可选540p、720p、1080p；viduq1和viduq1-classic(5秒)默认1080p；vidu2.0(4秒)默认360p，可选360p、720p、1080p；vidu2.0(8秒)默认720p；vidu1.5(4秒)默认360p，可选360p、720p、1080p；vidu1.5(8秒)默认720p |
| metadata | string | 否 | - | 扩展参数（JSON字符串格式），如 negative_prompt, style, quality_level 等 |
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

#### 请求示例

```bash
curl -X POST https://api.omnimaas.com/v1/video/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "viduq2-pro-fast",
    "prompt": "史诗级的鲤鱼跳龙门场景，一条金色巨鲤奋力跃出湍急的瀑布，飞向空中隐约可见的古代巨型石雕龙门。画面聚焦于鲤鱼在空中化作神龙的瞬间，水花四溅，祥云缭绕。",
    "images": ["data:image/png;base64,{base64_encode}", "data:image/png;base64,{base64_encode}"]
}'
```


## 参考生视频

### 支持模型
- **Vidu系列**: viduq2、viduq1、vidu2.0、vidu1.5

其他模型正在上架测试，持续更新中～

### 创建视频

#### 接口地址
```
POST https://api.omnimaas.com/v1/video/generations
```

#### 请求头

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token，格式：`Bearer YOUR_API_KEY` |
| Content-Type | string | 是 | 请求体格式，固定为 `application/json` |

#### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| model | string | 是 | - | 用于生成视频的模型ID，可选值：viduq2、viduq1、vidu1.5 |
| prompt | string | 是 | - | 文本提示词，生成视频的文本描述。字符串长度不能超过2000字符 |
| stype | string | 否 | general | 风格，可选值：general、anime。注意⚠️：仅在Vidu系列模型下生效 |
| duration | int | 否 | 依据模型 | 视频时长参数。viduq2默认5秒，可选1-10；viduq1默认5秒，可选5；vidu1.5默认4秒，可选4、8 |
| seed | int | 否 | 0 | 随机种子，当默认不传或者传0时，会使用随机数替代，手动设置则使用手动设置的种子值 |
| size | string | 否 | 依据模型 | 分辨率参数。viduq2(1-10秒)默认720p，可选540p、720p、1080p；viduq1(5秒)默认1080p；vidu2.0(4秒)默认360p，可选360p、720p；vidu1.5(4秒)默认360p，可选360p、720p、1080p；vidu1.5(8秒)默认720p |
| metadata | string | 否 | - | 扩展参数（JSON字符串格式），如negative_prompt、style、quality_level、subjects等。⚠️注意：参考生图场景必须传subjects参数，包含id(主体id)、images(图片url数组，最多3张)、voice_id(音色ID，可选) |
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

#### 请求示例

```bash
curl -X POST https://api.omnimaas.com/v1/video/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
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
}'
```


## 查询视频

根据任务ID查询视频生成任务的状态和进度。

### Endpoint
```
GET https://api.omnimaas.com/v1/video/generations/{task_id}
```

### Headers

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token，格式：`Bearer YOUR_API_KEY` |

### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| task_id | string | 是 | 任务id |

### 请求示例

```bash
curl https://api.omnimaas.com/v1/video/generations/{task_id} \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### 响应

#### 响应参数 (200 响应成功)

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | string | 响应代码，成功为success |
| message | string | 响应消息，默认为空字符串 |
| data | object | 响应结果对象内容 |
| data.error | string | 错误信息，默认为null |
| data.format | string | 视频格式，默认为mp4 |
| data.metadata | object | 元数据，默认为null |
| data.status | string | 任务状态，成功为succeeded |
| data.task_id | string | 任务id |
| data.url | string | 视频地址url |

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

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | string | 错误代码，为null |
| message | string | 错误信息 |
| param | string | 参数信息 |
| type | string | 错误类型 |


#### 500 服务器内部错误

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | string | 错误代码，为null |
| message | string | 错误信息 |
| param | string | 参数信息 |
| type | string | 错误类型 |


## 代码示例

### Python 示例

```python
import requests

url = 'https://api.omnimaas.com/v1/video/generations'

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
}

data = {
    "model": "vidu1.5",
    "prompt": "一只可爱的小猫在草地上玩耍"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(f"任务ID: {result['id']}")
print(f"状态: {result['status']}")
```

### Go 示例

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

type VideoRequest struct {
    Model  string `json:"model"`
    Prompt string `json:"prompt"`
}

func main() {
    reqBody := VideoRequest{
        Model:  "vidu1.5",
        Prompt: "一只可爱的小猫在草地上玩耍",
    }

    jsonData, _ := json.Marshal(reqBody)
    req, _ := http.NewRequest("POST",
        "https://api.omnimaas.com/v1/video/generations",
        bytes.NewBuffer(jsonData))
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "Bearer YOUR_API_KEY")

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))
}
```

### Node.js 示例

```javascript
const axios = require('axios');

const url = 'https://api.omnimaas.com/v1/video/generations';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
};

const data = {
    model: 'vidu1.5',
    prompt: '一只可爱的小猫在草地上玩耍'
};

axios.post(url, data, { headers })
    .then(response => {
        console.log('任务ID:', response.data.id);
        console.log('状态:', response.data.status);
    })
    .catch(error => {
        console.error('请求失败:', error.message);
    });
```
