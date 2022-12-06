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

On the first run you will be asked to enter your OpenAI session token.

### Get your session token

1. Go to https://chat.openai.com/chat and log in or sign up.
2. Open console with `F12`.
3. Open `Application` > `Cookies`.
![image](https://user-images.githubusercontent.com/36258159/205494773-32ef651a-994d-435a-9f76-a26699935dac.png)
4. Copy the value for `__Secure-next-auth.session-token` and paste it into the terminal prompt.

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
