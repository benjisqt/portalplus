const { SlashCommandBuilder, ChatInputCommandInteraction, AttachmentBuilder } = require('discord.js');
const xp = require('../../models/xp');
const { Reply } = require('../../util/replies');
const canvacord = require('canvacord');
const calculateLevelXP = require('../../util/calculateLevelXP');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Shows a users level')
    .addUserOption((opt) =>
        opt.setName('user')
        .setDescription('The user whose level you want to see')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        const data = await xp.findOne({ User: user.id, Guild: interaction.guildId });
        if(!data) return Reply(interaction, 'Red', '🛑', `That user doesn't seem to have any levels, you should encourage them to type!`, true);

        let server = await xp.find({ Guild: interaction.guildId }).select('-_id User Level XP');

        server.sort((a, b) => {
            if(a.Level === b.Level) {
                return b.XP - a.XP;
            } else {
                return b.Level - a.Level;
            }
        });

        let currentRank = server.findIndex((lvl) => lvl.User === user.id);

        const rank = new canvacord.Rank()
        .setAvatar(user.displayAvatarURL({ dynamic: true }))
        .setRank(currentRank)
        .setLevel(data.Level)
        .setCurrentXP(data.XP)
        .setRequiredXP(calculateLevelXP(data.Level))
        .setProgressBar(['#FFB6C1', '#FFD580'], 'GRADIENT', true)
        .setUsername(user.username)
        .setDiscriminator(user.discriminator)

        const rankthing = await rank.build();
        const attachment = new AttachmentBuilder(rankthing);

        return interaction.reply({
            files: [attachment]
        });
    }
}