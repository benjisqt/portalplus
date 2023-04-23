const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const voiceSchema = require('../../models/jointocreate');

module.exports = {
    Category: 'Config',
    data: new SlashCommandBuilder()
    .setName('join-to-create')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription('Setup and disable Join To Create voice channel!')
    .addSubcommand((sub) =>
        sub.setName('setup')
        .setDescription("Setup your join to create voice channel")
        .addChannelOption((opt) =>
            opt.setName('category')
            .setDescription('The category where you want the channel to be created')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory)
        )
        .addIntegerOption((opt) =>
            opt.setName('voice-limit')
            .setDescription('The user limit for the new voice channels')
            .setMinValue(2)
            .setMaxValue(10)
        )
        .addChannelOption((opt) =>
            opt.setName('errorchannel')
            .setDescription('The channel you want potential errors to be sent to!')
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('disable')
        .setDescription('Disables your join to create channel!')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const data = await voiceSchema.findOne({ Guild: interaction.guildId });
        const sub = interaction.options.getSubcommand();

        switch(sub) {
            case 'setup': {
                if(data) return interaction.reply({ content: `\`❗️\` The join to create system is already enabled. Run /jointocreate disable to disable it!`, ephemeral: true });

                else {
                    const category = interaction.options.getChannel('category');
                    const limit = interaction.options.getInteger('voice-limit') || 3;
                    const errorchannel = interaction.options.getChannel('errorchannel') || interaction.channel;

                    if(!interaction.guild.members.me.permissions.has('ManageChannels')) {
                        return interaction.reply({
                            content: `\`❗️\` I need the \`Manage Channels\` permission to run this command!`,
                            ephemeral: true
                        });
                    }

                    const ch = await interaction.guild.channels.create({
                        parent: category.id,
                        name: `🔊 Join To Create`,
                        userLimit: limit,
                        type: ChannelType.GuildVoice                      
                    });

                    await voiceSchema.create({
                        Guild: interaction.guildId,
                        Category: category.id,
                        Channel: ch.id,
                        VoiceLimit: limit,
                        ErrorChannel: errorchannel,
                    });

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setAuthor({ iconURL: interaction.guild.members.me.displayAvatarURL({ dynamic: true }), name: `Successfully Created Channel` })
                            .setDescription(`Enabled join to create system! Use it by joining <#${ch.id}>\nNew voice channels will be created in ${category}`)
                            .setColor('Gold')
                            .setFooter({ text: `Portal+ JTC System` })
                        ]
                    });
                }
            }
            break;

            case 'disable': {
                if(!data) return await interaction.reply({
                    content: `\`❗️\` The join to create system has not been setup!`,
                    ephemeral: true
                });

                else {
                    await voiceSchema.deleteMany({ Guild: interaction.guildId });

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setAuthor({ name: `Disabled Join-To-Create`, iconURL: interaction.guild.members.me.displayAvatarURL() })
                            .setDescription(`The join to create system has been disabled.`)
                            .setColor('Gold')
                            .setFooter({ text: `Portal+ JTC System` })
                        ]
                    })
                }
            }
            break;
        }
    }
}