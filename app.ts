import "dotenv/config"
import { Client } from "twitter-api-sdk"
import { TwitterApi } from "twitter-api-v2"

(async function () {
  const client = new Client(process.env.BEARER_TOKEN as string)

  const userClient = new TwitterApi({
    appKey: process.env.API_KEY as string,
    appSecret: process.env.API_KEY_SECRET as string,
    accessToken: process.env.ACCESS_TOKEN as string,
    accessSecret: process.env.ACCESS_TOKEN_SECRET as string,
  })

  await client.tweets.addOrDeleteRules({
    add: [
      { value: "#golang -is:retweet -is:reply lang:en" },
      { value: "#gopher -is:retweet -is:reply lang:en" },
      { value: "#javascript"}
    ],
  })

  const rules = await client.tweets.getRules()
  console.log(rules)

  const user = await userClient.v2.me({"user.fields": ["id"]})

  const stream = client.tweets.searchStream({
    "tweet.fields": ["id", "text", "possibly_sensitive"]
  })

  for await (const tweet of stream) {
    console.log(tweet.data.text)
    console.log("\n\n\n")
    if (tweet.data.possibly_sensitive) {
      const result = await userClient.v2.retweet(process.env.TWITTER_ID as string,
         tweet.data.id)
      console.log(result.data.retweeted)
    }
  }
})()