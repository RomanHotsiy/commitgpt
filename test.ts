import { OpenAIApi, Configuration } from 'openai'; 

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function run() {

    const resp = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Hello world",
        max_tokens: 2048,
        temperature: 0.2,
      });

      console.log(JSON.stringify(resp.data));
}


run().then(()=>{
    console.log("done");
})