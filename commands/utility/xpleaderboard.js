const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client } = require('discord.js');
const xp = require('../../models/xp');
const { Reply } = require('../../util/replies');

module.exports = {
    category: 'Utility',
    data: new SlashCommandBuilder()
    .setName('xpleaderboard')
    .setDescription('See the XP leaderboard!'),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const emoji = client.emojis.cache.get('1109200047414968380');

        let leaderboardembed = new EmbedBuilder()
        .setTitle(`🏆 **Top 10 XP Earners** ${emoji}`)
        .setColor(0x45d6fd)
        .setFooter({ text: `You are not ranked yet.` });

        const alldata = await xp.find({ Guild: interaction.guildId });

        const sortedUsers = alldata.sort((a, b) => {
            if(b.Level === a.Level) {
                return (b.XP) - (a.XP)
            }
            return (b.Level) - (a.Level)
        }).slice(0, 10);

        leaderboardembed.setDescription(sortedUsers.map((user, index) => {
            return `**\`[ ${index + 1} ]\`** : **<@${user.User}>** : \` Level ${user.Level}, ${user.XP} XP \``
        }).join('\n'));

        return interaction.reply({
            embeds: [leaderboardembed]
        })
    }
}