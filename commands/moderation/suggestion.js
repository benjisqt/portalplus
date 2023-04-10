const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ChannelType } = require('discord.js');
const suggestion = require('../../models/suggestion');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('suggestion')
    .setDescription('Suggestion system')
    .addSubcommand((sub) =>
        sub.setName('enable')
        .setDescription('Enable the suggestion system')
        .addChannelOption((opt) =>
            opt.setName('channel')
            .setDescription('The channel where suggestions will be sent')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('disable')
        .setDescription('Disable the suggestion system')
    )
    .addSubcommand((sub) =>
        sub.setName('edit')
        .setDescription('Edit the suggestion channel')
        .addChannelOption((opt) =>
            opt.setName('channel')
            .setDescription('The new channel where suggestions will be sent')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('make')
        .setDescription('Make a suggestion!')
        .addStringOption((opt) =>
            opt.setName('suggestion')
            .setDescription('The suggestion')
            .setRequired(true)
        )
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();

        switch(sub) {
            case 'enable' : {
                const ch = interaction.options.getChannel('channel');
                const valid = interaction.guild.channels.cache.get(ch.id);
                if(!valid) return interaction.reply({ content: `This is not a valid channel in this guild.`, ephemeral: true });

                const data = await suggestion.findOne({ Guild: interaction.guildId });
                if(data) {
                    if(data.Enabled === true) return interaction.reply({ content: `The suggestion system is already enabled! If you want to edit the channel, run /suggestion edit`, ephemeral: true });
                    
                    const filter = { Guild: interaction.guildId };
                    const filter2 = { Channel: ch.id, Enabled: true };

                    suggestion.findOneAndUpdate(filter, filter2, { new: true });
                } else {
                    await new suggestion({
                        Guild: interaction.guildId,
                        Channel: ch.id,
                        Enabled: true
                    }).save();
                }

                return interaction.reply({ content: `The suggestions system has been enabled!\nAnybody who runs /suggestion make will have their suggestion sent to <#${ch.id}>` });
            }
            break;

            case 'disable' : {
                const data = await suggestion.findOne({ Guild: interaction.guildId });
                if(data) {
                    suggestion.findOneAndUpdate({ Guild: interaction.guildId }, { Channel: '', Enabled: false }, { new: true });
                } else {
                    await new suggestion({
                        Guild: interaction.guildId,
                        Channel: '',
                        Enabled: false
                    }).save();
                }

                return interaction.reply({ content: `The suggestions system has been disabled!` });
            }
            break;

            case 'edit' : {
                const ch = interaction.options.getChannel('channel');
                const valid = interaction.guild.channels.cache.get(ch.id);
                if(!valid) return interaction.reply({ content: `This is not a valid channel in this guild.`, ephemeral: true });

                const data = await suggestion.findOne({ Guild: interaction.guildId });
                if(data) {
                    if(data.Enabled === false) return interaction.reply({ content: `The suggestion system is disabled! If you want to edit the channel, run /suggestion enable`, ephemeral: true });
                    
                    const filter = { Guild: interaction.guildId };
                    const filter2 = { Channel: ch.id };

                    suggestion.findOneAndUpdate(filter, filter2, { new: true });
                } else {
                    return interaction.reply({ content: `The suggestions system has not been setup yet.`, ephemeral: true });
                }

                return interaction.reply({ content: `The suggestions channel has been edited!\nAnybody who runs /suggestion make will now have their suggestion sent to <#${ch.id}>` });
            }
            break;

            case 'make' : {
                const suggest = interaction.options.getString('suggestion');

                const data = await suggestion.findOne({ Guild: interaction.guildId });

                if(!data) return interaction.reply({ content: `The suggestions system has not been setup yet.`, ephemeral: true });

                if(data.Enabled === false) return interaction.reply({ content: `The suggestions system is disabled.`, ephemeral: true });

                const validch = interaction.guild.channels.cache.get(data.Channel);
                if(!validch) return interaction.reply({ content: `The suggestions channel is not valid. Please update it.`, ephemeral: true });

                if(!validch.permissionsFor(interaction.guild.members.me).has('SendMessages')) return interaction.reply({ content: `You do not have permissions to send messages in the suggestions channel.\nPlease make sure you have the 'Send Messages' permission in <#${validch.id}>`, ephemeral: true });
                if(!validch.permissionsFor(interaction.guild.members.me).has('SendMessages')) return interaction.reply({ content: `I do not have permissions to send messages in the suggestions channel.\nPlease allow me the 'Send Messages' permission in <#${validch.id}>`, ephemeral: true });

                validch.send({
                    embeds: [
                        new EmbedBuilder()
                        .setAuthor({ name: `New Suggestion`, iconURL: `${interaction.guild.members.me.user.displayAvatarURL()}` })
                        .setTitle(`Suggestion incoming from ${interaction.user.tag}`)
                        .setDescription(`**${suggest}**`)
                        .setColor('Gold')
                    ]
                }).then(async msg => {
                    await msg.react('✅');
                    await msg.react('❌');
                });

                return interaction.reply({ content: `Suggestion sent!`, ephemeral: true });
            }
            break;
        }
    }
}