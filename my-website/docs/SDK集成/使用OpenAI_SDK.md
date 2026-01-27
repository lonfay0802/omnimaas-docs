# 创建对话请求（OpenAI）

## 概述
OmniMaaS 的 OpenAI 原生 Chat Completions 接口为已经接入 OpenAI 生态的团队提供了一条几乎「零改动」的迁移路径。平台在协议层完全兼容官方 POST /v1/chat/completions 规范，包括请求体结构（model、messages 等字段）、流式 stream 能力、工具调用等扩展能力，因此现有代码通常只需切换 base_url 与 api_key 即可直接复用。

## 请求

### Endpoint
```
POST https://api.omnimaas.com/v1/chat/completions
```

### Headers

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token，格式：`Bearer YOUR_API_KEY` |
| Content-Type | string | 是 | 请求体格式，固定为 `application/json` |

### Request Body

以下为 `chat.completions` 接口请求体支持的主要参数说明（与 OpenAI 官方语义保持一致）：

- **messages** `array`（必填）  
  当前对话的消息列表，按时间顺序排列。根据所选模型，`messages` 支持不同的消息类型（模态），例如文本、图片、音频等。
    - **role** `string` (必填)  
      当前消息的角色，仅支持：developer、user、system、assistant、tool
    - **content** `string` (必填) 
      消息内容
- **model** `string`（必填）  
  用于生成回复的模型 ID，例如 `gpt-5.1` 或 `gpt-5-pro`。不同模型在能力、性能和价格上有所差异，可参考模型指南选择合适的模型。

- **audio** `object | null`（可选）  
  配置音频输出参数。当你在 `modalities` 中请求 `["audio"]` 时，该字段必填。
    - **format** 
      指定输出音频格式。必须是以下之一wav, mp3, flac, opus或pcm16
    - **voice** 
      模型用于回复时所采用的声音。当前支持的音色包括：alloy、ash、ballad、coral、echo、fable、nova、onyx、sage 和 shimmer。
- **frequency_penalty** `number | null`（可选，默认 `0`）  
  取值范围 \[-2.0, 2.0]。正值会根据某个 token 在当前文本中出现的频率对其进行惩罚，降低模型重复同一行文本的概率。

- **logit_bias** `map`（可选，默认 `null`）  
  修改指定 token 出现在输出中的概率。是一个 “token ID → 偏置值” 的映射，偏置值范围为 \[-100, 100]。

- **logprobs** `boolean | null`（可选，默认 `false`）  
  是否返回输出 token 的对数概率信息。

- **max_completion_tokens** `integer | null`（可选）  
  限制本次补全中最多能生成的 token 数（包括可见输出和推理 token）。

- **max_tokens** `integer | null`（可选，已废弃）  
  老的最大生成 token 数字段，已被 `max_completion_tokens` 替代，不再适用于 o 系列模型。

- **metadata** `map`（可选）  
  附加到请求对象上的最多 16 组 key-value，用于结构化地存储自定义信息。key 最长 64 字符，value 最长 512 字符。

- **modalities** `array`（可选）  
  希望模型生成的输出类型。大多数模型默认只生成文本：`["text"]`。支持多模态的模型可以返回文本 + 音频等，例如 `["text", "audio"]`。

- **n** `integer | null`（可选，默认 `1`）  
  为每个输入生成多少条候选结果。计费会按照所有候选中的总生成 token 数计算。

- **parallel_tool_calls** `boolean`（可选，默认 `true`）  
  在使用工具调用时，是否允许模型并行调用多个工具。

- **prediction** `object`（可选）  
  预测输出配置，用于在大部分结果已知的场景中显著提升响应速度（例如重新生成大文件的局部内容）。

- **presence_penalty** `number | null`（可选，默认 `0`）  
  取值范围 \[-2.0, 2.0]。正值会惩罚已经出现过的 token，提高模型讨论新话题的倾向。

- **prompt_cache_key** `string`（可选）  
  用于提示缓存的稳定标识，替代 `user` 字段，帮助提升缓存命中率。

- **prompt_cache_retention** `string`（可选）  
  提示缓存的保留策略，例如设置为 `24h` 以启用最长 24 小时的扩展缓存。

