const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, Client, EmbedBuilder, ChannelType } = require('discord.js');
const GManager = require('../../giveawaysManager');
const ms = require('ms');
const { ReplyError } = require('../../util/replies');

module.exports = {
    category: 'Utility',
    data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Configure giveaways!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand((sub) =>
        sub.setName('start')
        .setDescription('Start a giveaway!')
        .addStringOption((opt) =>
            opt.setName('duration')
            .setDescription('The duration of the giveaway! (e.g. 2m, 2h, 2d)')
            .setRequired(true)
        )
        .addIntegerOption((opt) =>
            opt.setName('winners')
            .setDescription('How many winners will there be!?')
            .setRequired(true)
            .setMinValue(1)
        )
        .addStringOption((opt) =>
            opt.setName('prize')
            .setDescription(`What will the winners get? :)`)
            .setRequired(true)
        )
        .addChannelOption((opt) =>
            opt.setName('channel')
            .setDescription('The channel you want the giveaway message to be sent to!')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
        .addStringOption((opt) =>
            opt.setName('message')
            .setDescription('The message you want to appear in teh giveaway embed')
            .setRequired(true)
            .setMaxLength(2048)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('edit')
        .setDescription('Edit an existing giveaway!')
        .addStringOption((opt) =>
            opt.setName('messageid')
            .setDescription('The ID of the message that contains the giveaway embed')
            .setRequired(true)
        )
        .addStringOption((opt) =>
            opt.setName('duration')
            .setDescription(`The duration you want to add to the giveaway (2m, 2h, 2d)`)
            .setRequired(true)
        )
        .addIntegerOption((opt) =>
            opt.setName('winners')
            .setDescription('How many winners will there be!?')
            .setRequired(true)
            .setMinValue(1)
        )
        .addStringOption((opt) =>
            opt.setName('prize')
            .setDescription(`What will the winners get? :)`)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('end')
        .setDescription('End a giveaway!')
        .addStringOption((opt) =>
            opt.setName('messageid')
            .setDescription('The ID of the message that contains the giveaway embed')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('reroll')
        .setDescription('Reroll a giveaway!')
        .addStringOption((opt) =>
            opt.setName('messageid')
            .setDescription('The ID of the message that contains the giveaway embed')
            .setRequired(true)
        )
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    
    async execute(interaction, client) {
        const { guildId, options } = interaction;

        const loadingemoji = client.emojis.cache.get('1096078204680286329');
        const successemoji = client.emojis.cache.get('1099831412451979284');

        const duration = options.getString('duration');
        const winners = options.getInteger('winners');
        const prize = options.getString('prize');
        const channel = options.getChannel('channel');
        const message = options.getString('message');
        const messageid = options.getString('messageid');
        const sub = options.getSubcommand();

        switch(sub) {
            case 'start': {
                const msduration = ms(duration);
                if(isNaN(msduration) || !msduration) return ReplyError(interaction, client, `The duration provided is not valid.`, true);

                await interaction.reply({ content: `${loadingemoji} Starting giveaway... :)` });

                GManager.start(channel, {
                    prize: `${prize}`,
                    winnerCount: winners,
                    duration: msduration,
                    hostedBy: `<@${interaction.user.id}>`,
                    lastChance: {
                        enabled: true,
                        content: `${message}`,
                        embedColor: `Red`,
                        threshold: 60000000000_000
                    },
                });

                return interaction.editReply({
                    content: ``,
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`${successemoji} Giveaway Successfully Started`)
                        .setDescription(`> A giveaway has been started in ${channel}`)
                        .setFooter({ text: `Portal+` })
                        .setColor('Gold')
                        .setTimestamp()
                    ]
                });
            }
            break;

            case 'edit': {
                const msduration = ms(duration);
                if(isNaN(msduration) || !msduration) return ReplyError(interaction, client, `The duration provided is not valid.`, true);

                GManager.edit(messageid, {
                    addTime: msduration,
                    newWinnerCount: winners,
                    newPrize: prize,
                }).catch(err => {
                    return ReplyError(interaction, client, `An error occured whilst editing the giveaway.`, true);
                });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`${successemoji} Successfully Edited Giveaway`)
                        .setDescription(`> The giveaway has successfully been edited.`)
                        .setColor('Gold')
                        .setTimestamp()
                        .setFooter({ text: `Portal+` })
                    ]
                });
            }
            break;

            case 'end': {
                GManager.end(messageid).catch(err => {
                    return ReplyError(interaction, client, `An error occured whilst ending your giveaway.`, true);
                });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`${successemoji} Successfully Ended Giveaway`)
                        .setDescription(`> You have successfully ended the giveaway with message ID ${messageid}.`)
                        .setColor('Gold')
                        .setFooter({ text: `Portal+` })
                        .setTimestamp()
                    ]
                });
            }
            break;
            
            case 'reroll': {
                const giveaway = GManager.giveaways.find((g) => g.guildId === interaction.guildId && g.prize === messageid) || GManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageid);

                if(!giveaway) return ReplyError(interaction, client, `I could not find a giveaway with ID ${messageid}.`, true);

                GManager.reroll(messageid).catch(err => {
                    return ReplyError(interaction, client, `An error occured whilst rerolling your giveaway.`, true);
                });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`${successemoji} Successfully Rerolled Giveaway`)
                        .setDescription(`> You have successfully rerolled the giveaway with message ID ${messageid}.`)
                        .setColor('Gold')
                        .setFooter({ text: `Portal+` })
                        .setTimestamp()
                    ]
                })
            }
            break;
        }
    }
}