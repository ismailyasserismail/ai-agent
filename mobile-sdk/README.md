# Smart Chatbot React Native SDK

Embed the Smart Chatbot experience into React Native (Expo or bare) applications.

## Installation

```bash
npm install smart-chatbot-react-native
```

## Usage

```tsx
import React from 'react';
import { SafeAreaView } from 'react-native';
import { SmartChatbotView } from 'smart-chatbot-react-native';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SmartChatbotView apiBaseUrl="https://api.example.com" language="en" />
    </SafeAreaView>
  );
}
```

## Props

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `apiBaseUrl` | `string` | Backend API base URL |
| `language` | `'en' or 'ar'` | Optional language (default `en`) |
| `themeColor` | `string` | Customize primary color |
| `onConversationStart` | `(conversationId: string) => void` | Callback when a conversation starts |
| `userEmail` | `string` | Email forwarded for ticket creation |
