const { SlashCommandBuilder, ChatInputCommandInteraction, Client, AttachmentBuilder, EmbedBuilder } = require('discord.js')
const canvacord = require('canvacord');
const { ReplyError } = require('../../util/replies');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('spotify')
    .setDescription('See a user\'s Spotify status!')
    .addUserOption((opt) =>
        opt.setName('user')
        .setDescription('The user you want to see the Spotify status of')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const user = interaction.options.getMember('user') || interaction.member;

        if(user.bot) return ReplyError(interaction, client, `You cannot get the Spotify status of a bot.`, true);

        let status;
        if (user.presence.activities.length === 1) status = user.presence.activities[0];
        else if (user.presence.activities.length > 1) status = user.presence.activities[1];

        if(user.presence.activities.length === 0 || status.name !== "Spotify" && status.type !== 'LISTENING') {
            return await ReplyError(interaction, client, `That user is not listening to Spotify.`, true)
        };

        if(status !== null && status.name === "Spotify" && status.assets !== null) {
            let image = `https://i.scdn.co/image/${status.assets.largeImage.slice(8)}`,
            name = status.details,
            artist = status.state,
            album = status.assets.largeText;
            
            const card = new canvacord.Spotify()
            .setAuthor(artist)
            .setAlbum(album)
            .setStartTimestamp(status.timestamps.start)
            .setEndTimestamp(status.timestamps.end)
            .setImage(image)
            .setTitle(name)

            const Card = await card.build();
            const attachments = new AttachmentBuilder(Card, { name: 'spotify.png' });

            const embed = new EmbedBuilder()
            .setTitle(`${user.user.username}'s Spotify Track`)
            .setImage(`attachment://spotify.png`)
            .setTimestamp()
            .setFooter({ text: `Portal+ Spotify Status` })
            .setColor('Gold')

            await interaction.reply({ embeds: [embed], files: [attachments] })
        }
    }
}