const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const warnings = require('../../models/warnings');

module.exports = {
    category: 'Moderation',
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
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
            sub.setName('list')
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

                const msg = await interaction.reply({
                    content: `\`✅\` Issued warning to ${user}.`,
                    ephemeral: true
                });

                if(!interaction.channel.permissionsFor(interaction.guild.members.me).has('SendMessages')) return msg.edit({ content: `\`✅\` Issued warning to ${user}.\n\`❗️\` Warning: I do not have permissions to speak in this channel.` });

                return interaction.channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Warning Issued`)
                        .setDescription(`A warning has been issued to <@${user.id}>.`)
                        .addFields(
                            {
                                name: 'User',
                                value: `<@${user.id}>`,
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
                        .setFooter({ text: `Portal+ Warning System` })
                    ],
                    content: `<@${user.id}>`
                })
            }
                break;

            case 'remove': {
                const warnid = interaction.options.getString('warnid');

                if (warnid.length > 24) return interaction.reply({ content: `\`❗️\` The ID you provided is not 24 characters in length.`, ephemeral: true });
                if (warnid.length < 24) return interaction.reply({ content: `\`❗️\` The ID you provided is not 24 characters in length.`, ephemeral: true });
                if (warnid.length === 24) {
                    const data = await warnings.findById(warnid);
                    if (!data) return interaction.reply({ content: `\`❗️\` There is no warning with that ID.`, ephemeral: true });

                    data.deleteOne({ _id: warnid });
                    return interaction.reply({ content: `\`✅\` Deleted warning with ID **${warnid}**`, ephemeral: true });
                }
            }
                break;

            case 'list': {
                const user = interaction.options.getUser('user');

                const data = await warnings.find({ Guild: interaction.guild.id, User: user.id });
                if(!data) return interaction.reply({ content: `\`❗️\` There is no warnings registered for this person.`, ephemeral: true });
                if(data.length <= 0) return interaction.reply({ content: `\`❗️\` There is no warnings registered for this person.`, ephemeral: true });
                
                const all = data.map((d) => {
                    return [
                        `ID: ${d._id}`,
                        `Reason: ${d.Reason}`,
                        `Moderator: <@${d.Moderator}>`
                    ].join('\n')
                }).join('\n\n');

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor('Blurple')
                        .setTitle(`All Warnings For ${user.tag}`)
                        .setDescription(all.toString())
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

                data.forEach((d) => {
                    d.deleteOne({ Guild: d.Guild, User: d.User });
                });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Warnings Successfully Deleted`)
                        .setDescription(`Successfully deleted ${length} warnings from <@${user.id}>`)
                        .setColor('Gold')
                        .setFooter({ text: `Portal+ Warning System` })
                    ], ephemeral: true
                })
            }
                break;
        }
    }
}