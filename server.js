const express = require("express");
const discord = require("discord.js");

const config = require("./config");
const messageBuilder = require("./message-builder");
const commandHandler = require("./command-handler");

const client = new discord.Client();
const app = express();

client.on("ready", function () {
    console.info(`logged in as ${client.user.tag}`);
});

client.on("message", function (msg) {
    let commandResponse = commandHandler.handleCommand(msg.content);
    if (commandResponse) {
        msg.channel.send(commandResponse);
    }
});

client.on("error", console.error);

app.use(express.json());

app.post("/jira", function (req, res) {
    if (req.body.timestamp) {
        console.log("event received:", req.body.webhookEvent);
        let eventResponse = messageBuilder.handleEvent(req.body, config);
        if (eventResponse) {
            client.channels
                .get(eventResponse.project.channelId)
                .send(eventResponse.notification);
            console.log("message sent:", eventResponse.project.name, req.body.webhookEvent);
        }
    }

    res.send("success");
});

app.listen(config.bot.port, config.bot.ip, function () {
    console.log(`live on ${config.bot.ip}:${config.bot.port}`);
    client.login(config.bot.token);
});