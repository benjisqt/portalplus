const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    Client,
} = require('discord.js');
const replies = require('../../util/replies');
const ms = require('ms');

module.exports = {
    category: 'Moderation',
    data: new SlashCommandBuilder()
        .setName('mod')
        .setDescription('Portal\'s moderation commands!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addSubcommandGroup((sub) =>
            sub.setName('member')
                .setDescription('Moderation commands to do with members')
                .addSubcommand((sub) =>
                    sub.setName('ban')
                        .setDescription('Ban a member and any active accounts on the same IP from the server')
                        .addUserOption((opt) =>
                            opt.setName('user')
                                .setDescription('The user you want to ban!')
                                .setRequired(true)
                        )
                        .addStringOption((opt) =>
                            opt.setName('reason')
                                .setDescription('The reason for banning the user!')
                        )
                        .addBooleanOption((opt) =>
                            opt.setName('silent')
                                .setDescription('Whether command feedback should only be visible to you.')
                        )
                        .addBooleanOption((opt) =>
                            opt.setName('softban')
                                .setDescription('Immediately unbans the user if true; useful for clearing messages.')
                        )
                        .addStringOption((opt) =>
                            opt.setName('delete_messages')
                                .setDescription('How much of a user\'s message history to delete.')
                                .addChoices({
                                    name: 'Don\'t Delete Any',
                                    value: 'none'
                                }, {
                                    name: 'Previous Hour',
                                    value: 'ph'
                                }, {
                                    name: 'Previous 6 Hours',
                                    value: 'p6h'
                                }, {
                                    name: 'Previous 12 Hours',
                                    value: 'p12h'
                                }, {
                                    name: 'Previous 24 Hours',
                                    value: 'p24h'
                                }, {
                                    name: 'Previous 3 Days',
                                    value: 'p3d'
                                }, {
                                    name: 'Previous 7 Days',
                                    value: 'p7d'
                                })
                        )
                )
                .addSubcommand((sub) =>
                    sub.setName('kick')
                        .setDescription('Kick a user from the server')
                        .addUserOption((opt) =>
                            opt.setName('user')
                                .setDescription('The user you want to kick')
                                .setRequired(true)
                        )
                        .addStringOption((opt) =>
                            opt.setName('reason')
                                .setDescription('The reason for kicking to user')
                        )
                        .addBooleanOption((opt) =>
                            opt.setName('silent')
                                .setDescription('Whether command feedback should only be visible to you.')
                        )
                )
                .addSubcommand((sub) =>
                    sub.setName('mute')
                        .setDescription('Stop people from talking in voice or text channels')
                        .addUserOption((opt) =>
                            opt.setName('user')
                                .setDescription('The user you want to mute')
                                .setRequired(true)
                        )
                        .addStringOption((opt) =>
                            opt.setName('duration')
                                .setDescription('The duration of the mute (/timeout 10s/10m/10h/10d)')
                                .setRequired(true)
                        )
                        .addStringOption((opt) =>
                            opt.setName('reason')
                                .setDescription('The reason for the mute')
                        )
                        .addBooleanOption((opt) =>
                            opt.setName('silent')
                                .setDescription('Whether command feedback should only be visible to you.')
                        )
                )
                .addSubcommand((sub) =>
                    sub.setName('unmute')
                        .setDescription('Remove a mute from a user')
                        .addUserOption((opt) =>
                            opt.setName('user')
                                .setDescription('The user you want to mute')
                                .setRequired(true)
                        )
                        .addStringOption((opt) =>
                            opt.setName('reason')
                                .setDescription('The reason for the mute')
                        )
                        .addBooleanOption((opt) =>
                            opt.setName('silent')
                                .setDescription('Whether command feedback should only be visible to you.')
                        )
                )
                .addSubcommand((sub) =>
                    sub.setName('unban')
                        .setDescription('Unban a user from the server and any active accounts on the same IP')
                        .addStringOption((opt) =>
                            opt.setName('id')
                                .setDescription('The ID of the banned user')
                                .setRequired(true)
                        )
                        .addStringOption((opt) =>
                            opt.setName('reason')
                                .setDescription('The reason for unbanning')
                        )
                        .addBooleanOption((opt) =>
                            opt.setName('silent')
                                .setDescription('Whether command feedback should only be visible to you.')
                        )
                )
                .addSubcommand((sub) =>
                    sub.setName('unbanall')
                        .setDescription('Unban all users from the server and any active accounts on the same IP')
                        .addBooleanOption((opt) =>
                            opt.setName('silent')
                                .setDescription('Whether command feedback should only be visible to you.')
                        )
                )
        )
        .addSubcommandGroup((sub) =>
            sub.setName('guild')
                .setDescription('Guild moderation commands!')
                .addSubcommand((sub) =>
                    sub.setName('purge')
                        .setDescription('Clear messages from a channel')
                        .addIntegerOption((opt) =>
                            opt.setName('amount')
                                .setDescription('The amount of messages')
                                .setRequired(true)
                        )
                        .addStringOption((opt) =>
                            opt.setName('reason')
                                .setDescription('The reason for clearing messages')
                        )
                        .addBooleanOption((opt) =>
                            opt.setName('silent')
                                .setDescription('Whether command feedback should only be visible to you.')
                        )
                )
                .addSubcommand((sub) =>
                    sub.setName('clear')
                        .setDescription('Clear all messages from a channel')
                        .addStringOption((opt) =>
                            opt.setName('reason')
                                .setDescription('The reason for clearing messages')
                        )
                )
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const {
            options,
            member,
            guild
        } = interaction;

        const subgroup = options.getSubcommandGroup();

        switch (subgroup) {
            case 'member': {
                const sub = options.getSubcommand();

                const user = options.getMember('user');
                const reason = options.getString('reason') || "No Reason.";
                const silent = options.getBoolean('silent') || false;
                const emoji = client.emojis.cache.get('1099831412451979284');

                switch (sub) {
                    case 'ban': {
                        const softban = options.getBoolean('softban') || false;
                        const delete_messages = options.getString('delete_messages') || "none";

                        if (!user.id) return replies.Reply(interaction, 'Red', '🚫', `That user is not in this guild.`, true);

                        const validuser = guild.members.cache.get(user.id);
                        if (!validuser) return replies.Reply(interaction, 'Red', '🚫', `That user is not in this guild.`, true);

                        let deletemessages;

                        if (!user.bannable) return replies.Reply(interaction, 'Red', '🚫', `${user.user.tag} is not bannable.`, true);

                        if (user.roles.highest.position >= member.roles.highest.position) return replies.Reply(interaction, 'Red', '🚫', `That user's role is higher than or equal to yours.`, true);
                        if (user.roles.highest.position >= interaction.guild.members.me.roles.highest.position) return replies.Reply(interaction, 'Red', '🚫', `That user's role is higher than or equal to mine.`, true);

                        if (user.id === guild.ownerId) return replies.Reply(interaction, 'Red', '🚫', `You cannot ban the server owner!`, true);

                        if (delete_messages === 'none') deletemessages = 0;
                        if (delete_messages === 'ph') deletemessages = 3600;
                        if (delete_messages === 'p6h') deletemessages = 21600;
                        if (delete_messages === 'p12h') deletemessages = 43200;
                        if (delete_messages === 'p24h') deletemessages = 86400;
                        if (delete_messages === 'p3d') deletemessages = 259200;
                        if (delete_messages === 'p7d') deletemessages = 604800;

                        if (softban === true) {
                            user.ban({
                                deleteMessageSeconds: 604800,
                                reason: reason
                            })
                            guild.members.unban(user.id);
                            if (silent === true) {
                                return replies.Reply(interaction, 'Green', '✅', `Successfully softbanned ${user.user.tag}, their messages have been deleted.`, true);
                            } else {
                                return replies.Reply(interaction, 'Green', '✅', `Successfully softbanned ${user.user.tag}, their messages have been deleted.`, false);
                            }
                        } else {
                            user.ban({
                                deleteMessageSeconds: deletemessages,
                                reason: reason
                            });
                            if (silent === true) {
                                return replies.Reply(interaction, 'Green', '✅', `Successfully banned ${user.user.tag}.`, true);
                            } else {
                                return replies.Reply(interaction, 'Green', '✅', `Successfully banned ${user.user.tag}.`, false);
                            }
                        }
                    }
                        break;

                    case 'kick': {
                        if (!user.kickable) return replies.Reply(interaction, 'Green', '✅', `User is not kickable.`, true);
                        if (user.roles.highest.position >= member.roles.highest.position) return replies.Reply(interaction, 'Red', '🚫', `That user's role is higher than or equal to yours.`, true);
                        if (user.roles.highest.position >= interaction.guild.members.me.roles.highest.position) return replies.Reply(interaction, 'Red', '🚫', `That user's role is higher than or equal to mine.`, true);

                        if (user.id === guild.ownerId) return replies.Reply(interaction, 'Red', '🚫', `You cannot kick the server owner!`, true);

                        user.kick(reason);
                        if (silent === true) {
                            return replies.Reply(interaction, 'Green', '✅', `Successfully kicked ${user.user.tag}`, true);
                        } else {
                            return replies.Reply(interaction, 'Green', '✅', `Successfully kicked ${user.user.tag}`, false);
                        }
                    }
                        break;

                    case 'mute': {
                        const duration = options.getString('duration');

                        if (!ms(duration) || ms(duration) > ms("28d")) return replies.Reply(interaction, 'Red', '🚫', `Time provided is invalid or over the 24 day limit.`, true);

                        if (!user.manageable || !user.moderatable) return replies.Reply(interaction, 'Red', '🚫', 'Selected target is not moderatable by this bot.', true);

                        if (interaction.member.roles.highest.position < user.roles.highest.position) return replies.Reply(interaction, 'Red', '🚫', 'Selected member has an equal or higher role than you.', true);
                        if (interaction.guild.members.me.roles.highest.position < user.roles.highest.position) return replies.Reply(interaction, 'Red', '🚫', 'Selected member has an equal or higher role than me.', true);

                        user.timeout(ms(duration), reason);
                        if (silent === true) {
                            replies.Reply(interaction, 'Green', '✅', `Successfully timed out ${user} for ${duration}.`, true);
                        } else {
                            replies.Reply(interaction, 'Green', '✅', `Successfully timed out ${user} for ${duration}.`, false);
                        }

                        setTimeout(() => {
                            return interaction.channel.send({
                                content: `The timeout for ${user.user.tag} has ended.\nDuration: ${duration}`
                            });
                        }, ms(duration))
                    }
                        break;

                    case 'unmute': {
                        if (!user.manageable || !user.moderatable) return replies.Reply(interaction, 'Red', '🚫', 'Selected target is not moderatable by this bot.', true);

                        if (interaction.member.roles.highest.position < user.roles.highest.position) return replies.Reply(interaction, 'Red', '🚫', 'Selected member has an equal or higher role than you.', true);
                        if (interaction.guild.members.me.roles.highest.position < user.roles.highest.position) return replies.Reply(interaction, 'Red', '🚫', 'Selected member has an equal or higher role than me.', true);

                        user.timeout(null);
                        if (silent === true) {
                            return replies.Reply(interaction, 'Green', '✅', `Successfully removed the timeout for ${user}.`, true);
                        } else {
                            return replies.Reply(interaction, 'Green', '✅', `Successfully removed the timeout for ${user}.`, false);
                        }
                    }
                        break;

                    case 'unban': {
                        const userid = options.getString('id');

                        const isbanned = guild.bans.cache.get(userid);
                        if (!isbanned) return replies.Reply(interaction, 'Red', '🚫', `This user is not banned.`, true);

                        guild.bans.remove(id);
                        if (silent === true) {
                            return replies.Reply(interaction, 'Green', '✅', `${client.users.cache.get(id).tag} has been unbanned!`, true);
                        } else {
                            return replies.Reply(interaction, 'Green', '✅', `${client.users.cache.get(id).tag} has been unbanned!`, false);
                        }
                    }
                        break;

                    case 'unbanall': {
                        const { options, guild, user } = interaction;

                        const emoji = client.emojis.cache.get('1096078204680286329');

                        const users = await guild.bans.fetch();
                        const ids = users.map(u => u.user.id);

                        await guild.fetchOwner();

                        if (interaction.user.id != guild.ownerId) return await replies.Reply(interaction, 'Red', '❗️', 'You have to be the server owner in order to execute this command!', true);

                        if (users.size <= 0) return replies.Reply(interaction, 'Red', '❗️', 'There are no users banned in this guild.', true);

                        if (silent === true) {
                            await interaction.reply({ content: `${emoji} Unbanning everyone in the server. This may take a while, depending on the amount of bans you have.`, ephemeral: true });
                        } else {
                            await interaction.reply({ content: `${emoji} Unbanning everyone in the server. This may take a while, depending on the amount of bans you have.`, ephemeral: false });
                        }

                        for (const id of ids) {
                            await guild.members.unban(id)
                                .catch(err => {
                                    return interaction.editReply({ content: `${err}` });
                                });
                        }

                        const embed = new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`:white_check_mark: ${ids.length} members have been **unbanned** from the server.`)
                            .setFooter({ text: `Portal+ : /mod unbanall` });

                        return interaction.editReply({ content: ``, embeds: [embed] });
                    }
                        break;
                }
            }
                break;

            case 'guild': {
                const silent = options.getBoolean('silent') || false;
                const reason = options.getString('reason') || "No Reason.";
                const sub = options.getSubcommand();

                switch (sub) {
                    case 'clear': {
                        const ch = interaction.channel;

                        ch.clone().then(async newch => {
                            const msg = await newch.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle(`Successfully Cleared Channel`)
                                        .setDescription(`Cleared ${newch.name} of all \`${ch.messages.cache.size}\` messages.`)
                                        .setColor('Gold')
                                ]
                            });
                            setTimeout(() => {
                                msg.delete();
                            }, 3000)
                            ch.delete();
                        })
                    }
                        break;

                    case 'purge': {
                        const amount = options.getInteger('amount');

                        if (amount > 100) return replies.Reply(interaction, 'Red', `🚫`, `You cannot delete more than 100 messages at 1 time!`, true);

                        await interaction.channel.bulkDelete(amount);
                        if (silent === true) {
                            return interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle(`${emoji} Successfully Cleared Messages`)
                                    .setDescription(`Removed ${amount} messages from <#${interaction.channel.id}>`)
                                    .setColor('Gold')
                                ], ephemeral: true
                            })
                        } else {
                            const msg = await interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle(`${emoji} Successfully Cleared Messages`)
                                    .setDescription(`Removed ${amount} messages from <#${interaction.channel.id}>`)
                                    .setColor('Gold')
                                ]
                            });

                            setTimeout(() => {
                                msg.delete();
                            }, 3000);
                        }
                    }
                        break;
                }
            }
        }
    }
}