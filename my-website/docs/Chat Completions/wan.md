# Wan视频格式

## 概述
OmniMaaS 目前已支持对Wan视频大模型的统一接入与调用。通过本章节提供的接口说明，可完成对万相文生视频、图生视频、参考生视频等模型调用。

## 端点

``` 
POST /v1/videos
```

## 请求头

- **Authorization** `string`（必填）
    用户认证令牌 (Bearer: sk-xxxx)

## 文生视频

### 请求体

- **model** `string`（必填）
    用于生成视频的模型ID，可选值：`wan2.6-t2v`
- **prompt** `string` (必填)
    文本提示词，生成视频的文本描述。
- **seconds** `string` (可选)  
    视频时长参数，默认值依据模型而定:
    wan2.6-t2v：可选值为5、10、15。默认值为5。
- **size** `string` (可选)  
    指定生成的视频分辨率，格式为宽*高。该参数的默认值和可用枚举值依赖于 model 参数，规则如下：
    wan2.6-t2v：默认值为 1920*1080（1080P）。可选分辨率：720P、1080P对应的所有分辨率。
    1080P档位：可选的视频分辨率及其对应的视频宽高比为：
    1920*1080： 16:9。
    1080*1920： 9:16。
    1440*1440： 1:1。
    1632*1248： 4:3。
    1248*1632： 3:4。
- **metadata** `string` (可选)
    扩展参数（JSON字符串格式）（如 prompt_extend, shot_type 等）

### metadata 参数说明
metadata 参数的作用是传递模型特有的参数，比如阿里云万相的图片URL、水印、prompt智能改写等。metadata 参数的格式为 JSON 字符串，比如：
```
{
    "prompt_extend": true
}
```

### 请求示例

#### 文生视频 (仅文本提示)

```
curl https://api.omnimaas.com/v1/videos \
  -H "Authorization: Bearer sk-xxxx" \
  -F "prompt=一个穿着宇航服的宇航员在月球上行走, 高品质, 电影级" \
  -F "model=wan2.6-t2v" \
  -F "seconds=5" \
  -F "size=1920x1080"
```


## 图生视频

### 请求体

- **model** `string`（必填）
    用于生成视频的模型ID，可选值：`wan2.6-i2v`
- **prompt** `string` (必填)
    文本提示词，生成视频的文本描述。
- **duration** `int` (可选)  
    视频时长参数，默认值依据模型而定:
    wan2.6-i2v：可选值为5、10、15。默认值为5。
- **size** `string` (可选)  
    指定生成的视频分辨率，格式为宽*高。该参数的默认值和可用枚举值依赖于 model 参数，规则如下：
    wan2.6-t2v：默认值为 1920*1080（1080P）。可选分辨率：720P、1080P对应的所有分辨率。
    1080P档位：可选的视频分辨率及其对应的视频宽高比为：
    1920*1080： 16:9。
    1080*1920： 9:16。
    1440*1440： 1:1。
    1632*1248： 4:3。
    1248*1632： 3:4。
- **metadata** `string` (可选)
    扩展参数（JSON字符串格式）（如 prompt_extend, shot_type 等）

### metadata 参数说明
metadata 参数的作用是传递模型特有的参数，比如阿里云万相的图片URL、水印、prompt智能改写等。metadata 参数的格式为 JSON 字符串，比如：
```
{
    "img_url": "https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20250925/wpimhv/rap.png"
}
```

#### 图生视频 (文本提示 + 图片文件)

```
curl --location --request POST 'http://api.omnimaas.com/v1/videos' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer sk-xxx' \
--data-raw '{
    "model": "wan2.6-i2v",
    "prompt": "让这张图片动起来，添加自然的运动效果",
    "metadata": {
        "img_url": "https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20250925/wpimhv/rap.png"
    }
}'
```

## 响应

### 响应结构

- **id** `string`（必填）
    视频任务ID
- **object** `string`（必填）
    对象类型，固定为 "video"
- **model** `string`（必填）
    使用的模型名称
- **created_at** `integer`（必填）
    创建时间戳
- **status** `string`（必填）
    任务状态（processing: 处理中）
- **progress** `integer`（必填）
    生成进度百分比

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

根据任务ID查询视频生成任务的状态和结果

### 查询端点

```
GET /v1/videos/{video_id}
```

### 路径参数
- **video_id** `string`（必填）
    视频任务ID

### 请求示例

```
curl 'https://api.omnimaas.com/v1/videos/video_123' \
  -H "Authorization: Bearer sk-xxxx"
```

### 响应

#### 响应结构

- **id** `string`（必填）
    视频任务ID
- **object** `string`（必填）
    对象类型，固定为 "video"
- **model** `string`（必填）
    使用的模型名称
- **created_at** `integer`（必填）
    创建时间戳
- **status** `string`（必填）
    任务状态（processing: 处理中）
- **progress** `integer`（必填）
    生成进度百分比
- **expires_at** `integer`（必填）
    资源过期时间戳
- **size** `string`（必填）
    视频分辨率
- **seconds** `string`（必填）
    视频时长（秒）
- **quality** `string`（必填）
    视频质量
- **url** `string`（必填）
    视频下载链接（完成时）

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

### API端点

```
GET /v1/videos/{video_id}/content
```

### 路径参数

- **video_id** `string`（必填）
    要下载的视频标识符

### 查询参数

- **variant** `string`（可选）
    要返回的可下载资源类型，默认为MP4视频

### 请求示例

```
curl 'https://api.omnimaas.com/v1/videos/video_123/content' \
  -H "Authorization: Bearer sk-xxxx" \
  -o "video.mp4"
```

### 响应说明

直接返回视频文件流，Content-Type为 video/mp4

#### 响应头

- **Content-Type** `string`
    视频文件类型，通常为 video/mp4
- **Content-Length** `string`
    视频文件大小（字节）
- **Content-Disposition** `string`
    文件下载信息


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

## 支持的模型

- wan2.6-t2v: 文生视频
- wan2.6-i2v

其他模型支持可联系客服。

## JS调用示例
### 文生视频

```
// 阿里云万相文生视频
import requests

url = 'https://api.omnimaas.com/v1/videos'

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-xxxx'
}

data = {
    "model": "wan2.6-i2v",
    "prompt": "蓝天白云，一群大雁飞过"
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

```
// 阿里云万相图生视频
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