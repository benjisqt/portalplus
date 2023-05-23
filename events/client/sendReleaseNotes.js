const { Client, EmbedBuilder } = require('discord.js');
const commit = require('git-commit-count');
const git = require('simple-git').default();

module.exports = {
    name: 'ready',

    /**
     * 
     * @param {Client} client
     */

    async execute(client) {
        commit();
        const count = commit('benjisqt/portalplus');
        const cont = count / 10;
        const commitcount = `1.${cont}`
        const check = await git.log({ maxCount: 1 })

        const channel = client.guilds.cache.get('1067969426684649512').channels.cache.get('1104760357370736680').send({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Newest Update (${commitcount}) release notes!`)
                .setDescription(`${check.latest.message}`)
                .setColor('Gold')
                .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
            ]
        })
    }
}