const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const replies = require('../../util/replies');
const blacklistuser = require('../../models/blacklistuser');

module.exports = {
    name: 'interactionCreate',
    
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        if(!interaction.isChatInputCommand()) return;

        const data = await blacklistuser.findOne({ Guild: interaction.guildId });

        if(data && data.UserIDs.includes(interaction.user.id)) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Blacklisted! 🚫`)
                    .setDescription(`<@${interaction.member.id}>, you have been blacklisted.\nYou will not be able to use commands unless your blacklist is lifted.`)
                    .setColor('Red')
                ]
            })
            return console.log(`${interaction.user.id} tried using ${interaction.commandName}, but is blacklisted in ${interaction.guild.name}.`);
        }

        console.log(`${interaction.user.tag} ran /${interaction.commandName}`);

        const command = client.commands.get(interaction.commandName);

        if(!command) return replies.Reply(interaction, 'Red', '🚫', `This command is outdated or has been removed.`, true);

        command.execute(interaction, client);
    }
}