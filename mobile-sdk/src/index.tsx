import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import axios from 'axios';

interface SmartChatbotProps {
  apiBaseUrl: string;
  language?: 'en' | 'ar';
  themeColor?: string;
  onConversationStart?: (conversationId: string) => void;
  userEmail?: string;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

export const SmartChatbotView: React.FC<SmartChatbotProps> = ({
  apiBaseUrl,
  language = 'en',
  themeColor = '#4f46e5',
  onConversationStart,
  userEmail,
}) => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    pushMessage('bot', language === 'ar' ? 'هلا والله! كيف أقدر أخدمك اليوم؟' : 'Hello! How can I assist you today?');
  }, []);

  const pushMessage = (sender: 'bot' | 'user', text: string) => {
    setMessages((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, sender, text }]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    pushMessage('user', text);

    try {
      const response = await axios.post(`${apiBaseUrl}/chatbot/message`, {
        conversationId,
        channel: 'mobile',
        message: text,
        language,
        userEmail,
      });
      if (!conversationId) {
        setConversationId(response.data.conversationId);
        onConversationStart?.(response.data.conversationId);
      }
      pushMessage('bot', response.data.response);
    } catch (error) {
      pushMessage('bot', language === 'ar' ? 'صار خطأ. حاول مرة ثانية لاحقاً.' : 'Something went wrong. Please try again later.');
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, borderColor: themeColor }]}> 
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { backgroundColor: themeColor }]}>
          <Text style={styles.headerTitle}>{language === 'ar' ? 'المساعد الذكي' : 'Smart Assistant'}</Text>
        </View>
        <View style={styles.messages}>
          {messages.map((message) => (
            <View key={message.id} style={[styles.message, message.sender === 'user' ? styles.messageUser : styles.messageBot]}>
              <Text style={message.sender === 'user' ? styles.messageTextUser : styles.messageText}>{message.text}</Text>
            </View>
          ))}
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={language === 'ar' ? 'اكتب رسالتك هنا' : 'Type a message'}
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={[styles.button, { backgroundColor: themeColor }]} onPress={sendMessage}>
            <Text style={styles.buttonText}>{language === 'ar' ? 'إرسال' : 'Send'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 6,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  messages: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  message: {
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  messageBot: {
    backgroundColor: '#f3f4f6',
    alignSelf: 'flex-start',
  },
  messageUser: {
    backgroundColor: '#4f46e5',
    alignSelf: 'flex-end',
  },
  messageText: {
    color: '#111827',
  },
  messageTextUser: {
    color: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SmartChatbotView;
