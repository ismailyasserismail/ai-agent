# Smart Chatbot Web Widget

Embed the chatbot widget on any website by including the script below:

```html
<script src="https://cdn.example.com/smart-chatbot/widget.js" defer></script>
<script>
  window.SmartChatbotWidget.init({
    apiBaseUrl: 'https://your-domain.com/api',
    primaryColor: '#4f46e5',
    language: 'en'
  });
</script>
```

During local development, reference the file from this repository by serving it via any static file server.
