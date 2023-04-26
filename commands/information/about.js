const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    EmbedBuilder
} = require('discord.js');
const os = require('os');
const commit = require('git-commit-count');

module.exports = {
    category: 'Information',
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Stats about the bot'),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */

    async execute(interaction, client) {
        commit();
        const commitcount = commit('benjisqt/portalplus');
        commitcount / 10;
        const name = interaction.guild.members.me.user.username;
        const icon = `${interaction.guild.members.me.displayAvatarURL()}`;
        let serverCount = await client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

        let ping = `${Date.now() - interaction.createdTimestamp}ms`;

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Support Server')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/sN8jnXZFGh'),

                new ButtonBuilder()
                .setLabel('Bot Invite')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/api/oauth2/authorize?client_id=1086014735771762789&permissions=8&scope=bot%20applications.commands')
            )

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setAuthor({
                name: name,
                iconURL: icon
            })
            .setThumbnail(`${icon}`)
            .setFooter({
                text: `Bot ID: ${interaction.guild.members.me.id}`
            })
            .setTimestamp()
            .addFields({
                name: 'Servers Joined',
                value: `${client.guilds.cache.size} servers`,
                inline: true
            }, {
                name: 'Developer',
                value: `${require('../../package.json').author || "None"}`,
                inline: true
            }, {
                name: 'Discord Latency',
                value: `${ping}`,
                inline: true
            }, {
                name: 'Registered Commands',
                value: `${client.commands.size} commands`,
                inline: true
            }, {
                name: 'Version',
                value: `1.${commitcount}`,
                inline: true
            }, {
                name: 'discord.js version',
                value: `${require('../../package.json').dependencies['discord.js'].replace('^', '')}`,
                inline: true
            }, {
                name: 'Uptime',
                value: `\`\`\`${uptime}\`\`\``,
            })

        return interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
}