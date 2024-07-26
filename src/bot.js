// bot.js
const { client, clientLogin } = require("./client");
const loadCommands = require("./handlers/commands");
const loadComponents = require("./handlers/components");
const loadEvents = require("./handlers/events");

loadEvents(client, `./src/events`);
loadComponents(client, "./src/components");
loadCommands(client, `./src/commands`);
