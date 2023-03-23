const { ChatInputCommandInteraction, Client } = require('discord.js');
const replies = require('../../util/replies');

module.exports = {
    name: 'interactionCreate',
    
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        if(!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if(!command) return replies.Reply(interaction, 'Red', '🚫', `This command is outdated or has been removed.`, true);

        command.execute(interaction, client);
    }
}