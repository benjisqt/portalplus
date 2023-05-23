const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, ChannelType, Client, EmbedBuilder } = require('discord.js');
const welcomeChannel = require('../../models/welcomeChannel');

module.exports = {
    category: 'Utility',
    data: new SlashCommandBuilder()
    .setName('welcomechannel')
    .setDescription('Setup a welcome channel and message!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand((sub) =>
        sub.setName('setup')
        .setDescription('Setup the welcome channel and message!')
        .addChannelOption((opt) =>
            opt.setName('channel')
            .setDescription('The channel you want to set as the welcome channel')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
        .addStringOption((opt) =>
            opt.setName('message')
            .setDescription('The message you want to be sent')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('remove')
        .setDescription('Remove the welcome channel system')
    )
    .addSubcommand((sub) =>
        sub.setName('editchannel')
        .setDescription('Edit the channel used in the welcome system')
        .addChannelOption((opt) =>
            opt.setName('channel')
            .setDescription('The channel you want to set as the new channel')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('editmsg')
        .setDescription('Edit the message used in the welcome system')
        .addStringOption((opt) =>
            opt.setName('message')
            .setDescription('The message you want to set as the new message')
            .setRequired(true)
        )
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message');
        const sub = interaction.options.getSubcommand();

        const data = await welcomeChannel.findOne({ Guild: interaction.guildId });

        switch(sub) {
            case 'setup': {
                if(data) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`🛑 | The welcome channel system has already been set up. Please run the commands below to make modifications:\n\n\`/welcomechannel editchannel\`\n\`/welcomechannel editmsg\``)
                        .setColor('Red')
                    ]
                });

                if(!channel.permissionsFor(interaction.guild.members.me).has('SendMessages')) return interaction.reply({
                    embeds: [ new EmbedBuilder() .setDescription(`🛑 | I do not have permissions to Send Messages in that channel.`) .setColor('Red') ]
                });

                await welcomeChannel.create({
                    Guild: interaction.guildId,
                    Channel: channel.id,
                    Message: message
                });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder().
                        setTitle(`Welcome Channel and Message Assigned`).
                        setDescription(`The welcome channel and message have been assigned!`).
                        setFields(
                            { name: 'Channel', value: `${channel}` },
                            { name: 'Message', value: `${message}` },
                        ).
                        setColor('Gold')
                    ]
                })
            }
            break;

            case 'remove': {
                if(!data) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`🛑 | The welcome channel has not been setup.`)
                        .setColor('Red')
                    ]
                });

                await welcomeChannel.deleteMany({ Guild: interaction.guildId }, { new: true });
                
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Successfully Removed Welcome Channel and Message`)
                        .setDescription(`> I have successfully removed the welcome channel and message.`)
                        .setColor('Gold')
                    ]
                });
            }
            break;

            case 'editchannel': {
                if(!data) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`🛑 | The welcome channel has not been setup.`)
                        .setColor('Red')
                    ]
                });

                if(!channel.permissionsFor(interaction.guild.members.me).has('SendMessages')) return interaction.reply({
                    embeds: [ new EmbedBuilder() .setDescription(`🛑 | I do not have permissions to Send Messages in that channel.`) .setColor('Red') ]
                });

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Channel Updated`)
                        .setDescription(`> The welcome channel has been updated.`)
                        .addFields(
                            { name: 'Old Channel', value: `<#${data.Channel}>` },
                            { name: 'New Channel', value: `<#${channel.id}>` }
                        )
                        .setColor('Gold')
                    ]
                })

                data.Channel = channel.id;

                return data.save();
            }
            break;

            case 'editmsg': {
                if(!data) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`🛑 | The welcome channel has not been setup.`)
                        .setColor('Red')
                    ]
                });

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Message Updated`)
                        .setDescription(`> The welcome message has been updated.`)
                        .addFields(
                            { name: 'Old Message', value: `${data.Message}` },
                            { name: 'New Channel', value: `${message}` }
                        )
                        .setColor('Gold')
                    ]
                })

                data.Message = `${message}`;

                return data.save();
            }
            break;
        }
    }
}