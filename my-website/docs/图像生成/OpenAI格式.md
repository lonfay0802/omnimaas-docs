# OpenAI 图像生成

## 概述
OmniMaaS 目前已支持 OpenAI 标准协议的图像生成、编辑等操作的统一接入与调用。通过本章节提供的接口说明，您可以在同一套 API 下发起图像生成请求，屏蔽底层厂商差异，实现参数格式的统一管理与灵活扩展，完成通过文本对话生成图像的场景接入。

## 支持模型

| 模型名称 | 描述 |
|---------|---------|
| gpt-image-1 | GPT Image 1 是一个原生多模态语言模型，它接受文本和图像输入，并生成图像输出。 |

## 创建图片

### 接口地址
```
POST https://api.omnimaas.com/v1/images/generations
```

### 请求头

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token，格式：`Bearer YOUR_API_KEY` |
| Content-Type | string | 是 | 请求体格式，固定为 `application/json` |

### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| model | string | 是 | - | 创建图片时选择的模型id |
| prompt | string | 是 | - | 期望生成图片的文本描述 |
| n | integer | 否 | 1 | 要生成的图片数量，必须在 1-10 之间 |
| quality | string | 否 | standard | 生成图片的质量 |
| size | string | 否 | 1024x1024 | 生成图片的尺寸 |
| response_format | string | 否 | url | 返回生成图片的格式，必须是 url 或 b64_json 之一 |

### 请求示例
```
curl https://api.omnimaas.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gpt-image-1",
    "prompt": "生成一只可爱的小猫",
    "n": 1
  }'
  ```

## 编辑图片

### 接口地址
```
POST https://api.omnimaas.com/v1/images/edits
```

### 请求头

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token，格式：`Bearer YOUR_API_KEY` |
| Content-Type | string | 是 | 请求体格式，固定为 `application/json` |

### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| model | string | 是 | - | 创建图片时选择的模型id |
| prompt | string | 是 | - | 期望生成图片的文本描述 |
| image | string/array | 是 | - | 文件或文件数组，要编辑的图片。可以提供多个图片作为数组 |
| quality | string | 否 | standard | 生成图片的质量 |
| size | string | 否 | 1024x1024 | 生成图片的尺寸 |

### 请求示例
#### 多图示例（Form请求）
```
curl https://api.omnimaas.com/v1/images/edits \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "model=gpt-image-1" \
  -F "image[]=@body-lotion.png" \
  -F "image[]=@bath-bomb.png" \
  -F "image[]=@incense-kit.png" \
  -F "image[]=@soap.png" \
  -F "prompt=创建一个包含这四个物品的精美礼品篮" \
  -F "quality=high"
```

## 响应说明

返回包含图片对象列表的响应，以及不同渠道的个性化输出。

### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| created | integer | 响应创建的时间戳 |
| data | array | 生成的图片对象列表 |
| data[].b64_json | string | 如果 response_format 为 b64_json，则包含生成图片的 base64 编码 JSON |
| data[].url | string | 如果 response_format 为 url（默认），则包含生成图片的 URL |
| data[].revised_prompt | string | 如果提示有任何修改，则包含用于生成图片的修改后的提示 |
| usage | object | OpenAI协议的使用统计信息 |
| usage.input_tokens | integer | 输入使用的令牌数 |
| usage.output_tokens | integer | 输出使用的令牌数 |
| usage.total_tokens | integer | 使用的总令牌数 |
| usage.input_tokens_details | object | 输入令牌的详细信息（文本令牌和图像令牌） |

### 输出示例
#### OpenAI 示例
```
{
    "created": 1766308943,
    "background": "opaque",
    "data": [{"b64_json": ""}],
    "output_format": "png",
    "quality": "high",
    "size": "1024x1024",
    "usage": {
        "input_tokens": 52,
        "input_tokens_details": {
            "image_tokens": 0,
            "text_tokens": 52
        },
        "output_tokens": 4160,
        "total_tokens": 4212
    }
}
```