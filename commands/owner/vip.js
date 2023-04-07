const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js');
const moment = require('moment');
const vip = require('../../models/vip');
const vipcodes = require('../../models/vipcodes');
const {
    Reply
} = require('../../util/replies');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vip')
        .setDescription('VIP system commands')
        .addSubcommand((sub) =>
            sub.setName('gen')
                .setDescription('Generate a VIP code')
                .addStringOption((opt) =>
                    opt.setName('duration')
                        .setDescription('The duration of the VIP plan')
                        .addChoices({
                            name: '1 day',
                            value: 'daily'
                        }, {
                            name: '7 days',
                            value: 'weekly'
                        }, {
                            name: '30 days',
                            value: 'monthly'
                        }, {
                            name: '365 days',
                            value: 'yearly'
                        },)
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub.setName('revoke')
                .setDescription('Revoke a VIP license')
                .addBooleanOption((opt) =>
                    opt.setName('silent')
                        .setDescription('Whether command feedback should only be sent to you')
                )
        )
        .addSubcommand((sub) =>
            sub.setName('all')
                .setDescription('See all VIP codes')
                .addBooleanOption((opt) =>
                    opt.setName('silent')
                        .setDescription('Whether command feedback should only be sent to you')
                )
        )
        .addSubcommand((sub) =>
            sub.setName('allredeemed')
                .setDescription('See all redeemed VIP codes')
                .addBooleanOption((opt) =>
                    opt.setName('silent')
                        .setDescription('Whether command feedback should only be sent to you')
                )
        )
        .addSubcommand((sub) =>
            sub.setName('redeem')
                .setDescription('Redeem a VIP code')
                .addStringOption((opt) =>
                    opt.setName('code')
                        .setDescription('The code to redeem')
                        .setRequired(true)
                )
                .addBooleanOption((opt) =>
                    opt.setName('silent')
                        .setDescription('Whether command feedback should only be sent to you')
                )
        )
        .addSubcommand((sub) =>
            sub.setName('status')
                .setDescription('VIP status for the guild!')
                .addBooleanOption((opt) =>
                    opt.setName('silent')
                        .setDescription('Whether command feedback should only be sent to you')
                )
        ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction, client) {
        const sub = interaction.options.getSubcommand();
        const silent = interaction.options.getBoolean('silent') || false;

        switch (sub) {
            case 'gen': {
                if (interaction.member.id !== '1005460072274595960') return interaction.reply({
                    content: `Only the bot owner can execute this command!`
                });

                const duration = interaction.options.getString('duration');

                const generatedCode = Math.random().toString(36).substring(2, 8);

                const newCode = await new vipcodes({
                    Code: generatedCode,
                    Length: duration,
                });

                newCode.save();

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: 'Code Generated',
                                iconURL: interaction.client.user.displayAvatarURL()
                            })
                            .setDescription(`Your code has been successfully generated.`)
                            .setFields({
                                name: 'Code',
                                value: `${generatedCode}`,
                                inline: true
                            }, {
                                name: 'Length',
                                value: `${duration}`,
                                inline: true
                            },)
                            .setColor('Gold')
                    ], ephemeral: true
                })
            }
                break;

            case 'redeem': {
                if (!interaction.memberPermissions.has('Administrator')) return Reply(interaction, 'Red', '🚫', 'Only Administrators can redeem a license!', true);
                if (!interaction.memberPermissions.has('Administrator')) return Reply(
                    interaction, 'Red', '🚫', 'Only people with the Administrator permission can run this command!', true
                );

                const code = interaction.options.getString('code');
                const validCode = await vipcodes.findOne({
                    Code: code
                });
                const redeemedCode = await vip.findOne({
                    Code: code
                });

                if (!validCode) return interaction.reply({
                    content: `That is not a valid generated code.`,
                    ephemeral: true,
                });
                if (redeemedCode) return interaction.reply({
                    content: `This code has already been redeemed.`,
                    ephemeral: true,
                });

                const redeemedGuild = await vip.findOne({
                    Guild: interaction.guildId
                });
                if (redeemedGuild) return interaction.reply({
                    content: `This guild already has a VIP license.`,
                    ephemeral: true,
                });

                let dt = new Date();

                let expiration;

                if (validCode.Length === 'daily') expiration = 1;
                if (validCode.Length === 'weekly') expiration = 7;
                if (validCode.Length === 'monthly') expiration = 30;
                if (validCode.Length === 'yearly') expiration = 365;

                dt.setDate(dt.getDate() + expiration);

                await new vip({
                    Guild: interaction.guildId,
                    Code: code,
                    Duration: validCode.Length,
                    Expires: dt,
                    User: interaction.user.id
                }).save();

                var unixTimestamp = moment(dt).unix();

                let redeemed;
                if (validCode.Length == 'daily') redeemed = 1;
                if (validCode.Length == 'weekly') redeemed = 7;
                if (validCode.Length == 'monthly') redeemed = 30;
                if (validCode.Length == 'yearly') redeemed = 365;

                if (silent === true) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`Code Redeemed`)
                                .setDescription(`A VIP license has been redeemed for this guild.`)
                                .addFields(
                                    { name: 'Duration', value: `${redeemed} day(s)` },
                                    { name: 'Code Redeemed', value: `${validCode.Code}` },
                                    { name: 'Expires', value: `<t:${Math.round(unixTimestamp)}:f> (<t:${Math.round(unixTimestamp)}:R>)` },
                                )
                                .setColor('Green')
                                .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
                        ],
                        ephemeral: true
                    })
                } else {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`Code Redeemed`)
                                .setDescription(`A VIP license has been redeemed for this guild.`)
                                .addFields(
                                    { name: 'Duration', value: `${redeemed} day(s)` },
                                    { name: 'Code Redeemed', value: `${validCode.Code}` },
                                    { name: 'Expires', value: `<t:${Math.round(unixTimestamp)}:f> (<t:${Math.round(unixTimestamp)}:R>)` },
                                )
                                .setColor('Green')
                                .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
                        ],
                    })
                }
            }
                break;

            case 'revoke': {
                if (!interaction.memberPermissions.has('Administrator')) return Reply(interaction, 'Red', '🚫', 'Only Administrators can revoke a license!', true);

                const premiumGuild = await vip.findOne({
                    Guild: interaction.guildId
                });
                const code = await vipcodes.findOne({
                    Code: premiumGuild.Code
                });
                let premiumCode = premiumGuild.Code;
                if (!premiumGuild) return interaction.reply({
                    content: `This guild doesn't have a VIP license.`,
                    ephemeral: true,
                });

                premiumGuild.deleteOne({
                    Guild: interaction.guildId
                });
                code.deleteOne({
                    Code: premiumCode
                });

                if (silent === true) {
                    return interaction.reply({
                        content: `VIP license revoked.`,
                        ephemeral: true
                    });
                } else {
                    return interaction.reply({
                        content: `VIP license revoked.`,
                        ephemeral: false
                    });
                }
            }
                break;

            case 'status': {
                if (!interaction.memberPermissions.has('Administrator')) return Reply(interaction, 'Red', '🚫', 'Only Administrators can see the status of a license!', true);
                const premiumGuild = await vip.findOne({
                    Guild: interaction.guildId
                });

                if (!premiumGuild) return interaction.reply({
                    content: `No premium license has been redeemed for this guild.`,
                    ephemeral: true,
                });

                var date = new Date(premiumGuild.Expires);

                var unixTimestamp = moment(date).unix();

                let redeemed;

                let user = interaction.guild.members.cache.get(premiumGuild.User);
                if (user) redeemed = user.user.tag;
                if (!user) redeemed = 'User has left.';

                if (silent === true) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`VIP license: ${interaction.guild.name}`)
                                .addFields({
                                    name: 'Expires On',
                                    value: `<t:${Math.round(unixTimestamp)}:f> (<t:${Math.round(unixTimestamp)}:R>)`
                                }, {
                                    name: 'Redeemed By',
                                    value: `\`${redeemed}\``
                                }, {
                                    name: 'Code',
                                    value: `${premiumGuild.Code}`
                                }, {
                                    name: 'Plan',
                                    value: `${premiumGuild.Duration}`
                                },)
                                .setColor('Gold')
                                .setAuthor({
                                    name: `${interaction.guild.members.me.user.username}`,
                                    iconURL: client.user.displayAvatarURL()
                                })
                                .setThumbnail(interaction.guild.iconURL({
                                    dynamic: true,
                                    size: 1024
                                }))
                        ], ephemeral: true
                    })
                } else {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`VIP license: ${interaction.guild.name}`)
                                .addFields({
                                    name: 'Expires On',
                                    value: `<t:${Math.round(unixTimestamp)}:f> (<t:${Math.round(unixTimestamp)}:R>)`
                                }, {
                                    name: 'Redeemed By',
                                    value: `\`${redeemed}\``
                                }, {
                                    name: 'Code',
                                    value: `${premiumGuild.Code}`
                                }, {
                                    name: 'Plan',
                                    value: `${premiumGuild.Duration}`
                                },)
                                .setColor('Gold')
                                .setAuthor({
                                    name: `${interaction.guild.members.me.user.username}`,
                                    iconURL: client.user.displayAvatarURL()
                                })
                                .setThumbnail(interaction.guild.iconURL({
                                    dynamic: true,
                                    size: 1024
                                }))
                        ]
                    })
                }
            }
                break;

            case 'allredeemed': {
                if (interaction.member.id !== '1005460072274595960') return interaction.reply({
                    content: `Only the bot owner can execute this command!`
                });
                var array = (await vipcodes.find()).map(function (code) {
                    return code.Code;
                });

                const vipguildinfo = await (await vip.find({
                    Code: array
                })).map(function (guild) {
                    return `Guild ID: ${guild.Guild}\nDuration: ${guild.Duration}\nCode: ${guild.Code}`;
                });

                if(!vipguildinfo.length) return Reply(interaction, 'Red', '❗️', `No VIP licenses have been redeemed.`, true);
                
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`All Redeemed VIP codes`)
                            .setDescription(`${vipguildinfo.join('\n\n')}`)
                            .setColor('Random')
                    ],
                    ephemeral: true
                })
            }
                break;

            case 'all': {
                if (interaction.member.id !== '1005460072274595960') return interaction.reply({
                    content: `Only the bot owner can execute this command!`
                });
                var array = (await vipcodes.find()).map(function (code) {
                    if (!code) return interaction.reply({ content: `There appears to be no VIP codes.` });
                    return code.Code;
                });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`All VIP codes (redeemed or not)`)
                            .setColor('Random')
                            .setDescription(`${array.join('\n')}`)
                    ], ephemeral: true
                })
            }
                break;
        }
    }
}