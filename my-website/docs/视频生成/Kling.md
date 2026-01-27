# Kling（可灵）视频生成

## 概述
OmniMaaS 目前已支持对 Kling（可灵）视频大模型的统一接入与调用。通过本章节提供的接口说明，您可以在同一套 API 下发起视频生成请求，调用 Kling 视频生成接口生成视频。

## 文生视频

### 接口地址
```
POST https://api.omnimaas.com/v1/video/generations
```

### 请求头

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token，格式：`Bearer YOUR_API_KEY` |
| Content-Type | string | 是 | 请求体格式，固定为 `application/json` |

### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| model | string | 是 | - | kling-v2-5-turbo-std, kling-v2-5-turbo-pro, kling-v2-6 |
| prompt | string | 是 | - | 文本提示词，生成视频的文本描述 |
| duration | int | 否 | 5 | 视频时长参数（秒），可选值：5、10 |
| size | string | 否 | 16:9 | 分辨率参数，输出分辨率，格式为宽度x高度,可选值"16:9", "1:1", "9:16" |
| metadata | string | 否 | - | 扩展参数（JSON字符串格式） |

### 请求示例

```bash
curl -X POST https://api.omnimaas.com/v1/video/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kling-v2-6",
    "prompt": "一只可爱的小猫在草地上玩耍",
    "duration": 5,
    "size": "16:9"
  }'
```

## 图生视频

### 接口地址
```
POST https://api.omnimaas.com/v1/video/generations
```

### 请求头

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token，格式：`Bearer YOUR_API_KEY` |
| Content-Type | string | 是 | 请求体格式，固定为 `application/json` |

### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| model | string | 是 | - | kling-v2-5-turbo-std, kling-v2-5-turbo-pro, kling-v2-6|
| prompt | string | 是 | - | 文本提示词，生成视频的文本描述 |
| images | []string | 是 | - | 图片输入（URL/Base64），支持输入一张或多张图片 |
| duration | int | 否 | 5 | 视频时长参数（秒），可选值：5、10 |
| size | string | 否 | 16:9 | 分辨率参数，输出分辨率，格式为宽度x高度,可选值"16:9", "1:1", "9:16" |
| metadata | string | 否 | - | 扩展参数（JSON字符串格式） |

### 请求示例

```bash
curl -X POST https://api.omnimaas.com/v1/video/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kling-v2-6",
    "prompt": "让这张图片动起来，添加自然的运动效果",
    "images": ["https://example.com/image.jpg"],
    "duration": 5
  }'
```

## 响应

### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 视频任务ID |
| object | string | 对象类型，固定为 "video" |
| model | string | 使用的模型名称 |
| created_at | integer | 创建时间戳 |
| status | string | 任务状态（processing: 处理中） |
| progress | integer | 生成进度百分比 |

### 响应示例

```json
{
  "id": "{video_id}",
  "object": "video",
  "model": "kling-v2-6",
  "created_at": 1640995200,
  "status": "processing",
  "progress": 0
}
```

## 查询视频

根据任务 ID 查询视频生成任务的状态和结果

### 接口地址
```
GET https://api.omnimaas.com/v1/video/generations/{task_id}
```

### 请求头

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token，格式：`Bearer YOUR_API_KEY` |

### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| task_id | string | 是 | 视频任务ID |

### 请求示例

```bash
curl https://api.omnimaas.com/v1/video/generations/{video_id} \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### 响应

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 视频任务ID |
| object | string | 对象类型，固定为 "video" |
| model | string | 使用的模型名称 |
| created_at | integer | 创建时间戳 |
| status | string | 任务状态（succeeded: 成功） |
| progress | integer | 生成进度百分比 |
| url | string | 视频下载链接（完成时） |

#### 响应示例

```json
{
  "id": "{video_id}",
  "object": "video",
  "model": "kling-v2-6",
  "created_at": 1640995200,
  "status": "succeeded",
  "progress": 100,
  "url": "https://example.com/video.mp4"
}
```

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
    "model": "kling-v2-6",
    "prompt": "一只可爱的小狗在公园里奔跑"
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
        Model:  "kling-v2-6",
        Prompt: "一只可爱的小狗在公园里奔跑",
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
    model: 'kling-v2-6',
    prompt: '一只可爱的小狗在公园里奔跑'
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
