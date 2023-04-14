const { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType } = require('discord.js');
const boost = require('../../models/boost');

module.exports = {
    category: 'Config',
    data: new SlashCommandBuilder()
        .setName('boostdetection')
        .setDescription('Nitro Boost Detection!')
        .addSubcommand((sub) =>
            sub.setName('enable')
                .setDescription('Enable the boost detection system')
                .addChannelOption((opt) =>
                    opt.setName('channel')
                        .setDescription('The channel you want boost messages to be sent to!')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
                .addBooleanOption((opt) =>
                    opt.setName('silent')
                        .setDescription('Whether command feedback should only be sent to you')
                )
        )
        .addSubcommand((sub) =>
            sub.setName('edit')
                .setDescription('Edit the channel used in the boost detection system')
                .addChannelOption((opt) =>
                    opt.setName('channel')
                        .setDescription('The channel you want boost messages to be sent to!')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
                .addBooleanOption((opt) =>
                    opt.setName('silent')
                        .setDescription('Whether command feedback should only be sent to you')
                )
        )
        .addSubcommand((sub) =>
            sub.setName('disable')
                .setDescription('Disable the boost detection system')
                .addBooleanOption((opt) =>
                    opt.setName('silent')
                        .setDescription('Whether command feedback should only be sent to you')
                )
        ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const silent = interaction.options.getBoolean('silent') || false;

        const data = await boost.findOne({ Guild: interaction.guildId });

        switch (sub) {
            case 'enable': {
                const channel = interaction.options.getChannel('channel');

                if (data) {
                    return interaction.reply({ content: `Boost detection is already enabled, you need to use /boostdetection edit to edit the channel!`, ephemeral: true });
                } else {
                    await new boost({
                        Guild: interaction.guildId,
                        Channel: channel.id
                    }).save();
                    if(silent === true) {
                        return interaction.reply({ content: `Boost detection has been enabled! Boost messages will be sent to <#${channel.id}>`, ephemeral: true });
                    } else {
                        return interaction.reply({ content: `Boost detection has been enabled! Boost messages will be sent to <#${channel.id}>` });
                    }
                }
            }
                break;

            case 'disable': {
                if(!data) return interaction.reply({ content: `The boost detection system is already disabled!`, ephemeral: true });
                boost.findOneAndDelete({ Guild: interaction.guildId });
                if(silent === true) {
                    return interaction.reply({ content: `Boost detection disabled!`, ephemeral: true });
                } else {
                    return interaction.reply({ content: `Boost detection disabled!` });
                }
            }
                break;
            
            case 'edit': {
                const channel = interaction.options.getChannel('channel');
                if(!data) return interaction.reply({ content: `The boost detection system is disabled!`, ephemeral: true });
                boost.findOneAndUpdate({ Guild: interaction.guildId }, { Channel: channel.id }, { new: true });
                if(silent === true) {
                    return interaction.reply({ content: `Boost detection channel has been edited to <#${channel.id}>`, ephemeral: true });
                } else {
                    return interaction.reply({ content: `Boost detection channel has been edited to <#${channel.id}>` });
                }
            }
                break;
        }
    }
}