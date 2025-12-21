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
      value: '<div style="font-weight: 700; color: #000; font-size: 14px; padding: 8px 0 4px 0; letter-spacing: 0.5px;">平台能力</div>',
    },
    'Chat Completions/OpenAI官方格式',
    'Chat Completions/Claude官方格式',
    'Chat Completions/Gemini官方格式',
    {
      type: 'html',
      value: '<div style="font-weight: 700; color: #000; font-size: 14px; padding: 8px 0 4px 0; letter-spacing: 0.5px;">视频生成</div>',
    },
    {
      type: 'doc',
      id: 'Chat Completions/Vidu',
      label: 'Vidu、Kling、Jimeng格式',
    },
    {
      type: 'html',
      value: '<div style="font-weight: 700; color: #000; font-size: 14px; padding: 8px 0 4px 0; letter-spacing: 0.5px;">图像生成</div>',
    },
    '图像生成/OpenAI格式',
  ],
};

export default sidebars;
