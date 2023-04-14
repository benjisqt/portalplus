const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ChannelType,
    PermissionFlagsBits
} = require('discord.js');
const { Reply } = require('../../util/replies');

module.exports = {
    category: 'Moderation',
    data: new SlashCommandBuilder()
        .setName('textch')
        .setDescription('Text channel management commands')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand((sub) =>
            sub.setName('lock')
            .setDescription('Locks this channel to prevent members from sending messages')
            .addRoleOption((opt) =>
                opt.setName('role')
                .setDescription('The role you want to lock the channel for')
                .setRequired(true)
            )
            .addBooleanOption((opt) =>
                opt.setName('silent')
                .setDescription('Whether command feedback should only be sent to you')
            )
        )
        .addSubcommand((sub) =>
            sub.setName('unlock')
            .setDescription('Unlocks this channel to let members send messages')
            .addRoleOption((opt) =>
                opt.setName('role')
                .setDescription('The role you want to unlock the channel for')
                .setRequired(true)
            )
            .addBooleanOption((opt) =>
                opt.setName('silent')
                .setDescription('Whether command feedback should only be sent to you')
            )
        )
        .addSubcommand((sub) =>
        sub.setName('nuke')
        .setDescription('Clones the channel and deletes the old one')
        .addBooleanOption((opt) =>
            opt.setName('silent')
            .setDescription('Whether command feedback should only be sent to you')
        )
    ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const silent = interaction.options.getBoolean('silent') || false;
        const role = interaction.options.getRole('role');

        switch (sub) {
            case 'lock': {
                const validrole = interaction.guild.roles.cache.find(r => r.id === role.id);
                if(!validrole) return Reply(interaction, 'Red', '🚫', 'This role was not found in this guild.', true)
                if(validrole.position >= interaction.guild.members.me.roles.highest.position) return Reply(
                    interaction,
                    'Red',
                    '🚫',
                    `The select role has a higher position than my highest role.\nPlease make my role higher than the selected role.`,
                    true
                );
        
                if(validrole.position >= interaction.member.roles.highest.position) return Reply(
                    interaction,
                    'Red',
                    '🚫',
                    `The select role has a higher position than your highest role.\nPlease make your role higher than the selected role.`,
                    true
                );
                interaction.channel.permissionOverwrites.create(role.id, { SendMessages: false });
                if(silent === true) {
                    return Reply(interaction, 'Green', '✅', 'Members will no longer be able to send messages in this channel unless the channel is unlocked.', true);
                } else {
                    return Reply(interaction, 'Green', '✅', 'Members will no longer be able to send messages in this channel unless the channel is unlocked.', false);
                }
            }
            break;

            case 'unlock': {
                const validrole = interaction.guild.roles.cache.find(r => r.id === role.id);
                if(!validrole) return Reply(interaction, 'Red', '🚫', 'This role was not found in this guild.', true)
                if(validrole.position >= interaction.guild.members.me.roles.highest.position) return Reply(
                    interaction,
                    'Red',
                    '🚫',
                    `The select role has a higher position than my highest role.\nPlease make my role higher than the selected role.`,
                    true
                );
        
                if(validrole.position >= interaction.member.roles.highest.position) return Reply(
                    interaction,
                    'Red',
                    '🚫',
                    `The select role has a higher position than your highest role.\nPlease make your role higher than the selected role.`,
                    true
                );
                interaction.channel.permissionOverwrites.create(role.id, { SendMessages: true });
                if(silent === true) {
                    return Reply(interaction, 'Green', '✅', 'Members are now able to send messages in this channel.', true);
                } else {
                    return Reply(interaction, 'Green', '✅', 'Members are now able to send messages in this channel.', false);
                }
            }
            break;

            case 'nuke' : {
                const ch = interaction.channel;
                ch.clone().then(async newch => {
                    if(silent === false) {
                        const msg = await newch.send({ content: `Channel has been cleared of messages!` });
                        setTimeout(() => {
                            msg.delete();
                        }, 3000);
                    }
                    ch.delete();
                })
            }
            break;
        }
    }
}