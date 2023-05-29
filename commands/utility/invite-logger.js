const { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType, PermissionFlagsBits, Client, EmbedBuilder } = require('discord.js');
const invite = require('../../models/invite');
const { Reply, ReplyError } = require('../../util/replies');

module.exports = {
    category: 'Utility',
    data: new SlashCommandBuilder()
    .setName('invite-logger')
    .setDescription('Modify the invite logger system!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand((sub) =>
        sub.setName('setup')
        .setDescription('Enable/setup the invite logger system!')
        .addChannelOption((opt) =>
            opt.setName('channel')
            .setDescription('The channel you want to receive invite logger information in!')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('modify')
        .setDescription('Modify the invite logger system!')
        .addChannelOption((opt) =>
            opt.setName('channel')
            .setDescription('The new channel you want to receive invite logger information in!')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('disable')
        .setDescription('Disable the invite logger system!')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const { options, guild } = interaction;

        const sub = options.getSubcommand();

        const channel = options.getChannel('channel') || null;

        const data = await invite.findOne({ Guild: interaction.guildId });

        switch(sub) {
            case 'setup': {
                if(data) return ReplyError(interaction, client, `The invite logger has already been setup.`, true);

                if(channel.type !== ChannelType.GuildText || channel.type !== ChannelType.GuildAnnouncement) return ReplyError(
                    interaction,
                    client,
                    `That channel is not of type GuildText or GuildAnnouncement.`,
                    true
                );
                
                await invite.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id
                });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Successfully enabled invite logger`)
                        .setDescription(`> The invite logging system has been enabled.`)
                        .addFields(
                            { name: 'Channel', value: `${channel}`, inline: true },
                            { name: 'Guild', value: `${interaction.guild.name}` }
                        )
                        .setColor('Gold')
                    ]
                })
            }
            break;

            case 'modify': {
                if(!data) return ReplyError(interaction, client, `The invite logger is disabled.`, true);

                if(channel.type !== ChannelType.GuildText || channel.type !== ChannelType.GuildAnnouncement) return ReplyError(
                    interaction,
                    client,
                    `That channel is not of type GuildText or GuildAnnouncement.`,
                    true
                );
                
                invite.findOneAndUpdate({ Guild: interaction.guildId }, { Channel: channel.id }, { new: true });
                data.save();

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Successfully modified invite logger`)
                        .setDescription(`> The invite logging system has been modified.`)
                        .addFields(
                            { name: 'Channel', value: `${channel}`, inline: true },
                            { name: 'Guild', value: `${interaction.guild.name}` }
                        )
                        .setColor('Gold')
                    ]
                })
            }
            break;

            case 'disable': {
                if(!data) return ReplyError(interaction, client, `The invite logger has already been disabled.`, true);
                
                await invite.deleteMany({ Guild: interaction.guildId });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Successfully disabled invite logger`)
                        .setDescription(`> The invite logging system has been disabled.`)
                        .setColor('Gold')
                    ]
                })
            }
            break;
        }
    }
}