# OpenAI 图像格式

## 概述
OmniMaaS 目前已支持OpenAI标准协议的图像生成、编辑等操作的统一接入与调用。通过本章节提供的接口说明，您可以在同一套API下发起图像生成请求，屏蔽底层厂商差异，实现参数格式的统一管理与灵活扩展，完成通过文本对话生成图像的场景接入。
```
官方文档地址：https://platform.openai.com/docs/api-reference/images
```

## 支持模型
| 模型名称 | 描述 |
|---------|---------|
| gpt-image-1   | GPT Image 1 是一个原生多模态语言模型，它接受文本和图像输入，并生成图像输出。   |
| qwen-image-edit-plus   | 通义千问系列图像编辑Plus模型，在首版Edit模型基础上进一步优化了推理性能与系统稳定性，大幅缩短图像生成与编辑的响应时间；支持单次请求返回多张图片，显著提升用户体验。   |


## 创建图片

### 端点

``` 
POST /v1/images/generations 
```

### 请求体

- **model** `string`（必填）  
    创建图片时选择的模型id。
- **prompt** `string`（必填）  
    期望生成图片的文本描述。
- **n** `int`（可选）  
    要生成的图片数量，必须在 1-10 之间，默认值为1
- **qualityn** `string`（可选）  
    生成图片的质量。默认值：standard
- **size** `string`（可选）  
    生成图片的尺寸。默认值：1024x1024
- **response_format** `string`（可选）  
    返回生成图片的格式。必须是 url 或 b64_json 之一。默认值：url

### 请求示例
```
curl https://154.23.160.216:3000/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEWAPI_API_KEY" \
  -d '{
    "model": "gpt-image-1",
    "prompt": "生成一只可爱的小猫",
    "n": 1
  }'
  ```

## 编辑图片

### 端点

``` 
POST /v1/images/edits 
```

### 请求体

- **model** `string`（必填）  
    创建图片时选择的模型id。
- **prompt** `string`（必填）  
    期望生成图片的文本描述。
- **image** `string | []string`（必填）  
    文件或文件数组，要编辑的图片。可以提供多个图片作为数组。
- **qualityn** `string`（可选）  
    生成图片的质量。默认值：standard
- **size** `string`（可选）  
    生成图片的尺寸。默认值：1024x1024

### 请求示例
#### 单图示例
```
curl https://154.23.160.216:3000/v1/images/edits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEWAPI_API_KEY" \
  -d '{
    "model": "qwen-image-edit-plus",
    "prompt": "生成一张符合深度图的图像，遵循以下描述：一辆红色的破旧的自行车停在一条泥泞的小路上，背景是茂密的原始森林",
    "image": "https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20250925/fpakfo/image36.webp"
}'
```

#### 多图示例
```
curl https://154.23.160.216:3000/v1/images/edits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEWAPI_API_KEY" \
  -d '{
    "model": "qwen-image-edit-plus",
    "prompt": "生成一张符合深度图的图像，遵循以下描述：一辆红色的破旧的自行车停在一条泥泞的小路上，背景是茂密的原始森林",
    "image": ["https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20250925/fpakfo/image36.webp"]
}'
```
  
## 请求响应
所有三个端点都返回包含图片对象列表的响应，以及不同渠道的个性化输出。

### 响应结构
- **model** `int`
    响应创建的时间戳
- **data** `[]object`
    生成的图片对象列表
    - **b64_json** `string`
    如果 response_format 为 b64_json，则包含生成图片的 base64 编码 JSON，默认跟着厂商的输出格式。
    - **url** `string`
    如果 response_format 为 url（默认），则包含生成图片的 URL。
    - **revised_prompt** `string`
    如果提示有任何修改，则包含用于生成图片的修改后的提示
- **usage** `object` (OpenAI协议)
    - **input_tokens** `int`
    输入使用的令牌数
    - **output_tokens** `int`
    输出使用的令牌数
    - **total_tokens** `int`
    使用的总令牌数
    - **input_tokens_details** `int`
    输入令牌的详细信息（文本令牌和图像令牌）

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
#### Qwen模型示例
```
{
    "data": [
        {
            "url": "https://dashscope-result-hz.oss-cn-hangzhou.aliyuncs.com/7d/05/20251221/31eda923/2dae0c0b-2152-4a74-97cd-49054c110e67-1.png?Expires=1766911160&OSSAccessKeyId=LTAI5tKPD3TMqf2Lna1fASuh&Signature=PoeWqus%2FZmBmydDINqFRtm8jKHI%3D",
            "b64_json": "",
            "revised_prompt": ""
        }
    ],
    "created": 1766305349,
    "extra": {
        "output": {
            "choices": [
                {
                    "message": {
                        "content": [
                            {
                                "image": "https://dashscope-result-hz.oss-cn-hangzhou.aliyuncs.com/7d/05/20251221/31eda923/2dae0c0b-2152-4a74-97cd-49054c110e67-1.png?Expires=1766911160&OSSAccessKeyId=LTAI5tKPD3TMqf2Lna1fASuh&Signature=PoeWqus%2FZmBmydDINqFRtm8jKHI%3D"
                            }
                        ],
                        "role": "assistant"
                    }
                }
            ],
            "finished": true
        },
        "request_id": "f214303a-08bc-4cbb-b9ae-61decd4f81f2",
        "usage": {
            "height": 864,
            "image_count": 1,
            "width": 1216
        }
    }
}
```

