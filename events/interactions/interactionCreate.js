const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const replies = require('../../util/replies');
const blacklistuser = require('../../models/blacklistuser');
const blacklistcmd = require('../../models/blacklistcmd');
const vip = require('../../models/vip');
const vipcodes = require('../../models/vipcodes');
const chalk = require('chalk');
const cooldown = new Set();

module.exports = {
    name: 'interactionCreate',
    
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        if(!interaction.isChatInputCommand()) return;
        if(interaction.user.bot) return;

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

        if(!checkvip && command.vip === true) {
            interaction.reply({ content: `You need a premium license to run this command!` });
            return console.log(`${chalk.magenta(chalk.italic(`System`))} ${chalk.white(chalk.bold(`>>`))} ${chalk.red(chalk.bold(`${interaction.user.tag} attempted to use a premium command!`))}`);
        }
        if(command.owner === true && interaction.member.id != '1005460072274595960'){
            interaction.reply({ content: `This is an owner-only command!` });
            return console.log(`${chalk.magenta(chalk.italic(`System`))} ${chalk.white(chalk.bold(`>>`))} ${chalk.red(chalk.bold(`${interaction.user.tag} attempted to use an owner-only command!`))}`);
        }

        if(command.disabled === true) return replies.Reply(interaction, 'Red', '❗️', 'This command has been globally disabled by the bot owner.', true);

        if(interaction.commandName === 'marry') {
            if(cooldown.has(interaction.user.id)) return replies.Reply(interaction, 'Red', '❗️', 'This command is on cooldown.', true);

            setTimeout(() => {
                cooldown.delete(interaction.user.id);
            }, 30000)

            try {
                await command.execute(interaction, client);
            } catch(err) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`❌ Error`)
                        .setDescription(`> ${err}`)
                        .setColor('Red')
                        .setTimestamp()
                    ], ephemeral: true
                })
            }
        }

        const coldown = command.cooldown || 0;
        const cmdcooldown = coldown * 1000;

        var t = new Date();
        t.setSeconds(t.getSeconds() + coldown);

        if(cooldown.has(interaction.user.id)) return replies.ReplyError(interaction, client, `This command is on cooldown for ${coldown} seconds.`, true);

        cooldown.add(interaction.user.id);

        setTimeout(() => {
            cooldown.delete(interaction.user.id);
        }, cmdcooldown);
        
        try {
            await command.execute(interaction, client);
        } catch(err) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`❌ Error`)
                    .setDescription(`> ${err}`)
                    .setColor('Red')
                    .setTimestamp()
                ], ephemeral: true
            })
        }
    }
}