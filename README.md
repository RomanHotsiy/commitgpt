# commitgpt

Automatically generate commit messages using ChatGPT.

![commitgpt](https://user-images.githubusercontent.com/3975738/205517867-1e7533ae-a8e7-4c0d-afb6-d259635f3f9d.gif)

## Installation

To install CommitGPT, run the following command:

```bash
npm install -g commitgpt
```

## How to use?

```bash
npx commitgpt
```

### Get OpenAI API key

You need an OpenAI API key to use CommitGPT. You'll be securely prompted to enter your API key when you run the command. You can get one for free for 3 months using the link below:

<https://platform.openai.com/account/api-keys>

### Configuration (Optional)

You can create `.commitgpt.json` and/or `.commitgpt-template` config files in your home directory or the current working directory. The config files will be used to override the default settings.

#### `.commitgpt.json` file

Default:

```json
{
  "model": "text-davinci-003",
  "temperature": 0.5,
  "maxTokens": 2048
}
```

This file can be used to change the OpenAI model and other parameters.

#### `.commitgpt-template` file

Default:

```text
suggest 10 commit messages based on the following diff:
{{diff}}
commit messages should:
 - follow conventional commits
 - message format should be: <type>[scope]: <description>

examples:
 - fix(authentication): add password regex pattern
 - feat(storage): add new test cases
```

This file can be used to change the template used to generate the prompt request. You can modify the template to fit your needs.

You can also use the `--print-prompt` option to print the prompt that would be sent to the ChatGPT API instead of using the API. This is useful if you don't have an API key.

```bash
npx commitgpt --print-prompt
```

You can use the `--prompt-template` option to specify a custom GPT prompt template. Ensure that the template contains the `{{diff}}` placeholder.

```bash
npx commitgpt --prompt-template "suggest 10 commit messages based on the following diff: \
{{diff}}"
```

For more information, run `commitgpt --help`.

## How it works

- Runs `git diff --cached`
- Sends the diff to ChatGPT and asks it to suggest commit messages
- Shows suggestions to the user

## Credits

Some code and approaches were inspired by the awesome projects below:

- <https://github.com/acheong08/ChatGPT>
- <https://github.com/transitive-bullshit/chatgpt-api>
- <https://github.com/wong2/chat-gpt-google-extension>

---

Do you need API docs? Check out [Redocly](https://redocly.com).
