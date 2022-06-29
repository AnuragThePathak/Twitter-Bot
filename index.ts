import "dotenv/config"
import log from "loglevel"
import { exit } from "process"
import { Client } from "twitter-api-sdk"
import { TwitterApi } from "twitter-api-v2"

log.setDefaultLevel(log.levels.DEBUG)

if (process.env.NODE_ENV == "production") {
  log.setLevel(log.levels.INFO)
}

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
      log.debug(tweet)
      if (!tweet.data.possibly_sensitive) {
        userClient.v2.retweet(userId as string, tweet.data.id)
          .then((res) => log.debug(res.data.retweeted))
          .catch((e) => log.error(e))
      }
    }
  } catch (e) {
    log.error(e)

    if (retry > 7) {
      exit()
    }

    setTimeout(() => {
      log.warn("Reconnect attempt: ", retry)
      app(++retry)
    }, 2 ** retry)
  }
}

async function setRulesAndGetId(client: Client, userClient: TwitterApi) {
  try {
    await client.tweets.addOrDeleteRules({
      add: [
        { value: "#golang -is:retweet -is:reply lang:en -#100DaysOfCode -#php -MachineLearning -DataScience  -BigData -Analytics -AI -IIoT -Python -RStats -TensorFlow -JavaScript -ReactJS -DataScience -DataScientist -#C -#nodejs" },
      ],
    })

    const rules = await client.tweets.getRules()
    log.info(rules)

    const user = await userClient.v2.me({ "user.fields": ["id"] })
    log.debug(user)
    return user.data.id
  } catch (e) {
    log.error(e)
    exit()
  }
}