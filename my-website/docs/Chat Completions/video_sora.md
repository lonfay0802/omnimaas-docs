# OpenAI视频格式（Sora）

## 概述
OmniMaaS 目前已支持对 Sora、Veo视频大模型的统一接入与调用。通过本章节提供的接口说明，您可以在同一套API下发起视频生成请求，调用OpenAI视频生成接口生成视频，支持 Sora 等模型，也支持使用 OpenAI 视频格式调用可灵、即梦、Wan和 vidu。

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
    用于生成视频的模型ID，可选值：`sora-2`
- **prompt** `string` (必填)
    文本提示词，生成视频的文本描述。
- **seconds** `int` (可选)  
    视频时长参数，默认值依据模型而定，默认为4秒。
- **input_reference** `file` (可选)  
    输入图片文件（图生视频时使用）
- **size** `string` (可选)  
    分辨率参数，默认值依据模型和视频时长而定，输出分辨率，格式为宽度x高度，默认为 720x1280
- **metadata** `string` (可选)
    扩展参数（JSON字符串格式）（如 negative_prompt, style, quality_level 等）

### metadata 参数说明
metadata 参数的作用是传递非sora模型特有的参数，比如阿里云万相的图片URL、水印、prompt智能改写等。metadata 参数的格式为 JSON 字符串，比如：
```
{
    "model": "wan2.6-t2v",
    "prompt": "兔子在跳舞",
    "metadata": {
        {
            "img_url": "https://example.com/image.jpg",
            "watermark": false,
            "prompt_extend": true
        }
    }
}

```

### 请求示例

#### 文生视频 (仅文本提示)

```
curl https://api.omnimaas.com/v1/videos \
  -H "Authorization: Bearer sk-xxxx" \
  -F "prompt=一个穿着宇航服的宇航员在月球上行走, 高品质, 电影级" \
  -F "model=sora-2" \
  -F "seconds=5" \
  -F "size=1920x1080"
```

#### 图生视频 (文本提示 + 图片文件)

```
curl https://api.omnimaas.com/v1/videos \
  -H "Authorization: Bearer sk-xxxx" \
  -F "prompt=猫咪慢慢睁开眼睛，伸懒腰" \
  -F "model=sora-2" \
  -F "seconds=3" \
  -F "size=1920x1080" \
  -F "input_reference=@/path/to/cat.jpg"
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