import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'html',
      value: '<div style="font-weight: 700; color: #000; font-size: 14px; padding: 8px 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px;">开始使用</div>',
    },
    '快速开始',
    {
      type: 'html',
      value: '<div style="font-weight: 700; color: #000; font-size: 14px; padding: 8px 0 4px 0; letter-spacing: 0.5px;">文本对话</div>',
    },
    '文本对话/对话补全',
    {
      type: 'html',
      value: '<div style="font-weight: 700; color: #000; font-size: 14px; padding: 8px 0 4px 0; letter-spacing: 0.5px;">图像生成</div>',
    },
    '图像生成/OpenAI格式',
    '图像生成/Qwen&Wan图像生成',
    {
      type: 'html',
      value: '<div style="font-weight: 700; color: #000; font-size: 14px; padding: 8px 0 4px 0; letter-spacing: 0.5px;">视频生成</div>',
    },
    {
      type: 'doc',
      id: '视频生成/Sora',
      label: 'Sora',
    },
    {
      type: 'doc',
      id: '视频生成/Vidu',
      label: 'Vidu',
    },
    {
      type: 'doc',
      id: '视频生成/Kling',
      label: 'Kling',
    },
    {
      type: 'doc',
      id: '视频生成/Jimeng',
      label: 'Jimeng',
    },
    {
      type: 'doc',
      id: '视频生成/Wan视频',
      label: 'Wan视频',
    },
    {
      type: 'html',
      value: '<div style="font-weight: 700; color: #000; font-size: 14px; padding: 8px 0 4px 0; letter-spacing: 0.5px;">SDK 集成</div>',
    },
    'SDK集成/使用OpenAI_SDK',
    'SDK集成/使用Anthropic_SDK',
    'SDK集成/使用Google_AI_SDK',
    {
      type: 'html',
      value: '<div style="font-weight: 700; color: #000; font-size: 14px; padding: 8px 0 4px 0; letter-spacing: 0.5px;">客户端工具</div>',
    },
    {
      type: 'doc',
      id: 'client-integration/cherry_studio',
      label: 'Cherry Studio',
    },
  ],
};

export default sidebars;
