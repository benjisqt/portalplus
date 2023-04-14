const { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType } = require('discord.js');
const counting = require('../../models/counting');
const { Reply } = require('../../util/replies');

module.exports = {
    category: 'Config',
    data: new SlashCommandBuilder()
    .setName('counting')
    .setDescription('Enable or disable the counting system!')
    .addSubcommand((sub) =>
        sub.setName('enable')
        .setDescription('Enable the counting system')
        .addChannelOption((opt) =>
            opt.setName('channel')
            .setDescription('The channel you want to count in')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('disable')
        .setDescription('Disable the counting system')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();

        switch(sub) {
            case 'enable' : {
                const channel = interaction.options.getChannel('channel');
                if(!channel.id) return Reply(interaction, 'Red', '🚫', `This channel is not in this guild.`, true);
                if(!channel.permissionsFor(interaction.guild.members.me).has('SendMessages')) return Reply(
                    interaction, 'Red', '🚫', 'I do not have permissions to send messages in that channel.', true
                );

                await new counting({
                    Guild: interaction.guildId,
                    Channel: channel.id,
                    Number: 0,
                }).save();

                return Reply(interaction, 'Green', '✅', `Counting system enabled in ${channel}. Type 1 to begin!`, false);
            }
            break;

            case 'disable' : {
                const data = await counting.findOne({ Guild: interaction.guildId });
                if(!data) return Reply(interaction, 'Red', '🚫', 'The counting system has not been setup!', true);

                Reply(interaction, 'Green', '✅', `Counting system disabled! Highest number: ${data.Number}.`, false);
                return data.deleteOne({ Guild: interaction.guildId });
            }
            break;
        }
    }
}