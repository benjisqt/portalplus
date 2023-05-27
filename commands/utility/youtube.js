const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, Client, ChannelType } = require('discord.js');
const yt = require('../../YoutubePoster');

module.exports = {
    category: 'Utility',
    data: new SlashCommandBuilder()
    .setName('youtube')
    .setDescription('Receive notifications when your favourite YouTubers post!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand((sub) =>
        sub.setName('add')
        .setDescription('Add a channel to receieve notifications from!')
        .addStringOption((opt) =>
            opt.setName('link')
            .setDescription('The link of the channel you want to receive notifications from!')
            .setRequired(true)
        )
        .addChannelOption((opt) =>
            opt.setName('channel')
            .setDescription('The channel you want to receive the notifications in!')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) => 
        sub.setName('remove')
        .setDescription('Remove a youtube channel from receiving notifications!')
        .addStringOption((opt) =>
            opt.setName('link')
            .setDescription('The link of the channel you want to stop receiving notifications from!')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('removeall')
        .setDescription('Remove all channels from receiving notifications!')
    )
    .addSubcommand((sub) =>
        sub.setName('latestvideo')
        .setDescription('Get the latest video of a channel!')
        .addStringOption((opt) =>
            opt.setName('link')
            .setDescription('The link to the channel!')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('info')
        .setDescription('Get info on a youtube channel!')
        .addStringOption((opt) =>
            opt.setName('link')
            .setDescription('The link of the channel you want to get information on!')
            .setRequired(true)
        )
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const link = interaction.options.getString('link');
        const channel = interaction.options.getChannel('channel');
        const emoji = client.emojis.cache.get('1099831412451979284');
        const fail = client.emojis.cache.get('1102395290700496908');

        const sub = interaction.options.getSubcommand();

        const embed = new EmbedBuilder();

        switch(sub) {
            case 'add': {
                if(!channel.permissionsFor(client.user).has('SendMessages')) {
                    return interaction.reply({
                        embeds: [
                            embed.setTitle(`${fail} Portal+ has encountered an error.`)
                            .setDescription(`> The channel you selected, I am unable to send messages in. Please grant me this permission before continuing.`)
                            .setColor('Red')
                            .setFooter({ text: `Portal+` })
                            .setTimestamp()
                        ]
                    })
                }

                yt.setChannel(link, channel).then(data => {
                    interaction.reply({
                        embeds: [
                            embed.setTitle(`${emoji} Successfully Added YouTube Channel`)
                            .setDescription(`> You will now receive notifications to ${channel} whenever ${data.YTChannel} posts.`)
                            .setColor('Gold')
                            .setFooter({ text: `Portal+` })
                            .setTimestamp()
                        ]
                    });
                }).catch(err => {
                    console.log(err);
                    return interaction.reply({
                        embeds: [
                            embed.setTitle(`${fail} Portal+ Has Encountered An Error.`)
                            .setDescription(`> Portal+ encountered an error trying to add your YouTube channel.\nThe link you provided may have been an incorrect channel.`)
                            .setColor('Red')
                            .setFooter({ text: `Portal+ Error` })
                            .setTimestamp()
                        ]
                    })
                })
            }
            break;

            case 'remove': {
                yt.deleteChannel(interaction.guildId, link).then(data => {
                    interaction.reply({
                        embeds: [
                            embed.setTitle(`${emoji} Successfully removed YouTube channel`)
                            .setDescription(`> You will no longer receive notifications whenever ${data.YTChannel} posts.`)
                            .setColor('Gold')
                            .setFooter({ text: `Portal+` })
                            .setTimestamp()
                        ]
                    });
                }).catch(err => {
                    console.log(err);
                    return interaction.reply({
                        embeds: [
                            embed.setTitle(`${fail} Portal+ Has Encountered An Error.`)
                            .setDescription(`> Portal+ encountered an error trying to remove your YouTube channel.\nThe link you provided may have been an incorrect channel.`)
                            .setColor('Red')
                            .setFooter({ text: `Portal+ Error` })
                            .setTimestamp()
                        ]
                    })
                })  
            }
            break;

            case 'removeall': {
                yt.deleteAllChannels(interaction.guildId).then(data => {
                    interaction.reply({
                        embeds: [
                            embed.setTitle(`${emoji} Successfully removed all YouTube channels`)
                            .setDescription(`> You will no longer receive notifications when any channel posts.`)
                            .setColor('Gold')
                            .setFooter({ text: `Portal+` })
                            .setTimestamp()
                        ]
                    });
                }).catch(err => {
                    console.log(err);
                    return interaction.reply({
                        embeds: [
                            embed.setTitle(`${fail} Portal+ Has Encountered An Error.`)
                            .setDescription(`> Portal+ encountered an error trying to remove all YouTube channels.\nYou may not have any channels.`)
                            .setColor('Red')
                            .setFooter({ text: `Portal+ Error` })
                            .setTimestamp()
                        ]
                    })
                })  
            }
            break;

            case 'latestvideo': {
                yt.getLatestVideos(link).then(data => {
                    return interaction.reply({
                        embeds: [
                            embed.setTitle(`${data[0].title}`)
                            .setURL(data[0].link)
                        ]
                    })
                });
            }
            break;

            case 'info': {
                yt.getChannelInfo(link).then(data => {
                    return interaction.reply({
                        embeds: [
                            embed.setTitle(`${data.name}`)
                            .setFields(
                                { name: 'URL:', value: `${data.url}`, inline: true },
                                { name: 'Subscribers:', value: `${data.subscribers.split(" ")[0]}`, inline: true },
                                { name: 'Description', value: `${data.description}`, inline: false },
                            )
                            .setImage(data.banner[0].url)
                            .setTimestamp()
                        ]
                    })
                })
            }
            break;
        }
    }
}