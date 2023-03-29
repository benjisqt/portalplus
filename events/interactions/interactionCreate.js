const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const replies = require('../../util/replies');
const blacklistuser = require('../../models/blacklistuser');
const blacklistcmd = require('../../models/blacklistcmd');
const vip = require('../../models/vip');

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

        const bcmd = await blacklistcmd.findOne({ Guild: interaction.guildId });

        if(bcmd && bcmd.Commands.includes(interaction.commandName)) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Blacklisted! 🚫`)
                    .setDescription(`<@${interaction.member.id}>, this command has been blacklisted by an admin.\nThis command will be unavailable unless the blacklist is lifted.`)
                    .setColor('Red')
                ]
            })
            return console.log(`${interaction.user.id} tried using ${interaction.commandName}, but the command is blacklisted.`);
        }

        console.log(`${interaction.user.tag} ran /${interaction.commandName}`);

        const command = client.commands.get(interaction.commandName);

        if(!command) return replies.Reply(interaction, 'Red', '🚫', `This command is outdated or has been removed.`, true);

        const checkvip = await vip.findOne({ Guild: interaction.guildId });

        if(!checkvip && command.vip === true) return interaction.reply({ content: `You need a premium license to run this command!` });

        command.execute(interaction, client);
    }
}