- **reasoning_effort** `string`（可选，默认 `medium`）  
  限制推理模型在“推理”上的投入程度，可选值包括 `none`、`minimal`、`low`、`medium`、`high`（不同模型支持的取值略有差异）。

- **response_format** `object`（可选）  
  指定模型必须输出的格式。  
  - `{ "type": "json_schema", "json_schema": {...} }`：启用结构化输出，严格符合给定 JSON Schema。  
  - `{ "type": "json_object" }`：旧版 JSON 模式，保证生成内容是合法 JSON。

- **safety_identifier** `string`（可选）  
  用于稳定标识终端用户，帮助检测可能违反使用政策的行为。推荐对用户名/邮箱做哈希后上传以避免直接传递敏感信息。

- **seed** `integer | null`（可选，Beta，已标记为废弃）  
  尝试在相同 seed 与参数下得到稳定的输出结果，但不保证完全确定性。

- **service_tier** `string`（可选，默认 `auto`）  
  指定请求处理的服务等级，如 `default`、`flex`、`priority` 等，影响价格与性能。

- **stop** `string | array | null`（可选，默认 `null`）  
  最多 4 个停止序列。当生成内容遇到这些序列时会立刻停止，返回内容不包含停止序列本身。

- **store** `boolean | null`（可选，默认 `false`）  
  是否允许服务方存储该请求的输出，用于模型蒸馏或评测等内部用途。

- **stream** `boolean | null`（可选，默认 `false`）  
  是否开启服务端推送（SSE）形式的流式输出。

- **stream_options** `object`（可选，默认 `null`）  
  流式输出的附加配置，仅在 `stream: true` 时生效。

- **temperature** `number`（可选，默认 `1`）  
  采样温度，范围 \[0, 2]。值越高输出越随机，值越低越稳定可控。一般只调 `temperature` 或 `top_p` 其中一个。

- **tool_choice** `string | object`（可选）  
  控制模型在存在 `tools` 定义时如何选择工具调用：`none`、`auto`、`required` 或指定某个具体工具。
    - **string类型选选择解释**  
      `none`：模型不会调用任何工具，只生成文本回复。  
      `auto`：模型可以自行决定是直接回复，还是调用一个或多个工具（可与 parallel_tool_calls 联合使用）。  
      `required`：本轮回复中模型必须至少调用一个工具，但具体调用哪一个由模型根据上下文自行选择。  
    - **object类型解释**
        - **场景一：自动选择工具**  
            在该场景下，可提供多个可调用的 tools，由模型自行决定本轮对话中是不调用、调用一个，还是按需并行调用多个工具（需配合 parallel_tool_calls: true）。
            - **type** `string` (必填) 
            允许的工具配置类型，始终为allowed_tools。
            - **allowed_tools** `object` (必填) 
            - **mode** `string` (必填)  
            `auto` 允许模型从允许的工具中进行选择并生成消息。  
            `required` 要求模型调用一个或多个允许的工具。 
        - **场景二：强制选择指定工具**  
            在该场景下，强制模型调用 某一个特定函数工具，这里只能写一个 name，不能同时指定多个。
            - **type** `string` (必填) 
            对于函数调用，类型始终为function。 
            - **function** `object` (必填)
                - **name** `string` (必填)
                指定的工具名称
- **tools** `array`（可选）  
  可供模型调用的工具列表，支持自定义工具和函数工具。  
    - **function** `object` (必填)  
        - **name** `string` (必填)  
          要调用的函数名称。必须是 az、AZ、0-9，或者包含下划线和短横线，最大长度为 64 个字符。  
        - **description** `string` (可选)  
          对函数功能的描述，供模型选择何时以及如何调用该函数。  
        - **parameters** `object` (可选)  
          函数接受的参数以 JSON Schema 对象的形式描述。

    - **type** `string` (必填)
      工具类型。目前仅支持值为`function`。

- **top_logprobs** `integer`（可选）  
  0–20 之间的整数，指定在每个位置返回多少个最可能 token 及其对数概率。

