# Golang Bot

- Twitter bot to amplify the voice of all Golang developers. There are no Twitter bot which retweets the tweets having #golang at this moment. That's why I thought of building one.
- It retweets every tweet having the hashtags #golang and #gopher (type-insensitive).
- Currently it is being hosted on Heroku under free tier, but without donations in upcoming days the bot won't be up 24 * 7 because Heroku limits number of hours to 550 per month. Being a student it's not possible for me to afford server cost at this moment.

## Tech specification

- [Twitter-api-typescript-sdk](https://github.com/twitterdev/twitter-api-typescript-sdk) is used for endpoints requiring OAuth 2.0 app-only token and [node-twitter-api-v2](https://github.com/PLhery/node-twitter-api-v2) is used for endpoints requiring OAuth 1.0a or OAuth 2.0 PKCE.
- CI/CD with Github Actions.
- Docker is used to containerize.

## Contribution and support

- Star the repository if you find it useful.
- Feel free to create issues if have any feedback or want any improvements.
- Contributions are always welcomed.
