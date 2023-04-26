const { Guild, Client, ChannelType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildCreate',

    /**
     * 
     * @param {Guild} guild
     * @param {Client} client
     */

    async execute(guild, client) {
        const channels = guild.channels.cache.filter((c) => c.type === ChannelType.GuildText && c.permissionsFor(client.user).has('SendMessages'));
        if(!channels) return;

        const channel = channels.first();

        const emoji = client.emojis.cache.get('1100895663845294170');

        channel.send({
            embeds: [
                new EmbedBuilder()
                .setDescription(`Hey! ${emoji} Thank you for inviting me to your server! I'm \`Portal+\`, an all-in-one Discord bot designed to make your Discord server better in every way!\n\nTo get started, simply type </help:1096505422019579924> and explore my commands! There's a lot of them...\n\nIf you need any assistance, you can join the support server in my About Me or by running </about:1099427433511387296>!`)
                .setColor('Gold')
                .setThumbnail(client.user.displayAvatarURL({ size: 2048 }))
            ]
        })
    }
}