- **top_p** `number`（可选，默认 `1`）  
  核采样（nucleus sampling）的 `top_p` 参数，控制只从累计概率质量前 `p` 的 token 中采样。

- **user** `string`（可选，已废弃）  
  已被 `safety_identifier` 与 `prompt_cache_key` 替代，过去用于传递终端用户标识。

- **verbosity** `string`（可选，默认 `medium`）  
  控制模型输出的详略程度，可选值包括 `low`、`medium`、`high`。

- **web_search_options** `object`（可选）  
  Web 搜索工具的配置，用于让模型在回答问题前主动检索互联网数据。

### 请求示例
#### 非流式调用
```python
from openai import OpenAI

client = OpenAI(
    base_url='https://api.omnimaas.com/v1',
    api_key='your_api_key'
)

completion = client.chat.completions.create(
    model="gpt-5.1",
    messages=[
        {"role": "developer", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
    ],
    temperature=0.7,
    top_p=0.9,
    n=1,
    stream=False,
    max_tokens=2000
)

print(completion.choices[0].message)
```

#### 流式调用

```python
from openai import OpenAI

client = OpenAI(
    base_url='https://api.omnimaas.com/v1',
    api_key='your_api_key'
)

completion = client.chat.completions.create(
    model="gpt-5.1",
    messages=[
        {"role": "developer", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
    ],
    stream=True
)

for chunk in completion:
    print(chunk.choices[0].delta)
```

### Response Body

以下为 `chat.completions` 接口响应结构的主要参数说明（与 OpenAI 官方语义保持一致）：

- **choices** `array`  
  聊天补全结果列表。如果请求中将 `n` 设置为大于 1，则该数组可能包含多个候选结果。  
  - **finish_reason** `string`  
    模型停止生成 token 的原因：  
    - `stop`：到达自然结束位置或命中提供的 stop 序列；  
    - `length`：达到请求中指定的最大生成 token 数；  
    - `content_filter`：部分内容被安全/内容过滤器屏蔽；  
    - `tool_calls`：模型调用了某个工具；  
    - `function_call`：模型调用了函数（已废弃，推荐使用 `tool_calls`）。  
  - **index** `integer`  
    当前 choice 在 `choices` 数组中的索引。  
  - **logprobs** `object`  
    当前 choice 的对数概率信息。  
  - **message** `object`  
    模型生成的一条聊天消息。  
    - **content** `string`  
      消息的正文内容。  
    - **refusal** `string`  
      当模型拒绝回答时，返回的拒绝说明文本。  
    - **role** `string`  
      消息作者的角色。  
    - **annotations** `array`  
      与该消息相关的标注信息（例如使用 Web 搜索工具时附带的注释）。  
    - **audio** `object`  
      当请求了音频输出模态时，包含该条回复的音频相关数据。  
    - **function_call** `object`（已废弃）  
      已被 `tool_calls` 替代。表示模型生成的函数调用名称及其参数。  
    - **tool_calls** `array`  
      模型生成的工具调用列表（例如函数调用等）。

- **created** `integer`  
  聊天补全创建时间的 Unix 时间戳（秒）。  

- **id** `string`  
  本次聊天补全的唯一标识符。  

- **model** `string`  
  实际用于生成本次聊天补全的模型 ID。  

- **object** `string`  
  对象类型，固定为 `chat.completion`。  

- **service_tier** `string`  
  实际用于处理本次请求的服务等级：  
  - `'auto'`：使用项目设置中的服务等级（默认通常为 `'default'`）；  
  - `'default'`：标准价格与性能；  
  - `'flex'` 或 `'priority'`：分别表示弹性/优先等级。  
  当设置了该字段时，响应中也会返回实际使用的 `service_tier`，它可能与请求中设置的值不同。  

- **system_fingerprint** `string`（已废弃）  
  表示当前请求所运行后台配置的指纹。通常与 `seed` 配合，用于判断后端变更对结果确定性的影响。  

