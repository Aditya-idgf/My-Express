/**
 * ============================================================================
 * DISCORD BOT MINI-PROJECT
 * ============================================================================
 * SETUP GUIDE:
 * 1. Create a demo server on Discord for testing.
 * 2. Go to Discord Developer Portal -> Create Application -> Add Bot.
 * 3. OAuth2 -> URL Generator -> Select 'bot' & 'applications.commands' scopes.
 * 4. Select Admin permissions, copy URL, paste in browser to invite bot.
 * 5. IMPORTANT: Enable 'Message Content Intent' under the Bot tab.
 * ============================================================================
 */

// This is needed to access content from our .env file
require('dotenv').config();

const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');

// IMPORTING OUR COMMANDS:
// Here we are accessing the array of commands we exported from commands.js.
// It doesn't matter if they were built with Raw Objects or SlashCommandBuilder;
// they are all valid JSON objects now.
const commands = require('./commands.js'); 

// 🔒 SECURITY: NEVER put your real token in your code! Use environment variables.
const TOKEN = process.env.TOKEN; 
const CLIENT_ID = process.env.CLIENTID;

console.log(TOKEN, CLIENT_ID);

// ============================================================================
// 1. REGISTER SLASH COMMANDS TO DISCORD
// ============================================================================

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands...');

        // We pass the imported 'commands' array directly to Discord's API
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Failed to register commands:', error);
    }
})();

// ============================================================================
// 2. INITIALIZE CLIENT
// ============================================================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent 
    ]
});

// ============================================================================
// 3. EVENT LISTENERS
// ============================================================================

// Standard Message Listener
client.on('messageCreate', (message) => {
    if (message.author.bot) return; 
    message.reply({
        content: 'Sybau 🥀💔'   
    });
});

// Slash Command Interaction Listener
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // ACCESSING THE COMMANDS:
    // Discord doesn't care how the command was originally built. It just sends
    // back the 'commandName'. We check the name and reply accordingly.

    if (interaction.commandName === 'ping-raw') {
        await interaction.reply('Pong! (You triggered the Raw Object command)');
    }

    if (interaction.commandName === 'ping-builder') {
        await interaction.reply('Pong! (You triggered the Builder command)');
    }
});

client.once('ready', () => {
    console.log(`🤖 Bot is online and logged in as ${client.user.tag}`);
});

// ============================================================================
// 4. LOGIN
// ============================================================================

client.login(TOKEN);