# Integrations Overview

The Smart Chatbot system ships with demo connectors for CRM and order management. Replace the placeholder logic with real integrations as needed.

## CRM Connector
- Location: `backend/src/modules/integrations/crm.service.ts`
- Exposes helper methods to lookup contacts and create support tickets.
- Replace mock data with live CRM API calls (e.g., HubSpot, Salesforce).

## Order Tracking Connector
- Location: `backend/src/modules/integrations/order.service.ts`
- Demonstrates how to fetch order status from an external service.
- Update the data source to query your order management system.

## Sample Payloads

### CRM Ticket
```json
{
  "subject": "Support request from customer@example.com",
  "description": "Customer reported an issue with the booking flow",
  "email": "customer@example.com"
}
```

### Order Status Request
```http
GET /api/integrations/orders/ORD-1001
```

## Extending Channels
WhatsApp Business API and Instagram connectors can be enabled by setting the environment variables `ENABLE_WHATSAPP` or `ENABLE_INSTAGRAM` to `true`. Implement the actual channel logic within `backend/src/modules/chatbot/chatbot.service.ts` and associated channel adapters.
