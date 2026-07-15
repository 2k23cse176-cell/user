import axios from 'axios';
import { readFile } from 'node:fs/promises';
import yaml from 'js-yaml';

const configPath = './.continue/config.yaml'; // Adjust path if needed

async function main() {
  // Read and parse YAML
  const file = await readFile(configPath, 'utf8');
  const config = yaml.load(file);

  // Extract API key
  const apiKey = config.models[0].apiKey;

  const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
  const stream = false;

  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Accept": stream ? "text/event-stream" : "application/json"
  };

  const payload = {
    "model": "google/gemma-4-31b-it",
    "messages": [{"role":"user","content":""}],
    "max_tokens": 16384,
    "temperature": 1.00,
    "top_p": 0.95,
    "stream": stream,
    "chat_template_kwargs": {"enable_thinking":true},
  };

  try {
    const response = await axios.post(invokeUrl, payload, {
      headers: headers,
      responseType: stream ? 'stream' : 'json'
    });

    if (stream) {
      response.data.on('data', (chunk) => {
        console.log(chunk.toString());
      });
    } else {
      console.log(JSON.stringify(response.data));
    }
  } catch (error) {
    console.error(error);
  }
}

main();
