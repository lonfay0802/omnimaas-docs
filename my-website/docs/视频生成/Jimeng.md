# Jimeng（即梦）视频生成

## 概述
OmniMaaS 目前已支持对 Jimeng（即梦）视频大模型的统一接入与调用。通过本章节提供的接口说明，您可以在同一套 API 下发起视频生成请求，调用 Jimeng 视频生成接口生成视频。

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
| model | string | 是 | - | doubao-seedance-1-0-pro-250528,  doubao-seedance-1-0-pro-fast-251015|
| prompt | string | 是 | - | 文本提示词，生成视频的文本描述 |
| duration | int | 否 | 5 | 视频时长参数（秒），可选值：doubao-seedance-1-5-pro：4 ~12 秒、10，doubao-seedance-1-0-pro、doubao-seedance-1-0-pro-fast、doubao-seedance-1-0-lite-t2v、doubao-seedance-1-0-lite-i2v：2 ~12 秒 |
| resolution | string | 否 | 720p | 分辨率参数，输出分辨率，可选值"480p", "720p", "1080p" |
| size | string | 否 | 16:9 | 各画面比例的宽高像素值,可选值"16:9", "1:1", "4:3", "9:16", "3:4", "21:9", "adaptive"（doubao-seedance-1-0-pro、doubao-seedance-1-0-pro-fast 文生视频场景不支持）(doubao-seedance-1-0-lite-t2v、doubao-seedance-1-0-lite-i2v) |
| metadata | string | 否 | - | 扩展参数（JSON字符串格式） |
 
 ```
 metadata 支持seed: 种子整数、camera_fixed: 是否固定摄像头、watermark：是否包含水印，如：

``` json
 { 
    "watermark": true
 }
```

### 请求示例

```bash
curl -X POST https://api.omnimaas.com/v1/video/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "doubao-seedance-1-0-pro-250528",
    "prompt": "一只可爱的小猫在草地上玩耍",
    "duration": 5,
    "resolution": "720p"
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
| model | string | 是 | - | doubao-seedance-1-0-pro-250528、doubao-seedance-1-0-pro-fast-251015、doubao-seedance-1-0-lite-i2v-250428、doubao-seedance-1-0-lite-t2v-250428 |
| prompt | string | 是 | - | 文本提示词，生成视频的文本描述 |
| images | []string | 是 | - | 图片输入（URL/Base64），支持输入一张或多张图片 |
| duration | int | 否 | 5 | 视频时长参数（秒），可选值：doubao-seedance-1-5-pro：4 ~12 秒、10，doubao-seedance-1-0-pro、doubao-seedance-1-0-pro-fast、doubao-seedance-1-0-lite-t2v、doubao-seedance-1-0-lite-i2v：2 ~12 秒 |
| resolution | string | 否 | 720p | 分辨率参数，输出分辨率，可选值"480p", "720p", "1080p" |
| size | string | 否 | 16:9 | 各画面比例的宽高像素值,可选值"16:9", "1:1", "4:3", "9:16", "3:4", "21:9", "adaptive"（doubao-seedance-1-0-pro、doubao-seedance-1-0-pro-fast 文生视频场景不支持）(doubao-seedance-1-0-lite-t2v、doubao-seedance-1-0-lite-i2v) |
| metadata | string | 否 | - | 扩展参数（JSON字符串格式） |

 
 ```
 metadata 支持seed: 种子整数、camera_fixed: 是否固定摄像头、watermark：是否包含水印，如：

``` json
 { 
    "watermark": true
 }
```

### 请求示例

```bash
curl -X POST https://api.omnimaas.com/v1/video/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "doubao-seedance-1-0-pro-250528",
    "prompt": "让这张图片动起来，添加自然的运动效果",
    "images": ["https://ark-project.tos-cn-beijing.volces.com/doc_image/i2v_foxrgirl.png"],
    "duration": 5
  }'
```

## 响应

### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 视频任务ID |
| task_id | string | 视频任务ID，可取id或task_id |
| object | string | 对象类型，固定为 "video" |
| model | string | 使用的模型名称 |
| created_at | integer | 创建时间戳 |
| status | string | 任务状态（processing: 处理中） |
| progress | integer | 生成进度百分比 |

### 响应示例

```json
{
  "id": "cgt-xxx",
  "task_id": "cgt-xxx",
  "object": "video",
  "model": "doubao-seedance-1-0-pro-250528",
  "created_at": 1640995200,
  "status": "queued",
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
curl https://api.omnimaas.com/v1/video/generations/video_123 \
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
  "id": "video_123",
  "object": "video",
  "model": "jimeng-v2",
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

url = 'https://api.omnimaas.com/v1/videos'

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
}

data = {
    "model": "jimeng-1.0",
    "prompt": "夕阳下的海滩，海浪轻轻拍打着沙滩"
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
        Model:  "jimeng-1.0",
        Prompt: "夕阳下的海滩，海浪轻轻拍打着沙滩",
    }

    jsonData, _ := json.Marshal(reqBody)
    req, _ := http.NewRequest("POST", 
        "https://api.omnimaas.com/v1/videos", 
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

const url = 'https://api.omnimaas.com/v1/videos';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
};

const data = {
    model: 'jimeng-1.0',
    prompt: '夕阳下的海滩，海浪轻轻拍打着沙滩'
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
