# Local RAG

Run `nx serve ne-rag`

Will start service on http://localhost:3000

Now you can run this request.

```http request
POST localhost:3000/api/llamaindex/v1/completions
Content-Type: application/json

{
  "messages": [
    {
      "role": "system",
      "content": [
        {
          "type": "text",
          "text": "You helper to answer question about dynamic programming. You will give an answer only!!!. Without additional descriptions"
        }
      ]
    },
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "What is memoization?"
        }
      ]
    }
  ],
  "temperature": 1,
  "max_tokens": 2048,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0
}

```