- **usage** `object`  
  本次补全请求的 Token 使用统计。  
  - **completion_tokens** `integer`  
    补全（模型生成部分）使用的 token 数。  
  - **prompt_tokens** `integer`  
    提示词（输入部分）使用的 token 数。  
  - **total_tokens** `integer`  
    本次请求使用的 token 总数，即 `prompt + completion`。  
  - **completion_tokens_details** `object`  
    补全部分 token 使用的更细粒度拆分。  
  - **prompt_tokens_details** `object`  
    提示部分 token 使用的更细粒度拆分。  
    - **audio_tokens** `integer`  
      提示中包含的音频输入 token 数。  
    - **cached_tokens** `integer`  
      提示中命中缓存的 token 数。

### 响应示例
#### 非流式响应
``` python
{
  "id": "chatcmpl-B9MHDbslfkBeAs8l4bebGdFOJ6PeG",
  "object": "chat.completion",
  "created": 1741570283,
  "model": "gpt-5.1",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The image shows a wooden boardwalk path running through a lush green field or meadow. The sky is bright blue with some scattered clouds, giving the scene a serene and peaceful atmosphere. Trees and shrubs are visible in the background.",
        "refusal": null,
        "annotations": []
      },
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 1117,
    "completion_tokens": 46,
    "total_tokens": 1163,
    "prompt_tokens_details": {
      "cached_tokens": 0,
      "audio_tokens": 0
    },
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "audio_tokens": 0,
      "accepted_prediction_tokens": 0,
      "rejected_prediction_tokens": 0
    }
  },
  "service_tier": "default",
  "system_fingerprint": "fp_fc9f1d7035"
}
```

#### 流式响应
``` python
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4o-mini", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"role":"assistant","content":""},"logprobs":null,"finish_reason":null}]}

{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4o-mini", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"content":"Hello"},"logprobs":null,"finish_reason":null}]}

....

{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4o-mini", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{},"logprobs":null,"finish_reason":"stop"}]}
```
## 代码示例

### Python 示例

#### 使用OpenAI SDK（推荐）

```python
from openai import OpenAI

client = OpenAI(
    base_url='https://api.omnimaas.com/v1',
    api_key='YOUR_API_KEY'
)

# 非流式调用
completion = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "你好，请介绍一下你自己"}
    ],
    temperature=0.7
)

print(f"回复: {completion.choices[0].message.content}")
print(f"Token使用: {completion.usage}")
```

#### 流式调用

```python
from openai import OpenAI

client = OpenAI(
    base_url='https://api.omnimaas.com/v1',
    api_key='YOUR_API_KEY'
)

stream = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "讲个笑话"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end='', flush=True)
```

### Go 示例

#### 非流式调用

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

type ChatRequest struct {
    Model    string    `json:"model"`
    Messages []Message `json:"messages"`
}

type Message struct {
    Role    string `json:"role"`
    Content string `json:"content"`
}

type ChatResponse struct {
    Choices []struct {
        Message struct {
            Content string `json:"content"`
        } `json:"message"`
    } `json:"choices"`
}

func main() {
    reqBody := ChatRequest{
        Model: "gpt-4",
        Messages: []Message{
            {Role: "user", Content: "你好"},
        },
    }

    jsonData, _ := json.Marshal(reqBody)
    req, _ := http.NewRequest("POST", 
        "https://api.omnimaas.com/v1/chat/completions", 
        bytes.NewBuffer(jsonData))
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "Bearer YOUR_API_KEY")

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    var result ChatResponse
    json.Unmarshal(body, &result)
    
    fmt.Println(result.Choices[0].Message.Content)
}
```

### Node.js 示例

#### 使用OpenAI SDK（推荐）

```javascript
const OpenAI = require('openai');

const client = new OpenAI({
    baseURL: 'https://api.omnimaas.com/v1',
    apiKey: 'YOUR_API_KEY'
});

// 非流式调用
async function main() {
    const completion = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [
            { role: 'user', content: '你好，请介绍一下你自己' }
        ]
    });

    console.log(completion.choices[0].message.content);
}

main();
```

#### 流式调用

```javascript
const OpenAI = require('openai');

const client = new OpenAI({
    baseURL: 'https://api.omnimaas.com/v1',
    apiKey: 'YOUR_API_KEY'
});

async function main() {
    const stream = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: '讲个笑话' }],
        stream: true
    });

    for await (const chunk of stream) {
        process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }
}

main();
```
