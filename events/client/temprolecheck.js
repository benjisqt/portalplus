const { Client, ChannelType, EmbedBuilder } = require('discord.js');
const temprole = require('../../models/temprole');
const { Reply } = require('../../util/replies');

module.exports = {
    name: 'ready',
    
    /**
     * 
     * @param {Client} client
     */

    async execute(client) {
        const data = await temprole.find();
        if(!data) return;

        const dt = new Date();

        data.forEach((data) => {
            if(data.Expiry > dt) {
                const guild = client.guilds.cache.get(data.Guild);
                if(!guild) return;
                const role = guild.roles.cache.get(data.Role);
                if(!role) return;
                const user = guild.members.cache.get(data.User);
                if(!user) return;
                user.roles.remove(role.id);
                const ch = guild.channels.cache.filter((ch) => ch.type === ChannelType.GuildText && ch.permissionsFor(client.user).has('SendMessages'));
                if(ch.size <= 0) return;
                ch.first().send({
                    content: `${user.user.tag} has had their role removed.`,
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Temporary Role Removed`)
                        .setDescription(`> The temporary role assigned to ${user.user.tag} has been removed because the expiry has been reached.`)
                        .addFields(
                            { name: 'Moderator', value: `<@${data.Moderator}>`, inline: true },
                            { name: 'Duration', value: `${data.Duration}`, inline: true },
                            { name: 'Role', value: `<@${data.Role}>`, inline: true }
                        )
                        .setColor('Gold')
                        .setFooter({ text: `Portal+ Temporary Role System (PTRS)`, iconURL: client.user.displayAvatarURL({ size: 1024 }) })
                    ]
                })
            } else return;
        })
    }
}