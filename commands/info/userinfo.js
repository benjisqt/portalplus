const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder
} = require('discord.js');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Information on a user')
    .addUserOption((opt) =>
        opt.setName('user')
        .setDescription('The user you want to get information on')
    )
    .addBooleanOption((opt) =>
        opt.setName('silent')
        .setDescription('Whether command feedback should only be sent to you')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
        const silent = interaction.options.getBoolean('silent') || false;

        const activityType = [
            'Playing',
            'Streaming',
            'Listening To',
            'Watching',
            'Custom',
            'Competing In'
        ];

        const month = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ]
        
        const createdDate = new Date(user.createdTimestamp);
        const createdDay = createdDate.getDay().toLocaleString();
        const createdMonth = createdDate.getMonth().toLocaleString();
        const createdYear = createdDate.getFullYear().toString();
        const createdHour = createdDate.getHours().toLocaleString();
        const createdMins = createdDate.getMinutes().toLocaleString();

        // console.log(`${createdDay} ${month[createdMonth]} ${createdYear} ${createdHour} ${createdMins}`);

        const memberRoles = member.roles.cache.filter((roles) => roles.id !== interaction.guild.id).map((role) => role.toString());

        if(silent === true) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`${user.tag}`)
                    .addFields(
                        { name: 'Originated', value: `<t:${Math.round(user.createdTimestamp / 1000)}:f> <t:${parseInt(user.createdTimestamp / 1000)}:R>` },
                        { name: 'Joined', value: `<t:${Math.round(member.joinedTimestamp / 1000)}:f> <t:${Math.round(member.joinedTimestamp / 1000)}:R>` },
                    )
                    .setDescription(`${memberRoles}`)
                    .setImage('https://cdn.discordapp.com/attachments/895632161057669180/930131558168412230/void_red_bar.PNG')
                    .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
                ], ephemeral: true
            })
        } else {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`${user.tag}`)
                    .addFields(
                        { name: 'Originated', value: `<t:${Math.round(user.createdTimestamp / 1000)}:f> <t:${parseInt(user.createdTimestamp / 1000)}:R>` },
                        { name: 'Joined', value: `<t:${Math.round(member.joinedTimestamp / 1000)}:f> <t:${Math.round(member.joinedTimestamp / 1000)}:R>` },
                    )
                    .setDescription(`${memberRoles}`)
                    .setImage('https://cdn.discordapp.com/attachments/895632161057669180/930131558168412230/void_red_bar.PNG')
                    .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
                ]
            })
        }
    }
}