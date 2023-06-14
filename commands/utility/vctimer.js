const { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType, Client, EmbedBuilder } = require('discord.js');
const vctimer = require('../../models/vctimer');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('vctimer')
    .setDescription('Setup voice channel timer!')
    .addSubcommand((sub) =>
        sub.setName('enable')
        .setDescription('Enable the vc timer system!')
    )
    .addSubcommand((sub) =>
        sub.setName('disable')
        .setDescription('Disable the vc timer system!')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const sub = interaction.options.getSubcommand();

        if(!interaction.guild.members.me.permissions.has('ManageChannels')) return interaction.reply({
            content: `❌ I do not have the Manage Channels permission.`,
            ephemeral: true,
        })

        switch(sub) {
            case 'enable': {
                const data = await vctimer.findOne({ Guild: interaction.guildId });
                if(data) return interaction.reply({
                    content: `❌ You already have the VC timer enabled!`,
                    ephemeral: true,
                });

                const validchannels = await interaction.guild.channels.cache.filter((ch) => ch.type === ChannelType.GuildVoice && ch.permissionsFor(client.user).has('ManageChannels'));
                if(!validchannels || validchannels.size <= 0) return interaction.reply({
                    content: `❌ There are no channels that meet the criteria:\n\`Channel Type: Guild Voice\`\n\`Client has to have "Manage Channels" permission.\``,
                    ephemeral: true,
                });

                const channels = [];

                validchannels.forEach((channel) => {
                    channels.push(channel.id)
                });

                await vctimer.create({
                    Guild: interaction.guildId,
                    Channels: channels,
                });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`✅ Successfully enabled VC timer`)
                        .setDescription(`> Every channel in the server will longer receive a timer on it whenever someone has joined.\nThis will monitor the amount that the voice channel is active for.`)
                        .setColor('Green')
                        .setFooter({ text: `Portal+` })
                    ]
                })
            }
            break;

            case 'disable': {
                const data = await vctimer.findOne({ Guild: interaction.guildId });
                if(!data) return interaction.reply({
                    content: `❌ You already have the VC timer disabled!`,
                    ephemeral: true,
                });

                await vctimer.deleteMany({ Guild: interaction.guildId });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`✅ Successfully disabled VC timer`)
                        .setDescription(`> Every channel in the server will no longer receive a timer on it whenever someone has joined.`)
                        .setColor('Green')
                        .setFooter({ text: `Portal+` })
                    ]
                })
            }
            break;
        }
    }
}