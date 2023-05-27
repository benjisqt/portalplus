const { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType, EmbedBuilder, Client, PermissionFlagsBits } = require('discord.js');
const memberCounter = require('../../models/memberCounter');

module.exports = {
    category: 'Utility',
    data: new SlashCommandBuilder()
    .setName('membercounter')
    .setDescription(`Member counter system!`)
    .addSubcommand((sub) =>
        sub.setName('enable')
        .setDescription('Enable the member counter system!')
        .addChannelOption((opt) =>
            opt.setName('channel')
            .setDescription('Got an existing channel? Add it here!')
        )
    )
    .addSubcommand((sub) =>
        sub.setName('disable')
        .setDescription('Disable the member counter system!')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const wrong = client.emojis.cache.get('1102395290700496908');
        const correct = client.emojis.cache.get('1099831412451979284');
        const channel = interaction.options.getChannel('channel');
        const sub = interaction.options.getSubcommand();

        if(!interaction.guild.members.me.permissions.has('ManageChannels')) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`${wrong} Portal+ Has Encountered An Error.`)
                    .setDescription(`> I do not have permissions to make new channels, as you have not provided one.\nPlease give me the \`Manage Channels\` permission to continue.`)
                    .setColor('Red')
                    .setFooter({ text: `Portal+` })
                ]
            })
        }

        switch(sub) {
            case 'enable': {
                let channelId;
                if(!channel) {
                    const newch = await interaction.guild.channels.create({ 
                        name: `👥 Calculating...`,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.roles.everyone.id,
                                deny: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak]
                            }
                        ]
                    });

                    channelId === newch.id;
                } else channelId === channel.id

                await memberCounter.create({
                    Guild: interaction.guildId,
                    Channel: channelId,
                    Members: interaction.guild.memberCount
                });

                const chan = interaction.guild.channels.cache.get(channelId);
                if(!chan) return;

                chan.setName(`👥 Members: ${interaction.guild.memberCount}`);

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`${correct} Successfully enabled member count`)
                        .setDescription(`> You have enabled the member counting system. Everytime a member joins, it adds one.`)
                        .setColor('Gold')
                        .setFooter({ text: `Portal+` })
                        .setTimestamp()
                    ]
                })
            }
            break;

            case 'disable': {
                const data = await memberCounter.findOne({ Guild: interaction.guildId });
                if(!data) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`${wrong} Portal+ Has Encountered An Error.`)
                        .setDescription(`> The member counter system is already disabled.`)
                        .setColor('Red')
                        .setFooter({ text: `Portal+` })
                    ]
                });

                await memberCounter.deleteMany({ Guild: interaction.guildId }, { new: true });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`${correct} Succesfully disabled!`)
                        .setDescription(`> The member counter has been successfully disabled.`)
                        .setColor('Gold')
                        .setFooter({ text: `Portal+` })
                    ]
                })
            }
            break;
        }
    }
}