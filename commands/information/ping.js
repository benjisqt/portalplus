const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const mongoose = require('mongoose');
const { Reply } = require('../../util/replies');

module.exports = {
    category: 'Information',
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Websocket and database ping')
    .addBooleanOption((opt) =>
        opt.setName('silent')
        .setDescription('Whether command feedback should only be sent to you')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction, client) {
        const silent = interaction.options.getBoolean('silent') || false;

        if(silent === true) {
            return Reply(interaction, 'Blurple', '🌐', `Client Websocket Ping: ${client.ws.ping}ms`, true);
        } else {
            return Reply(interaction, 'Blurple', '🌐', `Client Websocket Ping: ${client.ws.ping}ms`, false);
        }
    }
}