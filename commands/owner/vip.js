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
                }, )
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
            sub.setName('revoke')
            .setDescription('Revoke a VIP license')
        )
        .addSubcommand((sub) =>
            sub.setName('redeem')
            .setDescription('Redeem a VIP code')
            .addStringOption((opt) =>
                opt.setName('code')
                .setDescription('The code to redeem')
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
            sub.setName('status')
            .setDescription('VIP status for the guild!')
        ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction, client) {
        const sub = interaction.options.getSubcommand();
        const vipee = vip.findOne({
            Guild: interaction.guildId
        });

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
                        }, )
                        .setColor('Gold')
                    ], ephemeral: true
                })
            }
            break;

        case 'redeem': {
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
                content: `That is not a valid generated code.`
            });
            if (redeemedCode) return interaction.reply({
                content: `This code has already been redeemed.`
            });

            const redeemedGuild = await vip.findOne({
                Guild: interaction.guildId
            });
            if (redeemedGuild) return interaction.reply({
                content: `This guild already has a VIP license.`
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

            return interaction.reply({
                content: `Code redeemed! Duration: ${expiration} day(s)`
            })
        }
        break;

        case 'revoke': {
            const premiumGuild = await vip.findOne({
                Guild: interaction.guildId
            });
            const code = await vipcodes.findOne({
                Code: premiumGuild.Code
            });
            let premiumCode = premiumGuild.Code;
            if (!premiumGuild) return interaction.reply({
                content: `This guild doesn't have a VIP license.`
            });

            premiumGuild.deleteOne({
                Guild: interaction.guildId
            });
            code.deleteOne({
                Code: premiumCode
            });
            return interaction.reply({
                content: `VIP license revoked.`
            });
        }
        break;

        case 'status': {
            const premiumGuild = await vip.findOne({
                Guild: interaction.guildId
            });

            if(!premiumGuild) return interaction.reply({ content: `No premium license has been redeemed for this guild.` });

            var date = new Date(premiumGuild.Expires);

            var unixTimestamp = moment(date).unix();

            let redeemed;

            let user = interaction.guild.members.cache.get(premiumGuild.User);
            if(user) redeemed = user.user.tag;
            if(!user) redeemed = 'User has left.';

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`VIP license: ${interaction.guild.name}`)
                    .addFields(
                        { name: 'Expires On', value: `<t:${Math.round(unixTimestamp)}:f> (<t:${Math.round(unixTimestamp)}:R>)` },
                        { name: 'Redeemed By', value: `\`${redeemed}\`` },
                        { name: 'Code', value: `${premiumGuild.Code}` },
                        { name: 'Plan', value: `${premiumGuild.Duration}` },
                    )
                    .setColor('Gold')
                    .setAuthor({ name: `${interaction.guild.members.me.user.username}`, iconURL: client.user.displayAvatarURL() })
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
                ]
            })
        }
        break;
        }
    }
}