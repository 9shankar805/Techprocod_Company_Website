# Chatbot Setup Guide

Your website now has a free AI chatbot assistant! Here's how to set it up:

## Option 1: With AI (Recommended)

### Get a Free Hugging Face API Key

1. Go to [huggingface.co](https://huggingface.co)
2. Sign up for a free account
3. Go to Settings → Access Tokens
4. Create a new token with "read" access
5. Copy the token

### Add to Your Environment

Create a `.env.local` file in the `tech-procod` directory:

```
HUGGINGFACE_API_KEY=your_token_here
```

Then restart your dev server:
```bash
npm run dev
```

## Option 2: Without API Key (Fallback Mode)

If you don't add an API key, the chatbot will still work with intelligent fallback responses based on keywords. It will:
- Recognize questions about services, pricing, contact, team, portfolio
- Provide relevant responses
- Direct users to appropriate pages

## Features

✅ Floating chat widget on all pages
✅ Real-time messaging
✅ Typing indicator
✅ Responsive design (works on mobile)
✅ Auto-scroll to latest messages
✅ Fallback responses if API is unavailable
✅ Professional styling matching your brand

## Customization

### Change the Bot's Personality

Edit `app/api/chat/route.ts` and modify the system prompt:

```typescript
inputs: `You are a helpful customer service assistant for a tech company. Answer the user's question concisely and professionally. User: ${message}\nAssistant:`,
```

### Customize Fallback Responses

Edit the `generateFallbackResponse()` function in `app/api/chat/route.ts` to add more keyword-based responses.

### Styling

The chatbot uses Tailwind CSS. Modify colors in `components/Chatbot.tsx`:
- Change `bg-blue-600` to your brand color
- Adjust `w-96` for different chat window width
- Modify `h-[600px]` for different height

## Troubleshooting

**Chatbot not appearing?**
- Clear browser cache
- Restart dev server
- Check browser console for errors

**API errors?**
- Verify your Hugging Face token is correct
- Check that the token has "read" access
- Ensure `.env.local` is in the correct directory

**Slow responses?**
- Hugging Face free tier has rate limits
- Consider upgrading to a paid plan for production
- Fallback mode will activate if API is unavailable

## Free Alternatives

If Hugging Face doesn't work for you, try:
- **Ollama** (local, completely free)
- **Together AI** (free tier available)
- **Replicate** (free tier available)
- **OpenRouter** (pay-as-you-go, very affordable)

## Production Deployment

When deploying to production:
1. Add your API key to your hosting platform's environment variables
2. Never commit `.env.local` to git
3. Test the chatbot thoroughly before going live
4. Monitor API usage and costs
