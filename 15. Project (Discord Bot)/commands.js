const { SlashCommandBuilder } = require('discord.js');

/**
 * ============================================================================
 * COMMAND DEFINITIONS
 * Both methods below are 100% correct. Discord's API only understands raw JSON data.
 * The SlashCommandBuilder is just a helper tool that generates that exact same JSON data.
 * ============================================================================
 */

// METHOD 1: The Raw Object Approach (Simple, direct, great for basic commands)
const pingCommandRaw = {
    name: 'ping-raw',
    description: 'Replies with Pong! (Created via Raw Object)',
};

// METHOD 2: The SlashCommandBuilder Approach (Provides auto-complete & validation)
// Note: We MUST chain .toJSON() at the end so it converts the builder into a raw object
// just like Method 1!
const pingCommandBuilder = new SlashCommandBuilder()
    .setName('ping-builder')
    .setDescription('Replies with Pong! (Created via Builder)')
    .toJSON();

// Export an array containing both commands so index.js can access them
module.exports = [pingCommandRaw, pingCommandBuilder];