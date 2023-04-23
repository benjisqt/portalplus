const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const altdetection = require('../../models/altdetection');
const { Reply } = require('../../util/replies');

module.exports = {
    category: 'Config',
    data: new SlashCommandBuilder()
        .setName('altdetection')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('Alt account detection!')
        .addSubcommand((sub) =>
            sub.setName('enable')
                .setDescription('Enable alt account detection')
                .addStringOption((opt) =>
                    opt.setName('punishment')
                        .setDescription('The punishment for being an alt account')
                        .addChoices(
                            { name: 'Ban the alt', value: 'ban' },
                            { name: 'Kick the alt', value: 'kick' },
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub.setName('disable')
                .setDescription('Disable alt account detection!')
        )
        .addSubcommand((sub) =>
            sub.setName('editpunish')
                .setDescription('Edit the alt account punishment!')
                .addStringOption((opt) =>
                    opt.setName('punishment')
                        .setDescription('The punishment for being an alt account')
                        .addChoices(
                            { name: 'Ban the alt', value: 'ban' },
                            { name: 'Kick the alt', value: 'kick' },
                        )
                        .setRequired(true)
                )
        ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    
    async execute(interaction) {
        const data = await altdetection.findOne({ Guild: interaction.guildId });
        const sub = interaction.options.getSubcommand();

        switch(sub) {
            case 'enable': {
                if(data) return Reply(interaction, 'Red', '❗️', 'The alt detection system has already been enabled.', true);

                const punishment = interaction.options.getString('punishment');

                await altdetection.create({
                    Guild: interaction.guildId,
                    Punishment: `${punishment}`,
                });

                return Reply(interaction, 'Gold', '✅', `Alt detection enabled! Anyone who joins that is detected as an alt will receive the \`${punishment}\` punishment.`, true);
            }
            break;

            case 'disable': {
                if(!data) return Reply(interaction, 'Red', '❗️', 'The alt detection system is not enabled!', true);

                altdetection.deleteMany({ Guild: interaction.guildId });

                return Reply(interaction, 'Gold', '✅', `Alt detection system disabled!`, true);
            }
            break;

            case 'editpunish': {
                if(!data) return Reply(interaction, 'Red', '❗️', 'The alt detection system is not enabled!', true);

                const punishment = interaction.options.getString('punishment');

                if(punishment === data.Punishment) return Reply(interaction, 'Red', '❗️', `Nothing changed; the punishment is the same.`, true);

                altdetection.findOneAndUpdate({ Guild: interaction.guildId }, { Punishment: punishment }, { new: true });

                return Reply(interaction, 'Gold', '✅', `Alt detection system has been updated to \`${punishment}\` punishment.`, true);
            }
            break;
        }
    }
}