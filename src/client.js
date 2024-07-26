// client.js
const { Client, GatewayIntentBits, Partials, Options, Collection } = require("discord.js");
require("dotenv").config();
const config = require("../config.json");
const logger = require("./utils/functions/tools/logging/logger");
const { gray, bold } = require("colorette");

const debug = process.env.DEBUG_MODE === "true";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.ThreadMember, Partials.GuildMember, Partials.Message],
  sweepers: {
    ...Options.DefaultSweeperSettings,
    messages: {
      interval: 3600, // Every hour...
      lifetime: 1800, // Remove messages older than 30 minutes.
    },
    users: {
      interval: 3600, // Every hour...
      lifetime: 1800,
      filter: () => user => user.id !== client.user.id, // Remove all bots.
    },
    threadMembers: {
      interval: 3600, // Every hour...
      lifetime: 1800,
      filter: () => user => user.id !== client.user.id, // Remove all bots.
    },
    threads: {
      interval: 3600, // Every hour...
      lifetime: 1800,
      filter: () => user => user.id !== client.user.id, // Remove all bots.
    },
  },
  makeCache: Options.cacheWithLimits({
    ApplicationCommandManager: 0,
    AutoModerationRuleManager: 0,
    BaseGuildEmojiManager: 0,
    GuildBanManager: 0,
    GuildEmojiManager: 0,
    GuildForumThreadManager: 0,
    GuildInviteManager: 0,
    GuildMemberManager: 3,
    GuildScheduledEventManager: 0,
    GuildStickerManager: 0,
    GuildStickerPackManager: 0,
    GuildTextThreadManager: 3,
    MessageManager: 5,
    PresenceManager: 0,
    ReactionManager: 0,
    ReactionUserManager: 0,
    StageInstanceManager: 0,
    ThreadManager: 3,
    ThreadMemberManager: 3,
    UserManager: 3,
    VoiceStateManager: 0,
    GuildMessageManager: 3,
    DMMessageManager: 0,
  }),
});

// if (debug) {
//   client.on('debug', console.log).on('warn', console.log);
// }

process.on("unhandledRejection", error => {
  logger("Error", "Unhandled promise rejection:", bold(error.message), "from:", gray(error.stack));
});

client.config = config;
client.commands = new Collection();
client.globalCommandArray = [];
client.localCommandArray = [];
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.disabledUsers = new Collection();
client.disabledGuilds = new Collection();
client.queue = {};
client.debug = debug;
client.maintenance = {
  active: false,
  disabledModules: [],
  reason: null,
};

const clientLogin = client.login(process.env.TOKEN);

module.exports = { client, clientLogin };
