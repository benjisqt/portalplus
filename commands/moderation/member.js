const { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const punishments = require('../../models/punishments');
const { Reply } = require('../../util/replies');
const ms = require('ms');
const temprole = require('../../models/temprole');

module.exports = {
    category: 'Moderation',
    data: new SlashCommandBuilder()
    .setName('member')
    .setDescription('Member management commands!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand((sub) =>
        sub.setName('ban')
        .setDescription('Ban a member from the server!')
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
        .setDescription('Kick a member from the server')
        .addUserOption((opt) =>
            opt.setName('user')
            .setDescription('The user you want to kick from the server')
            .setRequired(true)
        )
        .addStringOption((opt) =>
            opt.setName('reason')
            .setDescription('The reason for kicking the user')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('mute')
        .setDescription('Stop people from talking in text/voice channels')
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
    )
    .addSubcommand((sub) =>
        sub.setName('unmute')
        .setDescription('Unmute a user in the server')
        .addUserOption((opt) =>
            opt.setName('user')
            .setDescription('The user you want to unmute')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('unban')
        .setDescription('Unban a user from the server!')
        .addStringOption((opt) =>
            opt.setName('id')
            .setDescription('The ID of the banned user')
            .setRequired(true)
        )
        .addStringOption((opt) =>
            opt.setName('reason')
            .setDescription('The reason for unbanning')
        )
    )
    .addSubcommand((sub) =>
        sub.setName('unbanall')
        .setDescription('Unban all members from the server')
    )
    .addSubcommand((sub) =>
        sub.setName('warn')
        .setDescription("Warn a user if they've done something bad!")
        .addUserOption((opt) =>
            opt.setName('user')
            .setDescription('The user you want to warn')
            .setRequired(true)
        )
        .addStringOption((opt) =>
            opt.setName('reason')
            .setDescription('The reason for the warning')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) => 
        sub.setName('removepunishment')
        .setDescription('Remove a punishment from a user')
        .addStringOption((opt) =>
            opt.setName('id')
            .setDescription('The ID of the punishment (can be obtained by /member viewpunishments)')
        )
    )
    .addSubcommand((sub) =>
        sub.setName('viewpunishments')
        .setDescription('View all punishments that a user has obtained.')
        .addUserOption((opt) =>
            opt.setName('user')
            .setDescription('The user whose punishments you want to view')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('clearpunishments')
        .setDescription('Clear all punishments that a user has')
        .addUserOption((opt) =>
            opt.setName('user')
            .setDescription('The user whose punishments you want to remove')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('addrole')
        .setDescription('Add a role to a member!')
        .addRoleOption((opt) =>
            opt.setName('role')
            .setDescription('The role you want to add')
            .setRequired(true)
        )
        .addUserOption((opt) =>
            opt.setName('user')
            .setDescription('The user you want to add the role to')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('removerole')
        .setDescription('Remove a role from a member!')
        .addRoleOption((opt) =>
            opt.setName('role')
            .setDescription('The role you want to add')
            .setRequired(true)
        )
        .addUserOption((opt) =>
            opt.setName('user')
            .setDescription('The user you want to add the role to')
            .setRequired(true)
        )
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const { options, guild, channel } = interaction;
        const user = options.getUser('user') || null;
        const reason = options.getString('reason');
        const softban = options.getBoolean('softban');
        const delete_messages = options.getString('delete_messages');
        const duration = options.getString('duration');
        const id = options.getString('id');
        const sub = options.getSubcommand();

        switch(sub) {
            case 'ban': {
                if(!user.id) return Reply(interaction, 'Red', '🛑', `That user is not in this guild.`, true);

                const member = guild.members.cache.get(user.id);
                if(!member) return Reply(interaction, 'Red', '🛑', `That user is not in this guild.`, true);

                let deletemessages;

                if(!member.bannable) return Reply(interaction, 'Red', '🛑', `That user is not bannable.`, true);

                if(member.roles.highest.position >= interaction.member.roles.highest.position) return Reply(interaction, 'Red', '🛑', `That user has a higher role position than you.`, true);
                if(member.roles.highest.position >= guild.members.me.roles.highest.position) return Reply(interaction, 'Red', '🛑', `That user has a higher role position than me.`, true);

                guild.fetchOwner();

                if(member.id === guild.ownerId) return Reply(interaction, 'Red', '🛑', `You cannot ban the server owner!`, true);

                if (delete_messages === 'none') deletemessages = 0;
                if (delete_messages === 'ph') deletemessages = 3600;
                if (delete_messages === 'p6h') deletemessages = 21600;
                if (delete_messages === 'p12h') deletemessages = 43200;
                if (delete_messages === 'p24h') deletemessages = 86400;
                if (delete_messages === 'p3d') deletemessages = 259200;
                if (delete_messages === 'p7d') deletemessages = 604800;

                if (softban === true) {
                    member.ban({
                        deleteMessageSeconds: 604800,
                        reason: reason
                    })
                    guild.members.unban(member.id);
                    Reply(interaction, 'Green', '✅', `Successfully softbanned ${member.user.tag}, their messages have been deleted.`, false);

                    let dt = new Date();

                    const datems = dt.getTime();

                    const datetimestring = datems / 100;
                    const datetimedate = dt.getDate();

                    punishments.create({
                        Guild: interaction.guildId,
                        DateTimePunish: datetimedate,
                        DateTimePunishMS: datetimestring,
                        Moderator: `${interaction.user.id}`,
                        Punishment: `Softban`,
                        Reason: `${reason}`,
                        Time: `Permanent`,
                        User: `${member.id}`
                    });
                } else {
                    member.ban({
                        deleteMessageSeconds: deletemessages,
                        reason: reason
                    });
                    Reply(interaction, 'Green', '✅', `Successfully banned ${member.user.tag}.`, false);

                    let dt = new Date();

                    const datems = dt.getTime();

                    const datetimestring = datems / 100;
                    const datetimedate = dt.getDate();

                    punishments.create({
                        Guild: interaction.guildId,
                        DateTimePunish: datetimedate,
                        DateTimePunishMS: datetimestring,
                        Moderator: `${interaction.user.id}`,
                        Punishment: `Softban`,
                        Reason: `${reason}`,
                        Time: `Permanent`,
                        User: `${member.id}`
                    });
                }
            }
            break;

            case 'kick': {
                if(!user.id) return Reply(interaction, 'Red', '🛑', `That user is not in this guild.`, true);

                const member = guild.members.cache.get(user.id);
                if(!member) return Reply(interaction, 'Red', '🛑', `That user is not in this guild.`, true);

                if (!member.kickable) return Reply(interaction, 'Green', '✅', `User is not kickable.`, true);
                if (member.roles.highest.position >= interaction.member.roles.highest.position) return Reply(interaction, 'Red', '🚫', `That user's role is higher than or equal to yours.`, true);
                if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) return Reply(interaction, 'Red', '🚫', `That user's role is higher than or equal to mine.`, true);

                if (member.id === guild.ownerId) return Reply(interaction, 'Red', '🚫', `You cannot kick the server owner!`, true);

                member.kick(reason);
                Reply(interaction, 'Green', '✅', `Successfully kicked ${member.user.tag}`, false);

                let dt = new Date();

                const datems = dt.getTime();

                const datetimestring = datems / 100;
                const datetimedate = dt.getDate();

                punishments.create({
                    Guild: interaction.guildId,
                    DateTimePunish: datetimedate,
                    DateTimePunishMS: datetimestring,
                    Moderator: `${interaction.user.id}`,
                    Punishment: `Kick`,
                    Reason: `${reason}`,
                    Time: `Until User Rejoins`,
                    User: `${member.id}`
                });
            }
            break;

            case 'mute': {
                if(!user.id) return Reply(interaction, 'Red', '🛑', `That user is not in this guild.`, true);

                const member = guild.members.cache.get(user.id);
                if(!member) return Reply(interaction, 'Red', '🛑', `That user is not in this guild.`, true);

                if (!ms(duration) || ms(duration) > ms("28d")) return Reply(interaction, 'Red', '🚫', `Time provided is invalid or over the 24 day limit.`, true);

                if (!member.manageable || !member.moderatable) return Reply(interaction, 'Red', '🚫', 'Selected target is not moderatable by this bot.', true);

                if (interaction.member.roles.highest.position <= member.roles.highest.position) return Reply(interaction, 'Red', '🚫', 'Selected member has an equal or higher role than you.', true);
                if (interaction.guild.members.me.roles.highest.position <= member.roles.highest.position) return Reply(interaction, 'Red', '🚫', 'Selected member has an equal or higher role than me.', true);

                member.timeout(ms(duration), reason);
                Reply(interaction, 'Green', '✅', `Successfully timed out ${member} for ${duration}.\nReason: ${reason}`, false);

                let dt = new Date();

                const datems = dt.getTime();

                const datetimestring = datems / 100;
                const datetimedate = dt.getDate();

                punishments.create({
                    Guild: interaction.guildId,
                    DateTimePunish: datetimedate,
                    DateTimePunishMS: datetimestring,
                    Moderator: `${interaction.user.id}`,
                    Punishment: `Mute`,
                    Reason: `${reason}`,
                    Time: `${duration}`,
                    User: `${member.id}`
                });

                setTimeout(() => {
                    return interaction.channel.send({
                        content: `The timeout for ${member.user.tag} has ended.\nDuration: ${duration}\nReason: ${reason}`
                    });
                }, ms(duration))
            }
            break;

            case 'unmute': {
                if(!user.id) return Reply(interaction, 'Red', '🛑', `That user is not in this guild.`, true);

                const member = guild.members.cache.get(user.id);
                if(!member) return Reply(interaction, 'Red', '🛑', `That user is not in this guild.`, true);

                if (!member.manageable || !member.moderatable) return Reply(interaction, 'Red', '🚫', 'Selected target is not moderatable by this bot.', true);

                if (interaction.member.roles.highest.position < member.roles.highest.position) return Reply(interaction, 'Red', '🚫', 'Selected member has an equal or higher role than you.', true);
                if (interaction.guild.members.me.roles.highest.position < member.roles.highest.position) return Reply(interaction, 'Red', '🚫', 'Selected member has an equal or higher role than me.', true);

                member.timeout(null);
                Reply(interaction, 'Green', '✅', `Successfully removed the timeout for ${member}.`, false);
            }
            break;

            case 'unban': {
                const userid = options.getString('id');

                const isbanned = guild.bans.cache.get(userid);
                if (!isbanned) return Reply(interaction, 'Red', '🚫', `This user is not banned.`, true);

                guild.bans.remove(id);
                return Reply(interaction, 'Green', '✅', `${client.users.cache.get(id).tag} has been unbanned!`, false);
            }
            break;

            case 'unbanall': {
                const emoji = client.emojis.cache.get('1096078204680286329');

                const users = await guild.bans.fetch();
                const ids = users.map(u => u.user.id);

                await guild.fetchOwner();

                if (interaction.user.id != guild.ownerId) return Reply(interaction, 'Red', '❗️', 'You have to be the server owner in order to execute this command!', true);

                if (users.size <= 0) return Reply(interaction, 'Red', '❗️', 'There are no users banned in this guild.', true);

                await interaction.reply({ content: `${emoji} Unbanning everyone in the server. This may take a while, depending on the amount of bans you have.`, ephemeral: true });

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

            case 'warn': {
                const member = guild.members.cache.get(user.id);
                if(!member) return Reply(interaction, 'Red', '🛑', `That user is not in this guild.`, true);

                let dt = new Date();

                const datems = dt.getTime();

                const datetimestring = datems / 100;
                const datetimedate = dt.getDate();

                punishments.create({
                    Guild: interaction.guildId,
                    DateTimePunish: datetimedate,
                    DateTimePunishMS: datetimestring,
                    Moderator: `${interaction.user.id}`,
                    Punishment: `Warning`,
                    Reason: `${reason}`,
                    Time: `No Duration.`,
                    User: `${member.id}`
                });

                const msg = await interaction.reply({
                    content: `\`✅\` Issued warning to ${user}.`,
                    ephemeral: true
                });

                if(!interaction.channel.permissionsFor(interaction.guild.members.me).has('SendMessages')) return msg.edit({ content: `\`✅\` Issued warning to ${member}.\n\`❗️\` Warning: I do not have permissions to speak in this channel.` });

                return interaction.channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Warning Issued`)
                        .setDescription(`A warning has been issued to <@${member.id}>.`)
                        .addFields(
                            {
                                name: 'User',
                                value: `<@${member.id}>`,
                                inline: true
                            },
                            {
                                name: 'Moderator',
                                value: `<@${interaction.user.id}>`,
                                inline: true
                            },
                            {
                                name: 'Reason',
                                value: `${reason}`,
                                inline: true
                            }
                        )
                        .setColor('Gold')
                        .setFooter({ text: `Portal+ Moderation System` })
                    ],
                    content: `<@${user.id}>`
                })
            }
            break;

            case 'removepunishment': {
                if (id.length > 24) return interaction.reply({ content: `\`❗️\` The ID you provided is not 24 characters in length.`, ephemeral: true });
                if (id.length < 24) return interaction.reply({ content: `\`❗️\` The ID you provided is not 24 characters in length.`, ephemeral: true });
                if (id.length === 24) {
                    const data = await punishments.findById(warnid);
                    if (!data) return interaction.reply({ content: `\`❗️\` There is no punishment with that ID.`, ephemeral: true });

                    data.deleteOne({ _id: id });
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`:white_check_mark: Successfully Deleted Punishment`)
                            .setDescription(`> I have successfully deleted the punishment with ID ${id}.`)
                            .addFields(
                                { name: 'Moderator', value: `<@${data.Moderator}>`, inline: true },
                                { name: 'User', value: `<@${data.User}>`, inline: true },
                                { name: 'Punishment', value: `${data.Punishment}`, inline: true },
                                { name: 'Reason', value: `${data.Reason}`, inline: true }
                            )
                            .setFooter({ text: `Portal+ Moderation System` })
                            .setColor('Gold')
                        ]
                    });
                } else return;
            }
            break;

            case 'clearpunishments': {
                const data = await punishments.find({ Guild: interaction.guildId, User: user.id });
                if(data.length <= 0) return Reply(interaction, 'Green', '🛑', `That user doesn't have any punishments, well done!`, true);

                const confirmbutton = new ButtonBuilder()
                .setCustomId('yes')
                .setLabel('✅ Clear All Punishments')
                .setStyle(ButtonStyle.Success)

                const denybutton = new ButtonBuilder()
                .setCustomId('deny')
                .setLabel('❌ Cancel')
                .setStyle(ButtonStyle.Danger)

                const row = new ActionRowBuilder()
                .addComponents(
                    confirmbutton,
                    denybutton
                )

                const reply = await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`\`🛑\` | Are you sure you want to remove all warnings from this user? This cannot be undone.`)
                    ],
                    components: [row]
                });

                const filter = i => i.user.id === interaction.user.id;

                const collector = await reply.createMessageComponentCollector({ time: 15000, filter: filter });

                collector.on('collect', async(results) => {
                    if(results.customId === 'yes') {
                        row.components[0].setDisabled(true)
                        row.components[1].setDisabled(true);
                        reply.edit({
                            embeds: [
                                new EmbedBuilder()
                                .setDescription(`\`✅\` Successfully removed all punishments from ${user.tag}.`)
                                .setColor('Green')
                            ]
                        });

                        return await punishments.deleteMany({ Guild: interaction.guildId, User: user.id });
                    } else if (results.customId === 'deny') {
                        row.components[0].setDisabled(true);
                        row.components[1].setDisabled(true);

                        reply.edit({
                            embeds: [
                                new EmbedBuilder()
                                .setDescription(`\`🛑\` Command has been aborted.`)
                                .setColor('Red')
                            ]
                        });
                    } else return;
                })
            }
            break;

            case 'viewpunishments': {
                const data = await punishments.find({ Guild: interaction.guildId, User: user.id });
                if(data.length <= 0 || !data) return Reply(interaction, 'Red', '🛑', `That user has no punishments... Well Done!`, false);

                const allpunishments = data.map((dat) => {
                    return `ID: ${dat._id}\nModerator: <@${dat.Moderator}>\nPunishment: ${dat.Punishment}\nDuration: ${dat.Time}\nReason: ${dat.Reason}`
                }).join('\n\n');



                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`All Punishments for ${user.tag}`)
                        .setDescription(allpunishments)
                        .setColor('Gold')
                        .setFooter({ text: `Portal+ Moderation System` })
                    ]
                })
            }
            break;

            case 'addrole': {
                const role = interaction.options.getRole('role');

                const member = guild.members.cache.get(user.id);
                if(!member) return Reply(interaction, 'Red', '🛑', `That user is not in this guild.`, true);

                const data = await temprole.findOne({ Guild: interaction.guildId, User: member.id, Role: role.id });
                if(!data) return Reply(interaction, 'Red', '🛑', `That user has been temporarily assigned that role. You cannot add it permanently while the timer is ongoing.`, true);

                if(role.position >= guild.members.me.roles.highest.position) return Reply(interaction, 'Red', '🛑', `That role is higher than my highest role, I am unable to add it.`, true);
                if(role.position >= interaction.member.roles.highest.position) return Reply(interaction, 'Red', '🛑', `That role is higher than your highest role.`, true);
                if(member.roles.highest.position >= interaction.member.roles.highest.position) return Reply(interaction, 'Red', '🛑', `That member's role position is higher than yours.`, true);
                if(member.roles.highest.position >= guild.members.me.roles.highest.position) return Reply(interaction, 'Red', '🛑', `That member's role position is higher than mine.`, true);

                if(member.roles.cache.has(role.id)) return Reply(interaction, 'Orange', '⚠️', `Nothing changed; the user already has that role.`, true);

                member.roles.add(role.id);
                return Reply(interaction, 'Green', '✅', `Added \`${role}\` role to \`${user}\``, false);
            }
            break;

            case 'removerole': {
                const role = interaction.options.getRole('role');

                const member = guild.members.cache.get(user.id);
                if(!member) return Reply(interaction, 'Red', '🛑', `That user is not in this guild.`, true);

                const data = await temprole.findOne({ Guild: interaction.guildId, User: member.id, Role: role.id });
                if(!data) return Reply(interaction, 'Red', '🛑', `That user has been temporarily assigned that role. You cannot remove it while the timer is ongoing.`, true);

                if(role.position >= guild.members.me.roles.highest.position) return Reply(interaction, 'Red', '🛑', `That role is higher than my highest role, I am unable to add it.`, true);
                if(role.position >= interaction.member.roles.highest.position) return Reply(interaction, 'Red', '🛑', `That role is higher than your highest role.`, true);
                if(member.roles.highest.position >= interaction.member.roles.highest.position) return Reply(interaction, 'Red', '🛑', `That member's role position is higher than yours.`, true);
                if(member.roles.highest.position >= guild.members.me.roles.highest.position) return Reply(interaction, 'Red', '🛑', `That member's role position is higher than mine.`, true);

                if(!member.roles.cache.has(role.id)) return Reply(interaction, 'Orange', '⚠️', `Nothing changed; the user already has that role.`, true);

                member.roles.remove(role.id);
                return Reply(interaction, 'Green', '✅', `Removed \`${role}\` role from \`${user}\``, false);
            }
            break;
        }
    }
}