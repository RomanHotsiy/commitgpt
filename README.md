# commitgpt

Automatically generate commit messages using ChatGPT.

![commitgpt](https://user-images.githubusercontent.com/3975738/205517867-1e7533ae-a8e7-4c0d-afb6-d259635f3f9d.gif)

## How to use?

```bash
npx commitgpt
```

### Get OpenAI api key
https://platform.openai.com/account/api-keys

### Configuration (Optional)
you can create `.commitgpt.json` and/or `..commitgpt-template` config files in your project root. 

#### `.commitgpt.json` file
default: 
```json
{
  "model": "text-davinci-003",
  "temperature": 0.5,
  "maxTokens": 2048,
}
```
this file can be used to change the openai model and other parameters.


### `.commitgpt-template` file
default:
```
suggest 10 commit messages based on the following diff:
{{diff}}
commit messages should:
 - follow conventional commits
 - message format should be: <type>[scope]: <description>

examples:
 - fix(authentication): add password regex pattern
 - feat(storage): add new test cases
```

this file can be used to change the template used to generate the prompt request. you can modify the template to fit your needs.

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
