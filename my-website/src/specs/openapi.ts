const spec = {
  openapi: '3.0.3',
  info: {
    title: 'OmniMaaS API',
    version: '1.0.0',
    description:
      '统一的多模型推理接口。示例覆盖聊天补全与Token用量统计。',
  },
  servers: [
    {
      url: 'https://api.omnimaas.com/v1',
      description: '生产环境',
    },
  ],
  tags: [
    {
      name: 'Chat Completions',
      description: '多轮对话接口',
    },
  ],
  paths: {
    '/chat/completions': {
      post: {
        tags: ['Chat Completions'],
        summary: '创建聊天补全',
        operationId: 'createChatCompletion',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ChatCompletionRequest',
              },
              examples: {
                basic: {
                  summary: '基础对话',
                  value: {
                    model: 'claude-3-sonnet',
                    messages: [
                      {
                        role: 'user',
                        content: '解释下 MaaS 是什么？',
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: '正常响应',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ChatCompletionResponse',
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '429': {
            $ref: '#/components/responses/RateLimitError',
          },
        },
      },
    },
  },
  components: {
    responses: {
      UnauthorizedError: {
        description: '鉴权失败',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      RateLimitError: {
        description: '触发速率限制',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
    },
    schemas: {
      Message: {
        type: 'object',
        required: ['role', 'content'],
        properties: {
          role: {
            type: 'string',
            enum: ['system', 'user', 'assistant'],
          },
          content: {
            type: 'string',
          },
        },
      },
      ChatCompletionRequest: {
        type: 'object',
        required: ['model', 'messages'],
        properties: {
          model: {
            type: 'string',
            description: '兼容的模型 ID（Claude/Gemini/OpenAI）',
            example: 'gpt-4o-mini',
          },
          messages: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Message',
            },
          },
          temperature: {
            type: 'number',
            format: 'float',
            default: 1.0,
          },
          top_p: {
            type: 'number',
            format: 'float',
            default: 1.0,
          },
          stream: {
            type: 'boolean',
            default: false,
          },
        },
      },
      ChoiceMessage: {
        type: 'object',
        properties: {
          role: {
            type: 'string',
            enum: ['assistant'],
          },
          content: {
            type: 'string',
          },
        },
      },
      Choice: {
        type: 'object',
        properties: {
          index: {
            type: 'integer',
          },
          finish_reason: {
            type: 'string',
          },
          message: {
            $ref: '#/components/schemas/ChoiceMessage',
          },
        },
      },
      Usage: {
        type: 'object',
        properties: {
          prompt_tokens: {
            type: 'integer',
          },
          completion_tokens: {
            type: 'integer',
          },
          total_tokens: {
            type: 'integer',
          },
        },
      },
      ChatCompletionResponse: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          model: {
            type: 'string',
          },
          choices: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Choice',
            },
          },
          usage: {
            $ref: '#/components/schemas/Usage',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
              },
              type: {
                type: 'string',
              },
              code: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
} as const;

export default spec;

