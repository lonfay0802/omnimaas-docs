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

### 请求体 (multipart/form-data)

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
- **seconds** `string` (可选)  
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
    "prompt_extend": true
}
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

## 支持的模型

- wan2.6-t2v: 文生视频
- wan2.6-i2v

其他模型支持可联系客服。

## JS调用示例
### 文生视频

```
// 阿里云万相文生视频
async function generateAliVideo() {
  const formData = new FormData();
  formData.append('prompt', '一幅史诗级可爱的场景。一只小巧可爱的卡通小猫将军，身穿细节精致的金色盔甲，头戴一个稍大的头盔，勇敢地站在悬崖上。他骑着一匹虽小但英勇的战马，说：”青海长云暗雪山，孤城遥望玉门关。黄沙百战穿金甲，不破楼兰终不还。“。悬崖下方，一支由老鼠组成的、数量庞大、无穷无尽的军队正带着临时制作的武器向前冲锋。这是一个戏剧性的、大规模的战斗场景，灵感来自中国古代的战争史诗。远处的雪山上空，天空乌云密布。整体氛围是“可爱”与“霸气”的搞笑和史诗般的融合。');
  formData.append('model', 'wan2.6-t2v');
  formData.append('seconds', '5');
  formData.append('size', '1920*1080');
  formData.append('metadata', JSON.stringify({
    watermark: false,
    prompt_extend: true
  }));

  const response = await fetch('https://api.omnimaas.com/v1/videos', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-xxxx'
    },
    body: formData
  });

  const result = await response.json();
  return result.id;
}
```

### 图生视频

```
// 阿里云万相图生视频
async function generateAliImageToVideo() {
  const formData = new FormData();
  formData.append('prompt', '让这张图片动起来，添加自然的运动效果');
  formData.append('model', 'wan2.6-i2v');
  formData.append('seconds', '5');
  formData.append('resolution', '720P');
  formData.append('input_reference', imageFile);
  formData.append('metadata', JSON.stringify({
    watermark: false,
    prompt_extend: true
  }));

  const response = await fetch('https://你的newapi服务器地址/v1/videos', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-xxxx'
    },
    body: formData
  });

  const result = await response.json();
  return result.id;
}
```