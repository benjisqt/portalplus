const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ChannelType,
    PermissionFlagsBits
} = require('discord.js');
const { Reply } = require('../../util/replies');
const ms = require('ms');

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
        )
        .addSubcommand((sub) =>
            sub.setName('slowmode')
            .setDescription('Set slowmode in a channel!')
            .addStringOption((opt) =>
                opt.setName('duration')
                .setDescription('The duration of the slowmode (3s, 3m, 3h)')
                .setRequired(true)
            )
            .addChannelOption((opt) =>
                opt.setName('channel')
                .setDescription('The channel you want to set the slowmode in')
                .addChannelTypes(ChannelType.GuildText)
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
                if (!validrole) return Reply(interaction, 'Red', '🚫', 'This role was not found in this guild.', true)
                if (validrole.position >= interaction.guild.members.me.roles.highest.position) return Reply(
                    interaction,
                    'Red',
                    '🚫',
                    `The select role has a higher position than my highest role.\nPlease make my role higher than the selected role.`,
                    true
                );

                if (validrole.position >= interaction.member.roles.highest.position) return Reply(
                    interaction,
                    'Red',
                    '🚫',
                    `The select role has a higher position than your highest role.\nPlease make your role higher than the selected role.`,
                    true
                );
                interaction.channel.permissionOverwrites.create(role.id, { SendMessages: false });
                if (silent === true) {
                    return Reply(interaction, 'Green', '✅', 'Members will no longer be able to send messages in this channel unless the channel is unlocked.', true);
                } else {
                    return Reply(interaction, 'Green', '✅', 'Members will no longer be able to send messages in this channel unless the channel is unlocked.', false);
                }
            }
                break;

            case 'unlock': {
                const validrole = interaction.guild.roles.cache.find(r => r.id === role.id);
                if (!validrole) return Reply(interaction, 'Red', '🚫', 'This role was not found in this guild.', true)
                if (validrole.position >= interaction.guild.members.me.roles.highest.position) return Reply(
                    interaction,
                    'Red',
                    '🚫',
                    `The select role has a higher position than my highest role.\nPlease make my role higher than the selected role.`,
                    true
                );

                if (validrole.position >= interaction.member.roles.highest.position) return Reply(
                    interaction,
                    'Red',
                    '🚫',
                    `The select role has a higher position than your highest role.\nPlease make your role higher than the selected role.`,
                    true
                );
                interaction.channel.permissionOverwrites.create(role.id, { SendMessages: true });
                if (silent === true) {
                    return Reply(interaction, 'Green', '✅', 'Members are now able to send messages in this channel.', true);
                } else {
                    return Reply(interaction, 'Green', '✅', 'Members are now able to send messages in this channel.', false);
                }
            }
                break;

            case 'nuke': {
                const ch = interaction.channel;
                ch.clone().then(async newch => {
                    if (silent === false) {
                        const msg = await newch.send({ content: `Channel has been cleared of messages!` });
                        setTimeout(() => {
                            msg.delete();
                        }, 3000);
                    }
                    ch.delete();
                })
            }
                break;
            
            case 'slowmode': {
                const duration = interaction.options.getString('duration');
                const channel = interaction.options.getChannel('channel') || interaction.channel;

                const id = channel.id;

                const msduration = ms(duration);
                const ch = interaction.guild.channels.cache.get(id);

                if(!ch) return Reply(interaction, 'Red', '\`❗️\`', 'That channel is not in this guild.', true);

                if(msduration > 21600000 || duration < 0) return Reply(interaction, 'Red', `\`❗️\``, `The slowmode cannot be negative or over 6 hours.`, true);

                try {
                    if(duration > 0) {
                        await ch.setRateLimitPerUser(duration / 1000);

                        Reply(interaction, 'Green', `\`✅\``, `Successfully set slowmode in ${ch} to ${duration}`, true);

                        return ch.send({
                            content: `The slowmode in this channel has been changed to ${duration}.`
                        });
                    } else {
                        await ch.setRateLimitPerUser(null);

                        Reply(interaction, 'Green', `\`✅\``, `Successfully disabled slowmode in ${ch}`, true);

                        return ch.send({
                            content: `Slowmode has been disabled in this channel.`
                        });
                    }
                } catch {
                    return Reply(interaction, 'Red', `\`❗️\``,
                    `Something went wrong whilst executing this command.\nPlease contact the bot owner, as a crash may have occured.`,
                    true);
                }
            }
            break;
        }
    }
}