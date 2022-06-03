import "dotenv/config"
import { exit } from "process"
import { Client } from "twitter-api-sdk"
import { TwitterApi } from "twitter-api-v2"

app(0)

async function app(retry: number) {
  const client = new Client(process.env.BEARER_TOKEN as string)

  const userClient = new TwitterApi({
    appKey: process.env.API_KEY as string,
    appSecret: process.env.API_KEY_SECRET as string,
    accessToken: process.env.ACCESS_TOKEN as string,
    accessSecret: process.env.ACCESS_TOKEN_SECRET as string,
  })

  const userId = await setRulesAndGetId(client, userClient)

  try {
    const stream = client.tweets.searchStream({
      "tweet.fields": ["id", "possibly_sensitive"]
    })

    for await (const tweet of stream) {
      retry = 0
      if (!tweet.data.possibly_sensitive) {
        userClient.v2.retweet(userId, tweet.data.id)
          .catch((e) => console.error(e))
      }
    }
  } catch (e) {
    console.error(e)

    if (retry > 7) {
      exit()
    }
    
    setTimeout(() => {
      console.warn("Reconnect attempt: ", retry)
      app(++retry)
    }, 2 ** retry)
  }
}

async function setRulesAndGetId(client: Client, userClient: TwitterApi) {
  try {
    await client.tweets.addOrDeleteRules({
      add: [
        { value: "#golang -is:retweet -is:reply lang:en" },
        { value: "#gopher -is:retweet -is:reply lang:en" },
      ],
    })

    const rules = await client.tweets.getRules()
    console.log(rules)

    return (await userClient.v2.me({ "user.fields": ["id"] })).data.id
  } catch (e) {
    console.error(e)
    exit()
  }
}