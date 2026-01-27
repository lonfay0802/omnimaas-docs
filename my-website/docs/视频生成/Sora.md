# OpenAI 视频生成（Sora）

## 概述
OmniMaaS 目前已支持对 Sora、Veo 视频大模型的统一接入与调用。通过本章节提供的接口说明，您可以在同一套 API 下发起视频生成请求，调用 OpenAI 视频生成接口生成视频，支持 Sora 等模型。

## 文生视频

### 接口地址
```
POST https://api.omnimaas.com/v1/videos
```

### 请求头

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token，格式：`Bearer YOUR_API_KEY` |
| Content-Type | string | 是 | 请求体格式，固定为 `multipart/form-data` |

### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| model | string | 是 | - | 用于生成视频的模型ID，可选值：sora-2 |
| prompt | string | 是 | - | 文本提示词，生成视频的文本描述 |
| seconds | integer | 否 | 4 | 视频时长参数（秒），可选值：4、8、12 |
| input_reference | file | 否 | - | 输入图片文件（图生视频时使用） |
| size | string | 否 | 720x1280 | 分辨率参数，输出分辨率，格式为宽度x高度，支持分辨率：720x1280, 1280x720, 1024x1792, 1792x1024 |


### 请求示例

#### 文生视频 (仅文本提示)

```
curl https://api.omnimaas.com/v1/videos \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "prompt=一个穿着宇航服的宇航员在月球上行走, 高品质, 电影级" \
  -F "model=sora-2" \
  -F "seconds=4" \
  -F "size=720x1280"
```

#### 图生视频 (文本提示 + 图片文件)

```
curl https://api.omnimaas.com/v1/videos \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "prompt=猫咪慢慢睁开眼睛，伸懒腰" \
  -F "model=sora-2" \
  -F "seconds=4" \
  -F "size=1920x1080" \
  -F "input_reference=@/path/to/cat.jpg"
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

```
{
  "id": "video_123",
  "object": "video",
  "model": "sora-2",
  "created_at": 1640995200,
  "status": "processing",
  "progress": 0
}
```

## 查询视频

根据任务 ID 查询视频生成任务的状态和结果

### 接口地址
```
GET https://api.omnimaas.com/v1/videos/{video_id}
```

### 请求头

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token，格式：`Bearer YOUR_API_KEY` |

### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| video_id | string | 是 | 视频任务ID |

### 请求示例

```
curl 'https://api.omnimaas.com/v1/videos/video_123' \
  -H "Authorization: Bearer sk-xxxx"
```

### 响应

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 视频任务ID |
| object | string | 对象类型，固定为 "video" |
| model | string | 使用的模型名称 |
| created_at | integer | 创建时间戳 |
| status | string | 任务状态（processing: 处理中） |
| progress | integer | 生成进度百分比 |
| expires_at | integer | 资源过期时间戳 |
| size | string | 视频分辨率 |
| seconds | string | 视频时长（秒） |
| quality | string | 视频质量 |
| url | string | 视频下载链接（完成时） |

#### 响应示例

```
{
  "id": "video_123",
  "object": "video",
  "model": "sora-2",
  "created_at": 1640995200,
  "status": "succeeded",
  "progress": 100,
  "expires_at": 1641081600,
  "size": "1920x1080",
  "seconds": "5",
  "quality": "standard",
  "remixed_from_video_id": null,
  "error": null
}
```

## 获取视频内容

下载已完成的视频内容

### 接口地址
```
GET https://api.omnimaas.com/v1/videos/{video_id}/content
```

### 请求头

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token，格式：`Bearer YOUR_API_KEY` |

### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| video_id | string | 是 | 要下载的视频标识符 |

### 查询参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| variant | string | 否 | MP4视频 | 要返回的可下载资源类型 |

### 请求示例

```
curl 'https://api.omnimaas.com/v1/videos/video_123/content' \
  -H "Authorization: Bearer sk-xxxx" \
  -o "video.mp4"
```

### 响应说明

直接返回视频文件流，Content-Type为 video/mp4

#### 响应头

| 参数名 | 类型 | 说明 |
|--------|------|------|
| Content-Type | string | 视频文件类型，通常为 video/mp4 |
| Content-Length | string | 视频文件大小（字节） |
| Content-Disposition | string | 文件下载信息 |


## 错误响应

### 400 - 请求参数错误
```
{
  "error": {
    "message": "string",
    "type": "invalid_request_error"
  }
}
```

### 401 - 未授权
```
{
  "error": {
    "message": "string",
    "type": "invalid_request_error"
  }
}
```

### 403 - 无权限
```
{
  "error": {
    "message": "string",
    "type": "invalid_request_error"
  }
}
```

### 404 - 任务不存在
```
{
  "error": {
    "message": "string",
    "type": "invalid_request_error"
  }
}
```

### 500 - 服务器内部错误
```
{
  "error": {
    "message": "string",
    "type": "server_error"
  }
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
    "model": "sora-2",
    "prompt": "一个宇航员在太空中漂浮"
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
        Model:  "sora-2",
        Prompt: "一个宇航员在太空中漂浮",
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
    model: 'sora-2',
    prompt: '一个宇航员在太空中漂浮'
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
