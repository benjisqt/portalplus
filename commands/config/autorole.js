const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const autorole = require('../../models/autorole');
const { Reply } = require('../../util/replies');

module.exports = {
    category: 'Config',
    data: new SlashCommandBuilder()
    .setName('autorole')
    .setDescription('Autorole config')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
        sub.setName('enable')
        .setDescription('Enable the autorole system!')
        .addRoleOption((opt) =>
            opt.setName('role')
            .setDescription('The role you want to be added to users')
            .setRequired(true)
        )
        .addBooleanOption((opt) =>
            opt.setName('silent')
            .setDescription('Whether command feedback should only be sent to you')
        )
    )
    .addSubcommand((sub) =>
        sub.setName('disable')
        .setDescription('Disable the autorole system')
        .addBooleanOption((opt) =>
            opt.setName('silent')
            .setDescription('Whether command feedback should only be sent to you')
        )
    )
    .addSubcommand((sub) =>
        sub.setName('edit')
        .setDescription('Edit the role in autorole')
        .addRoleOption((opt) =>
            opt.setName('role')
            .setDescription('The role you want to edit to')
            .setRequired(true)
        )
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
        const silent = interaction.options.getBoolean('silent');

        switch(sub) {
            case 'enable' : {
                const role = interaction.options.getRole('role');

                if(role.position > interaction.guild.members.me.roles.highest.position) return Reply(
                    interaction, 'Red', '🚫', 'This role is above my highest role, so I cannot add it to players.', true
                );

                await new autorole({
                    Guild: interaction.guildId,
                    Role: role.id
                }).save();

                if(silent === true) {
                    return Reply(interaction, 'Green', '✅', `Autorole enabled with role ${role}.\nIf you want to edit, run /autorole edit.`, true);
                } else {
                    return Reply(interaction, 'Green', '✅', `Autorole enabled with role ${role}.\nIf you want to edit, run /autorole edit.`, false);
                }
            }
            break;

            case 'disable' : {
                const data = await autorole.findOne({ Guild: interaction.guildId });
                if(!data) return Reply(interaction, 'Red', '🚫', 'The autorole system has already been disabled!', true);

                data.deleteOne({ Guild: interaction.guildId });

                if(silent === true) {
                    return Reply(interaction, 'Green', '✅', `Autorole disabled.`, true);
                } else {
                    return Reply(interaction, 'Green', '✅', `Autorole disabled.`, false);
                }
            }
            break;

            case 'edit' : {
                const role = interaction.options.getRole('role');
                const data = await autorole.findOne({ Guild: interaction.guildId });
                if(!data) return Reply(interaction, 'Red', '🚫', 'The autorole has not been set up.', true);

                if(role.position > interaction.guild.members.me.roles.highest.position) return Reply(
                    interaction, 'Red', '🚫', 'This role is above my highest role, so I cannot add it to players.', true
                );

                await autorole.findOneAndUpdate({ Guild: interaction.guildId }, { Role: role.id }, { new: true });
                data.save();

                if(silent === true) {
                    return Reply(interaction, 'Green', '✅', `Autorole changed to role ${role}.`, true);
                } else {
                    return Reply(interaction, 'Green', '✅', `Autorole changed to role ${role}.`, false);
                }
            }
            break;
        }
    }
}