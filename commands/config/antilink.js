const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const antilink = require('../../models/antilink');
const { Reply } = require('../../util/replies');

module.exports = {
    category: 'Config',
    data: new SlashCommandBuilder()
    .setName('antilink')
    .setDescription(`Antilink system`)
    .addSubcommand((sub) =>
        sub.setName('enable')
        .setDescription('Enable the antilink system!')
    )
    .addSubcommand((sub) =>
        sub.setName('disable')
        .setDescription('Disable the antilink system!')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();

        switch(sub) {
            case 'enable': {
                const data = await antilink.findOne({ Guild: interaction.guildId });
                if(data) return Reply(interaction, 'Red', '❗️', `The antilink system is already enabled!`, true);

                await antilink.create({
                    Guild: interaction.guildId,
                });

                return Reply(interaction, 'Gold', '✅', `Antilink has been enabled!`, true);
            }
            break;

            case 'disable': {
                const data = await antilink.findOne({ Guild: interaction.guildId });
                if(!data) return Reply(interaction, 'Red', '❗️', 'The antilink system is already disabled!', true);

                await antilink.deleteMany({ Guild: interaction.guildId });

                return Reply(interaction, 'Gold', '✅', 'Antilink has been disabled!', true);
            }
            break;
        }
    }
}