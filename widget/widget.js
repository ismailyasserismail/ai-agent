(function () {
  const styles = `
    .smart-chatbot-launcher {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--smart-chatbot-primary, #4f46e5);
      color: white;
      border-radius: 999px;
      padding: 12px 20px;
      font-family: 'Segoe UI', sans-serif;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      z-index: 9999;
    }
    .smart-chatbot-window {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 360px;
      height: 520px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999;
      font-family: 'Segoe UI', sans-serif;
    }
    .smart-chatbot-header {
      background: var(--smart-chatbot-primary, #4f46e5);
      color: white;
      padding: 16px;
      font-size: 16px;
      font-weight: 600;
    }
    .smart-chatbot-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: #f9fafb;
    }
    .smart-chatbot-input {
      display: flex;
      padding: 12px;
      gap: 8px;
    }
    .smart-chatbot-input input {
      flex: 1;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      font-size: 14px;
    }
    .smart-chatbot-input button {
      background: var(--smart-chatbot-primary, #4f46e5);
      border: none;
      border-radius: 8px;
      color: white;
      padding: 0 16px;
      cursor: pointer;
    }
    .smart-chatbot-message {
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;
    }
    .smart-chatbot-message.bot {
      align-items: flex-start;
    }
    .smart-chatbot-message.user {
      align-items: flex-end;
    }
    .smart-chatbot-message span {
      padding: 10px 14px;
      border-radius: 12px;
      background: white;
      max-width: 80%;
      line-height: 1.4;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.1);
    }
    .smart-chatbot-message.user span {
      background: var(--smart-chatbot-primary, #4f46e5);
      color: white;
    }
  `;

  function addStyles() {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
  }

  function createWidget(config) {
    const launcher = document.createElement('div');
    launcher.className = 'smart-chatbot-launcher';
    launcher.textContent = config.language === 'ar' ? 'كلمنا' : 'Chat with us';

    const windowEl = document.createElement('div');
    windowEl.className = 'smart-chatbot-window';

    const header = document.createElement('div');
    header.className = 'smart-chatbot-header';
    header.textContent = config.language === 'ar' ? 'المساعد الذكي' : 'Smart Assistant';

    const messages = document.createElement('div');
    messages.className = 'smart-chatbot-messages';

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'smart-chatbot-input';
    const input = document.createElement('input');
    input.placeholder = config.language === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message...';
    const button = document.createElement('button');
    button.textContent = config.language === 'ar' ? 'إرسال' : 'Send';

    inputWrapper.appendChild(input);
    inputWrapper.appendChild(button);

    windowEl.appendChild(header);
    windowEl.appendChild(messages);
    windowEl.appendChild(inputWrapper);

    document.body.appendChild(launcher);
    document.body.appendChild(windowEl);

    launcher.addEventListener('click', () => {
      windowEl.style.display = windowEl.style.display === 'flex' ? 'none' : 'flex';
      windowEl.style.flexDirection = 'column';
      if (messages.childElementCount === 0) {
        pushMessage('bot', config.language === 'ar' ? 'هلا والله! كيف أقدر أخدمك اليوم؟' : 'Hello! How can I help you today?');
      }
    });

    button.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        sendMessage();
      }
    });

    let conversationId = null;

    function pushMessage(sender, text) {
      const message = document.createElement('div');
      message.className = `smart-chatbot-message ${sender}`;
      const bubble = document.createElement('span');
      bubble.textContent = text;
      message.appendChild(bubble);
      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
    }

    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;
      pushMessage('user', text);
      input.value = '';

      try {
        const response = await fetch(`${config.apiBaseUrl}/chatbot/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId,
            channel: 'web',
            message: text,
            language: config.language,
          }),
        });
        const data = await response.json();
        conversationId = data.conversationId;
        pushMessage('bot', data.response);
      } catch (error) {
        pushMessage('bot', config.language === 'ar' ? 'صار خطأ، حاول مرة ثانية لاحقاً.' : 'Something went wrong. Please try again later.');
      }
    }
  }

  window.SmartChatbotWidget = {
    init(config) {
      addStyles();
      document.documentElement.style.setProperty('--smart-chatbot-primary', config.primaryColor || '#4f46e5');
      createWidget(config);
    },
  };
})();
