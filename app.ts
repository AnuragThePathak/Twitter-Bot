import "dotenv/config"
import { Client } from "twitter-api-sdk"

(async function () {
  const client = new Client(process.env.BEARER_TOKEN as string)

  await client.tweets.addOrDeleteRules({
    add: [
      { value: "#golang" },
      { value: "#gopher" },
      { value: "ipl" }
    ],
  })

  const rules = await client.tweets.getRules()
  console.log(rules)

  const stream = client.tweets.searchStream({
    "tweet.fields": ["id"]
  })

  for await (const tweet of stream) {
    console.log(tweet.data.text)
    console.log("\n\n\n")
  }
})()