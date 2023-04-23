const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits
} = require('discord.js');
const antijoin = require('../../models/antijoin');
const { Reply } = require('../../util/replies');

module.exports = {
    category: 'Config',
    data: new SlashCommandBuilder()
        .setName('antijoin')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('Stop all new people from rejoining!')
        .addSubcommand((sub) =>
            sub.setName('enable')
            .setDescription('Enable the antijoin system!')
            .addStringOption((opt) =>
                opt.setName('punishment')
                .setDescription('The punishment someone receieves upon joining')
                .addChoices({
                    name: 'Ban the member',
                    value: 'ban'
                }, {
                    name: 'Kick the member',
                    value: 'kick'
                })
                .setRequired(true)
            )
            .addBooleanOption((opt) =>
                opt.setName('silent')
                .setDescription('Whether command feedback should only be sent to you')
            )
        )
        .addSubcommand((sub) =>
            sub.setName('disable')
            .setDescription('Disable the antijoin system!')
            .addBooleanOption((opt) =>
                opt.setName('silent')
                .setDescription('Whether command feedback should only be sent to you')
            )
        )
        .addSubcommand((sub) =>
            sub.setName('editpunish')
            .setDescription('Edit the punishment on the antijoin system!')
            .addStringOption((opt) =>
                opt.setName('punishment')
                .setDescription('The punishment to be edited to')
                .addChoices(
                    { name: 'Ban the member', value: 'ban' },
                    { name: 'Kick the member', value: 'kick' }
                )
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
        const silent = interaction.options.getBoolean('silent') || false;

        switch(sub) {
            case 'enable' : {
                const punishment = interaction.options.getString('punishment');
                if(!interaction.guild.members.me.permissions.has('BanMembers')) return Reply(
                    interaction, 'Red', '🚫', 'I do not have the Ban Members permission. Please grant me this permission.', true
                );

                if(!interaction.guild.members.me.permissions.has('KickMembers')) return Reply(
                    interaction, 'Red', '🚫', 'I do not have the Kick Members permission. Please grant me this permission.', true
                );

                const data = await antijoin.findOne({ Guild: interaction.guildId });
                if(data) {
                    if(data.Enabled === true) return Reply(interaction, 'Red', '🚫', 'The antijoin system is already enabled!\nIf you wish to edit the punishment, run /antijoin editpunish!', true);
                    
                    const filter = { Guild: interaction.guildId };
                    const replace = { Enabled: true, Punishment: punishment };

                    await antijoin.findOneAndUpdate(filter, replace, { new: true });

                    if(silent === true) {
                        return Reply(interaction, 'Green', '✅', `Antijoin has been re-enabled! Anyone who joins will receieve a ${punishment} unless the system is turned off.`, true);
                    } else {
                        return Reply(interaction, 'Green', '✅', `Antijoin has been re-enabled! Anyone who joins will receieve a ${punishment} unless the system is turned off.`, false);
                    }
                } else {
                    await new antijoin({
                        Guild: interaction.guildId,
                        Enabled: true,
                        Punishment: punishment
                    }).save();
                    if(silent === true) {
                        return Reply(interaction, 'Green', '✅', `Antijoin has been enabled! Anyone who joins will receieve a ${punishment} unless the system is turned off.`, true);
                    } else {
                        return Reply(interaction, 'Green', '✅', `Antijoin has been enabled! Anyone who joins will receieve a ${punishment} unless the system is turned off.`, false);
                    }
                }
            }
            break;
            
            case 'disable' : {
                const data = await antijoin.findOne({ Guild: interaction.guildId });
                if(data) {
                    if(data.Enabled === false) return Reply(interaction, 'Red', '🚫', 'The antijoin system is already disabled!', true);
                    
                    const filter = { Guild: interaction.guildId };
                    const replace = { Enabled: false, Punishment: 'Antijoin has been disabled.' };

                    await antijoin.findOneAndUpdate(filter, replace, { new: true });

                    if(silent === true) {
                        return Reply(interaction, 'Green', '✅', `Antijoin has been disabled! Anyone who joins will not receieve a punishment unless the system is turned on.`, true);
                    } else {
                        return Reply(interaction, 'Green', '✅', `Antijoin has been disabled! Anyone who joins will not receieve a punishment unless the system is turned on.`, false);
                    }
                } else {
                    return Reply(interaction, 'Red', '🚫', 'The antijoin system has not been setup yet!', true);
                }
            }
            break;

            case 'editpunish' : {
                const punishment = interaction.options.getString('punishment');
                if(!interaction.guild.members.me.permissions.has('BanMembers')) return Reply(
                    interaction, 'Red', '🚫', 'I do not have the Ban Members permission. Please grant me this permission.', true
                );

                if(!interaction.guild.members.me.permissions.has('KickMembers')) return Reply(
                    interaction, 'Red', '🚫', 'I do not have the Kick Members permission. Please grant me this permission.', true
                );

                const data = await antijoin.findOne({ Guild: interaction.guildId });
                if(data) {
                    if(data.Enabled === false) return Reply(interaction, 'Red', '🚫', 'The antijoin system is disabled!\nIf you wish to edit the punishment, run /antijoin enable!', true);
                    
                    const filter = { Guild: interaction.guildId };
                    const replace = { Enabled: true, Punishment: punishment };

                    await antijoin.findOneAndUpdate(filter, replace, { new: true });
                    if(silent === true) {
                        return Reply(interaction, 'Green', '✅', `Antijoin punishment changed to \`${punishment}\`!`, true);
                    } else {
                        return Reply(interaction, 'Green', '✅', `Antijoin punishment changed to \`${punishment}\`!`, false);
                    }
                } else {
                    return Reply(interaction, 'Red', '🚫', 'The antijoin system has not been setup yet!', true);
                }
            }
            break;
        }
    }
}