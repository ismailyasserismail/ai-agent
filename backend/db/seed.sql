INSERT INTO bot_intents (id, name, description, fallback)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'greeting', 'General greeting intent', FALSE),
  ('22222222-2222-2222-2222-222222222222', 'service_info', 'Information about services', FALSE),
  ('33333333-3333-3333-3333-333333333333', 'booking_request', 'Handle booking inquiries', FALSE),
  ('44444444-4444-4444-4444-444444444444', 'order_status', 'Track order status', FALSE),
  ('55555555-5555-5555-5555-555555555555', 'create_ticket', 'Create support tickets', FALSE),
  ('66666666-6666-6666-6666-666666666666', 'fallback_intent', 'Fallback intent', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO training_phrases (id, intent_id, phrase, language)
VALUES
  (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'hello', 'en'),
  (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'هلا', 'ar'),
  (uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 'what services do you offer?', 'en'),
  (uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 'وش خدماتكم؟', 'ar'),
  (uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', 'i need to book an appointment', 'en'),
  (uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', 'أبغى أحجز موعد', 'ar'),
  (uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'where is my order', 'en'),
  (uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'وش صار على طلبي؟', 'ar'),
  (uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', 'i need help', 'en'),
  (uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', 'أبغى مساعدة', 'ar')
ON CONFLICT DO NOTHING;

INSERT INTO users (id, email, password_hash, full_name, role)
VALUES
  (uuid_generate_v4(), 'admin@chatbot.local', crypt('Admin@123', gen_salt('bf')), 'Platform Admin', 'admin'),
  (uuid_generate_v4(), 'agent@chatbot.local', crypt('Agent@123', gen_salt('bf')), 'Support Agent', 'agent')
ON CONFLICT (email) DO NOTHING;

INSERT INTO bot_responses (id, intent_id, response_text, language)
VALUES
  (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'Hello! How can I assist you today?', 'en'),
  (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'هلا والله! كيف أقدر أخدمك اليوم؟', 'ar'),
  (uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 'We offer premium maintenance, installation, and support services.', 'en'),
  (uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 'حنا نقدم خدمات صيانة وتركيب ودعم على أعلى مستوى.', 'ar'),
  (uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', 'I can help with your booking. Please share your preferred date and time.', 'en'),
  (uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', 'يسعدني أساعدك بالحجز. متى الوقت اللي يناسبك؟', 'ar'),
  (uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'Let me check your order status. Could you provide your order number?', 'en'),
  (uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'خلني أتأكد من حالة طلبك. عطنا رقم الطلب لو تكرمت.', 'ar'),
  (uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', 'I will create a support ticket for you. Could you confirm your email?', 'en'),
  (uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', 'بسجل لك تذكرة دعم. ممكن تعطيني بريدك الإلكتروني؟', 'ar'),
  (uuid_generate_v4(), '66666666-6666-6666-6666-666666666666', "I'm not sure I understood. Let me connect you with a human agent.", 'en'),
  (uuid_generate_v4(), '66666666-6666-6666-6666-666666666666', 'ما فهمتك زين. بحولك على أحد الزملاء يساعدك.', 'ar')
ON CONFLICT DO NOTHING;

INSERT INTO conversations (id, user_id, channel, status)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, 'web', 'bot')
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (id, conversation_id, sender_type, sender_id, content, language)
VALUES
  (uuid_generate_v4(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'user', NULL, 'hello', 'en'),
  (uuid_generate_v4(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bot', NULL, 'Hello! How can I assist you today?', 'en')
ON CONFLICT (id) DO NOTHING;

INSERT INTO conversation_feedback (id, conversation_id, rating)
VALUES
  (uuid_generate_v4(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1)
ON CONFLICT (id) DO NOTHING;
