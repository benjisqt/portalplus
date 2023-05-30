const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction, AutoModerationRuleTriggerType, AutoModerationRuleEventType, AutoModerationActionType, AutoModerationRuleKeywordPresetType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Automod configuration!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
        sub.setName('flagged-words')
        .setDescription('Block provocative words in messages.')
    )
    .addSubcommand((sub) =>
        sub.setName('spam')
        .setDescription('Block messages that are suspected of spam.')
    )
    .addSubcommand((sub) =>
        sub.setName('mention-spam')
        .setDescription('Stop people from @mention spamming!')
        .addIntegerOption((opt) =>
            opt.setName('mentions')
            .setDescription('The amount of mentions required to block a message')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('keyword')
        .setDescription('Block given keywords in messages!')
        .addStringOption((opt) =>
            opt.setName('word')
            .setDescription('The word to be blocked!')
            .setRequired(true)
        )
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const { guild, options } = interaction;
        const sub = options.getSubcommand();

        switch(sub) {
            case 'flagged-words': {
                await interaction.reply({ content: `<a:portalloading:1096078204680286329> Loading automod rule...` });

                const rule = await guild.autoModerationRules.create({
                    name: 'Block flagged words by Discord - Portal+',
                    enabled: true,
                    eventType: AutoModerationRuleEventType.MessageSend,
                    triggerType: AutoModerationRuleTriggerType.KeywordPreset,
                    triggerMetadata: {
                        presets: [AutoModerationRuleKeywordPresetType.Profanity, AutoModerationRuleKeywordPresetType.SexualContent, AutoModerationRuleKeywordPresetType.Slurs]
                    },
                    actions: [
                        {
                            type: AutoModerationActionType.BlockMessage,
                            metadata: {
                                channel: interaction.channel.id,
                                durationSeconds: 10,
                                customMessage: `This message was prevented by Portal+ AutoMod.`
                            }
                        }
                    ]
                }).catch(async err => {
                    setTimeout(async () => {
                        console.log(err);
                        await interaction.editReply({ content: `${err}` });
                    })
                })

                setTimeout(async () => {
                    if(!rule) return;

                    const embed = new EmbedBuilder()
                    .setColor('Gold')
                    .setTitle(`<a:portalsuccess:1099831412451979284> Successfully created AutoMod rule`)
                    .setDescription(`> Your AutoMod rule has been created. All profanity will be blocked by Portal+`)
                    .setFooter({ text: `Portal+ Auto Moderation` })
                    .setTimestamp()

                    await interaction.editReply({ content: ``, embeds: [embed] });
                })
            }
            break;

            case 'keyword': {
                await interaction.reply({ content: `<a:portalloading:1096078204680286329> Loading automod rule...` });
                const word = options.getString('word');

                const rule2 = await guild.autoModerationRules.create({
                    name: `Prevent ${word} from being used - Portal+`,
                    enabled: true,
                    eventType: AutoModerationRuleEventType.MessageSend,
                    triggerType: AutoModerationRuleTriggerType.Keyword,
                    triggerMetadata: {
                        keywordFilter: [`${word}`],
                    },
                    actions: [
                        {
                            type: AutoModerationActionType.BlockMessage,
                            metadata: {
                                channel: interaction.channel.id,
                                durationSeconds: 10,
                                customMessage: `This message was prevented by Portal+ AutoMod.`
                            }
                        }
                    ]
                }).catch(async err => {
                    setTimeout(async () => {
                        console.log(err);
                        await interaction.editReply({ content: `${err}` });
                    })
                })

                setTimeout(async () => {
                    if(!rule2) return;

                    const embed2 = new EmbedBuilder()
                    .setColor('Gold')
                    .setTitle(`<a:portalsuccess:1099831412451979284> Successfully created AutoMod rule`)
                    .setDescription(`> Your AutoMod rule has been created. ${word} will be blocked by Portal+`)
                    .setFooter({ text: `Portal+ Auto Moderation` })
                    .setTimestamp()

                    await interaction.editReply({ content: ``, embeds: [embed2] });
                })
            }
            break;

            case 'mention-spam': {
                await interaction.reply({ content: `<a:portalloading:1096078204680286329> Loading automod rule...` });
                const mentions = options.getInteger('mentions');

                const rule3 = await guild.autoModerationRules.create({
                    name: `Prevent mention spam - Portal+`,
                    enabled: true,
                    eventType: AutoModerationRuleEventType.MessageSend,
                    triggerType: AutoModerationRuleTriggerType.MentionSpam,
                    triggerMetadata: {
                        mentionTotalLimit: mentions,
                    },
                    actions: [
                        {
                            type: AutoModerationActionType.BlockMessage,
                            metadata: {
                                channel: interaction.channel.id,
                                durationSeconds: 10,
                                customMessage: `This message was prevented by Portal+ AutoMod.`
                            }
                        }
                    ]
                }).catch(async err => {
                    setTimeout(async () => {
                        console.log(err);
                        await interaction.editReply({ content: `${err}` });
                    })
                })

                setTimeout(async () => {
                    if(!rule3) return;

                    const embed3 = new EmbedBuilder()
                    .setColor('Gold')
                    .setTitle(`<a:portalsuccess:1099831412451979284> Successfully created AutoMod rule`)
                    .setDescription(`> Your AutoMod rule has been created. More than ${mentions} mentions will be blocked by Portal+`)
                    .setFooter({ text: `Portal+ Auto Moderation` })
                    .setTimestamp()

                    await interaction.editReply({ content: ``, embeds: [embed3] });
                })
            }
            break;

            case 'spam': {
                await interaction.reply({ content: `<a:portalloading:1096078204680286329> Loading automod rule...` });

                const rule4 = await guild.autoModerationRules.create({
                    name: `Prevent ${word} from being used - Portal+`,
                    enabled: true,
                    eventType: AutoModerationRuleEventType.MessageSend,
                    triggerType: AutoModerationRuleTriggerType.Spam,
                    triggerMetadata: {},
                    actions: [
                        {
                            type: AutoModerationActionType.BlockMessage,
                            metadata: {
                                channel: interaction.channel.id,
                                durationSeconds: 10,
                                customMessage: `This message was prevented by Portal+ AutoMod.`
                            }
                        }
                    ]
                }).catch(async err => {
                    setTimeout(async () => {
                        console.log(err);
                        await interaction.editReply({ content: `${err}` });
                    })
                })

                setTimeout(async () => {
                    if(!rule4) return;

                    const embed4 = new EmbedBuilder()
                    .setColor('Gold')
                    .setTitle(`<a:portalsuccess:1099831412451979284> Successfully created AutoMod rule`)
                    .setDescription(`> Your AutoMod rule has been created. Spam messages will be blocked by Portal+`)
                    .setFooter({ text: `Portal+ Auto Moderation` })
                    .setTimestamp()

                    await interaction.editReply({ content: ``, embeds: [embed4] });
                })
            }
            break;
        }
    }
}