# jira2discord

Bot for Discord with Jira integration.

## Configuration

In `config.js`:

```
bot: {
    token: '<token>', // discord api bot token
    port: 8080, // desired port for bot server to listen on
    ip: '0.0.0.0' // desired ip for bot server
}
```

In Jira:

Add webhook (https://developer.atlassian.com/server/jira/platform/webhooks/) with address and port where the bot is listening on, e.g.

```
bot.hostname.org:8080/jira
```

## Starting bot service

```
$ yarn
$ yarn start
```

## Starting bot service (through nodemon)

```
$ yarn
$ yarn nodemon
```

### Building embeds

`https://anidiotsguide_old.gitbooks.io/discord-js-bot-guide/content/examples/using-embeds-in-messages.html`
