# commitgpt - automatically generate commit messages using ChatGPT.



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

Go to https://chat.openai.com/chat and log in or sign up
1. Open console with `F12`
2. Open `Application` tab > Cookies
![image](https://user-images.githubusercontent.com/36258159/205494773-32ef651a-994d-435a-9f76-a26699935dac.png)
3. Copy the value for `__Secure-next-auth.session-token` and paste it into `config.json.example` under `session_token`. You do not need to fill out `Authorization`
![image](https://user-images.githubusercontent.com/36258159/205495076-664a8113-eda5-4d1e-84d3-6fad3614cfd8.png)
4. Save the modified file to `config.json` (In the current working directory)

## Credits

Some code and approaches were inspired by the awesome projects below:

- https://github.com/acheong08/ChatGPT
- https://github.com/transitive-bullshit/chatgpt-api
- https://github.com/wong2/chat-gpt-google-extension