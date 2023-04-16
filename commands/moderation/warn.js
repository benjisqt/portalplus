const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const warnings = require('../../models/warnings');

module.exports = {
    category: 'moderation',
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user!')
        .addSubcommand((sub) =>
            sub.setName('add')
                .setDescription('Add a warning onto someone')
                .addUserOption((opt) =>
                    opt.setName('user')
                        .setDescription('The user you want to warn')
                        .setRequired(true)
                )
                .addStringOption((opt) =>
                    opt.setName('reason')
                        .setDescription('The reason for warning the user')
                )
        )
        .addSubcommand((sub) =>
            sub.setName('remove')
                .setDescription('Remove a warning from someone')
                .addStringOption((opt) =>
                    opt.setName('warnid')
                        .setDescription('The ID of the warning (provided by doing /warn all <user>)')
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub.setName('all')
                .setDescription('Get all warns for a user')
                .addUserOption((opt) =>
                    opt.setName('user')
                        .setDescription('The user whose warnings you want to get')
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub.setName('clear')
                .setDescription('Clear all warnings from a user')
                .addUserOption((opt) =>
                    opt.setName('user')
                        .setDescription('The user whose warnings you want to clear')
                        .setRequired(true)
                )
        ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'add': {
                const user = interaction.options.getUser('user');
                const reason = interaction.options.getString('reason') || "No Reason.";

                const member = interaction.guild.members.cache.get(user.id);
                if (!member) return interaction.reply({
                    content: `\`❗️\` That member is not in this guild.`,
                    ephemeral: true
                });

                await new warnings({
                    Guild: interaction.guildId,
                    User: user.id,
                    Reason: reason,
                    Moderator: interaction.user.id,
                }).save();

                return interaction.reply({
                    content: `\`✅\` Issued warning to ${user}.`,
                });
            }
                break;

            case 'remove': {
                const warnid = interaction.options.getString('warnid');

                if (warnid.length > 24) return interaction.reply({ content: `\`❗️\` The ID you provided is not 24 characters in length.`, ephemeral: true });
                if (warnid.length < 24) return interaction.reply({ content: `\`❗️\` The ID you provided is not 24 characters in length.`, ephemeral: true });
                if (warnid.length === 24) {
                    const data = await warnings.findById(warnid);
                    if (!data) return interaction.reply({ content: `\`❗️\` There is no warning with that ID.`, ephemeral: true });

                    warnings.findByIdAndDelete(warnid);
                    return interaction.reply({ content: `\`✅\` Deleted warning with ID **${warnid}**` });
                }
            }
                break;

            case 'all': {
                const user = interaction.options.getUser('user');

                const data = await warnings.find({ Guild: interaction.guild.id, User: user.id });
                if(!data) return interaction.reply({ content: `\`❗️\` There is no warnings registered for this person.`, ephemeral: true });
                if(data.length <= 0) return interaction.reply({ content: `\`❗️\` There is no warnings registered for this person.`, ephemeral: true });
                
                const all = data.map((d) => {
                    return {
                        ID: `${d._id}`,
                        Reason: `${d.Reason}`,
                        Moderator: `<@${d.Moderator}>`
                    }
                });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor('Blurple')
                        .setTitle(`All Warnings For ${user.tag}`)
                        .setDescription(all.join('\n\n'))
                    ], ephemeral: true
                });
            }
                break;

            case 'clear': {
                const user = interaction.options.getUser('user');

                const data = await warnings.find({ User: user.id, Guild: interaction.guildId });

                if(data.length <= 0) return interaction.reply({
                    content: `There are no warnings for that user.`
                });

                const length = data.length;

                warnings.deleteMany({ Guild: interaction.guildId, User: user.id }, { new: true });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Warnings Successfully Deleted`)
                        .setDescription(`Successfully deleted ${length} warnings from <@${user.id}>`)
                        .setColor('Gold')
                        .setFooter({ text: `Portal+ Warning System` })
                    ]
                })
            }
                break;
        }
    }
}