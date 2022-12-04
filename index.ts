import { ChatGPTAPI } from 'chatgpt'

async function example() {
  const api = new ChatGPTAPI()

  // open chromium and wait until you've logged in
  await api.init({ auth: 'blocking' })

  // send a message and wait for the response
  const response = await api.sendMessage(
    'Write a python version of bubble sort. Do not include example usage.'
  )

  // response is a markdown-formatted string
  console.log(response)
}

example();