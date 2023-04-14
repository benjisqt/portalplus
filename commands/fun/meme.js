const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const fetch = require('reddit-fetch');
const replies = require('../../util/replies');

module.exports = {
    category: 'Fun',
    data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Send a meme from a custom subreddit')
    .addStringOption((opt) =>
        opt.setName('subreddit')
        .setDescription('The subreddit you want to get the memes from')
    )
    .addBooleanOption((opt) =>
        opt.setName('silent')
        .setDescription('Whether command feedback should only be sent to you')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        const subreddits = [
            'memes',
            'dankmemes',
            'boneappletea',
            'comedycemetery',
            'adviceanimals',
            'terriblefacebookmemes'
        ];

        const subreddit = interaction.options.getString('subreddit') || subreddits[Math.floor(Math.random() * subreddits.length)];
        if(subreddit.includes('r/')) return replies.Reply(interaction, 'Red', '🚫', `Incorrect syntax! You cannot use r/, it must be the default name of the community (e.g. memes).`, true);

        fetch({
            subreddit: subreddit,
            allowCrossPost: true,
            allowNSFW: true,
            allowModPost: false,
            allowVideo: false,
            sort: 'hot'
        }).then(async post => {
            const { ups, downs } = post;
            const msg = await interaction.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`${post.title}`)
                    .setImage(post.url)
                    .setColor("Random")
                    .setDescription(`Posted in ${post.subreddit_name_prefixed} by ${post.author}`)
                    .setFooter({ text: `👍 ${ups} 👎 ${downs}` })
                ]
            })

            await msg.react('😂');
            await msg.react('😐');
        }).catch(err => {
            replies.Reply(interaction, 'Red', '🚫', `This subreddit does not exist, or it has no available post data.`, true);
            return console.log(`${interaction.user.tag} requested an invalid subreddit.`);
        })
    }
}