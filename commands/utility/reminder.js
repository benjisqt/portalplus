const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const reminderSchema = require('../../models/reminderSchema');
const vip = require('../../models/vip');
const emojis = require('../../util/emojis.json');
const { Reply } = require('../../util/replies');
const ms = require('ms');

module.exports = {
    category: 'Utility',
    data: new SlashCommandBuilder()
    .setName('reminder')
    .setDescription('Reminder system!')
    .addSubcommand((sub) =>
        sub.setName('create')
        .setDescription('Create a reminder!')
        .addStringOption((opt) =>
            opt.setName('reminder')
            .setDescription('The reminder!')
            .setRequired(true)
        )
        .addStringOption((opt) =>
            opt.setName('duration')
            .setDescription('Duration of the reminder (e.g. 10m, 10h)')
            .setRequired(true)
        )
        .addStringOption((opt) =>
            opt.setName('remindquiet')
            .setDescription('Do you want to be reminded quietly or publicly?')
            .addChoices(
                { name: 'Be Reminded Quietly', value: 'quiet' },
                { name: 'Be Reminded Publicly', value: 'public' },
            )
            .setRequired(true)
        )
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction, client) {
        const emoji = client.emojis.cache.get(emojis.handler.directories.clientemojis.Success);

        const sub = interaction.options.getSubcommand();

        switch(sub) {
            case 'create': {
                const reminder = interaction.options.getString('reminder');

                const duration = interaction.options.getString('duration');

                const remindquiet = interaction.options.getString('remindquiet');

                const durationms = ms(duration);

                if(isNaN(durationms)) return Reply(interaction, 'Red', '❗️', 'Invalid duration format.', true);

                var dt = new Date();

                var timestamp = dt.getTime();

                var date = timestamp + durationms;

                var remindDate = date / 1000;
                var dateconversion = remindDate * 1000;

                var d = new Date(dateconversion);

                const data = await reminderSchema.find({ Guild: interaction.guildId, User: interaction.user.id });
                if(data.length >= 3) {
                    const vipdata = await vip.findOne({ Guild: interaction.guildId });
                    if(!vipdata) return Reply(interaction, 'Red', '❗️', `You need a VIP license of Portal+ in this guild to make more than 3 reminders at a time.`, true);
                }

                await reminderSchema.create({
                    Guild: interaction.guildId,
                    User: interaction.user.id,
                    Reminder: reminder,
                    RemindQuietly: remindquiet,
                    Remind: d,
                });

                return Reply(interaction, 'Gold', `${emoji}`, `Reminder saved:\n\`Reminder: ${reminder}\``, true);
            }
            break;
        }
    }
}