# Wan 视频生成

## 概述
OmniMaaS 目前已支持对Wan视频大模型的统一接入与调用。通过本章节提供的接口说明，可完成对万相文生视频、图生视频、参考生视频等模型调用。

## 文生视频

### 接口地址
```
POST https://api.omnimaas.com/v1/videos
```

### 请求头

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token，格式：`Bearer YOUR_API_KEY` |
| Content-Type | string | 是 | 请求体格式，固定为 `application/json` |

### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| model | string | 是 | - | 用于生成视频的模型ID，可选值：wan2.6-t2v |
| prompt | string | 是 | - | 文本提示词，生成视频的文本描述 |
| seconds | string | 否 | 5 | 视频时长参数，wan2.6-t2v可选值为5、10、15 |
| size | string | 否 | 1920*1080 | 指定生成的视频分辨率，格式为宽*高。wan2.6-t2v默认值为1920*1080（1080P）。1080P档位可选分辨率：1920*1080(16:9)、1080*1920(9:16)、1440*1440(1:1)、1632*1248(4:3)、1248*1632(3:4) |
| metadata | string | 否 | - | 扩展参数（JSON字符串格式），如 prompt_extend, shot_type 等 |

### metadata 参数说明
metadata 参数的作用是传递模型特有的参数，比如阿里云万相的图片URL、水印、prompt智能改写等。metadata 参数的格式为 JSON 字符串，比如：
```
{
    "prompt_extend": true
}
```

### 请求示例

#### 文生视频 (仅文本提示)

```bash
curl https://api.omnimaas.com/v1/videos \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "wan2.6-t2v",
    "prompt": "一个穿着宇航服的宇航员在月球上行走, 高品质, 电影级",
    "seconds": "5",
    "size": "1920*1080"
  }'
```


## 图生视频

### 接口地址
```
POST https://api.omnimaas.com/v1/videos
```

### 请求头

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token，格式：`Bearer YOUR_API_KEY` |
| Content-Type | string | 是 | 请求体格式，固定为 `application/json` |

### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| model | string | 是 | - | 用于生成视频的模型ID，可选值：wan2.6-i2v |
| prompt | string | 是 | - | 文本提示词，生成视频的文本描述 |
| seconds | string | 否 | 5 | 视频时长参数，wan2.6-i2v可选值为5、10、15 |
| size | string | 否 | 1920*1080 | 指定生成的视频分辨率，格式为宽*高。wan2.6-i2v默认值为1920*1080（1080P）。1080P档位可选分辨率：1920*1080(16:9)、1080*1920(9:16)、1440*1440(1:1)、1632*1248(4:3)、1248*1632(3:4) |
| metadata | string | 否 | - | 扩展参数（JSON字符串格式），如 prompt_extend, shot_type 等 |

### metadata 参数说明
metadata 参数的作用是传递模型特有的参数，比如阿里云万相的图片URL、水印、prompt智能改写等。metadata 参数的格式为 JSON 字符串，比如：
```
{
    "img_url": "https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20250925/wpimhv/rap.png"
}
```

#### 图生视频 (文本提示 + 图片文件)

```
curl --location --request POST 'https://api.omnimaas.com/v1/videos' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY' \
--data-raw '{
    "model": "wan2.6-i2v",
    "prompt": "让这张图片动起来，添加自然的运动效果",
    "metadata": {
        "img_url": "https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20250925/wpimhv/rap.png"
    }
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
  "model": "wan2.6-t2v",
  "created_at": 1640995200,
  "status": "processing",
  "progress": 0
}
```

## 查询视频

根据任务ID查询视频生成任务的状态和结果

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

```bash
curl 'https://api.omnimaas.com/v1/videos/{video_id}' \
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
| status | string | 任务状态（processing: 处理中） |
| progress | integer | 生成进度百分比 |
| expires_at | integer | 资源过期时间戳 |
| size | string | 视频分辨率 |
| seconds | string | 视频时长（秒） |
| quality | string | 视频质量 |
| url | string | 视频下载链接（完成时） |

#### 响应示例

```json
{
  "id": "{video_id}",
  "object": "video",
  "model": "wan2.6-t2v",
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

```bash
# 下载视频文件到本地
curl 'https://api.omnimaas.com/v1/videos/{video_id}/content' \
  -H "Authorization: Bearer YOUR_API_KEY" \
  --output video.mp4
```

**说明**：`--output` 参数用于指定保存的文件名，视频内容将直接下载到本地文件。

### 响应说明

直接返回视频文件流，Content-Type为 video/mp4

#### 响应头

| 参数名 | 类型 | 说明 |
|--------|------|------|
| Content-Type | string | 视频文件类型，通常为 video/mp4 |
| Content-Length | string | 视频文件大小（字节） |
| Content-Disposition | string | 文件下载信息 |


## 支持的模型

- **wan2.6-t2v**: 文生视频
- **wan2.6-i2v**: 图生视频

其他模型支持可联系客服。

## Python 调用示例
### 文生视频

```python
# 阿里云万相文生视频
import requests

url = 'https://api.omnimaas.com/v1/videos'

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-xxxx'
}

data = {
    "model": "wan2.6-t2v",
    "prompt": "蓝天白云，一群大雁飞过",
    "seconds": "5",
    "size": "1920*1080"
}

try:
    response = requests.post(url, headers=headers, json=data)

    # 检查响应状态
    print(f"状态码: {response.status_code}")
    print(f"响应头: {response.headers}")
    print(f"响应内容: {response.text}")

    # 如果是JSON响应，可以解析
    if 'application/json' in response.headers.get('Content-Type', ''):
        response_data = response.json()
        print(f"解析后的JSON: {response_data}")

except requests.exceptions.RequestException as e:
    print(f"请求失败: {e}")
except ValueError as e:
    print(f"JSON解析失败: {e}")
```

### 图生视频

```python
# 阿里云万相图生视频
import requests

url = 'https://api.omnimaas.com/v1/videos'

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-xxxx'
}

data = {
    "model": "wan2.6-i2v",
    "prompt": "让这张图片动起来，添加自然的运动效果",
    "metadata": {
        "img_url": "https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20250925/wpimhv/rap.png"
    }
}

try:
    response = requests.post(url, headers=headers, json=data)

    # 检查响应状态
    print(f"状态码: {response.status_code}")
    print(f"响应头: {response.headers}")
    print(f"响应内容: {response.text}")

    # 如果是JSON响应，可以解析
    if 'application/json' in response.headers.get('Content-Type', ''):
        response_data = response.json()
        print(f"解析后的JSON: {response_data}")

except requests.exceptions.RequestException as e:
    print(f"请求失败: {e}")
except ValueError as e:
    print(f"JSON解析失败: {e}")
```