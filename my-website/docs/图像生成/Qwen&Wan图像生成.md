# Qwen&Wan图像生成

## 概述
OmniMaaS 目前已支持OpenAI标准协议的图像生成、编辑等操作的统一接入与调用。通过本章节提供的接口说明，您可以在同一套API下发起图像生成请求，屏蔽底层厂商差异，实现参数格式的统一管理与灵活扩展，完成通过文本对话生成图像的场景接入。


## 支持模型
| 模型名称 | 描述 |
|---------|---------|
| qwen-image-edit-plus   | 通义千问系列图像编辑Plus模型，在首版Edit模型基础上进一步优化了推理性能与系统稳定性，大幅缩短图像生成与编辑的响应时间；支持单次请求返回多张图片，显著提升用户体验。   |
| wan2.5-t2i-preview   | 通义万相2.5-文生图-Preview，全新升级模型架构。画面美学、设计感、真实质感显著提升，精准指令遵循，擅长中英文和小语种文字生成，支持复杂结构化长文本和图表、架构图等内容生成。   |
| wan2.5-i2i-preview   | 通义万相2.5-图像编辑-Preview，全新升级模型架构。支持指令控制实现丰富的图像编辑能力，指令遵循能力进一步提升，支持高一致性保持的多图参考生成，文字生成表现优异。   |


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
curl https://api.omnimaas.com/v1/images/generations \
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
curl https://api.omnimaas.com/v1/images/edits \
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
curl https://api.omnimaas.com/v1/images/edits \
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
- **created** `int`
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
    - **image_count** `int`
    图片生成总张数

### 输出示例
```
{
    {
        "data": [
            {
                "url": "https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/1d/9f/20260114/eb920ed5/ef851b1b-8c4f-4ba3-b323-42a81b331ac0.png?Expires=1768489719&OSSAccessKeyId=LTAI5tKPD3TMqf2Lna1fASuh&Signature=G1w60K1vh0b5v997i6a1GwOPniI%3D",
                "b64_json": "",
                "revised_prompt": ""
            }
        ],
        "created": 1768403299,
        "usage": {
            "input_tokens": 0,
            "output_tokens": 0,
            "total_tokens": 0,
            "image_count": 1
        }
    }
}
```

## 说明
目前z-image、qwen-image、wan2.6是同步接口，2.5及以下为异步接口；为了输出一致性，目前系统会将异步输出结果自动转成同步结果，无需再次调用查询接口即可完成数据结果的获取。