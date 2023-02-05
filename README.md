# commitgpt

Automatically generate commit messages using ChatGPT.

![commitgpt](https://user-images.githubusercontent.com/3975738/205517867-1e7533ae-a8e7-4c0d-afb6-d259635f3f9d.gif)

## How to use?

```bash
npx commitgpt
```

or use `-c` for [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) format.

```bash
npx commitgpt -c
```


### Getting Your OpenAI API Key and Setting the Environment Variable

1. Sign up for an OpenAI account and log in to the OpenAI dashboard: https://beta.openai.com/signup
2. Generate a new API key by clicking on the "API Keys" tab and then clicking on the "Create API Key" button.
3. Copy the API key to your clipboard.
4. Open a terminal or command prompt and set the environment variable with the API key using the following command (replace "YOUR_API_KEY" with the actual API key you copied in step 3):

```bash
export OPENAI_API_KEY="YOUR_API_KEY"
```
5. Verify that the environment variable has been set correctly by running the following command:

```bash
echo $OPENAI_API_KEY
```
This should print the value of the `OPENAI_API_KEY` environment variable, which should be the API key you set in step 4.

Note: The steps to set environment variables may differ based on your operating system. For more information, you can refer to the documentation for your specific operating system.

## How it works

- Runs `git diff --cached`
- Sends the diff to ChatGPT and asks it to suggest commit messages
- Shows suggestions to the user

## Credits

Some code and approaches were inspired by the awesome projects below:

- https://github.com/acheong08/ChatGPT
- https://github.com/transitive-bullshit/chatgpt-api
- https://github.com/wong2/chat-gpt-google-extension

----

Do you need API docs? Check out [Redocly](https://redocly.com).
