import { Hono } from 'hono'
import { gemini, groq, mixtral, openai } from './llm'
import { swaggerUI } from '@hono/swagger-ui'
import { z } from '@hono/zod-openapi'
// import { serve } from "@hono/node-server";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi"; // <- add createRoute
import { cors } from 'hono/cors'
import { ChatOpenAI } from '@langchain/openai';


const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// app.doc("/doc", {
//   openapi: "3.0.0",
//   info: {
//     version: "1.0.0",
//     title: "My API",
//   },
// });

// Add CORS middleware
app.use('*', cors({
  origin: '*', // Be cautious with this in production
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}))




app.get('/ui', swaggerUI({ url: '/doc' }))


app.get('/api/generate', async (c) => {
  const prompt = c.req.query('prompt')
  const apiKey = c.req.query('apiKey')
  const model = c.req.query('model')

  let response = ''
  if (!prompt) {
    return c.json({ error: 'Prompt is required' }, 400)
  }
  if (!apiKey) {
    return c.json({ error: 'API key is required' }, 400)
  }
  if (model?.includes('gemini')) {
    response = await gemini(prompt, apiKey ?? '',model ?? '')
  } else if (model?.includes('mistral') || model?.includes('pixtral') || model?.includes('codestral')) {
    response = await mixtral(prompt, apiKey ?? '', model ?? '')
  } else if (model?.includes('gpt')) {
    response = await openai(prompt, apiKey ?? '', model ?? '')
  } else if (model?.includes('llama') || model?.includes('gemma') || model?.includes('groq-mixtral')) {
    // slice groq string 
    if (model?.includes('groq-mixtral')) {
      response = await groq(prompt.slice(4, -1), apiKey ?? '', model);
    }
    else {
      response = await groq(prompt, apiKey ?? '', model);
    }

  } else {
    response = 'Server Error : Invalid model'
  }
  return c.json({ response })
})

export default app
