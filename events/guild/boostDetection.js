const { Client, GuildMember, ChannelType, EmbedBuilder } = require('discord.js');
const boost = require('../../models/boost');

module.exports = {
    name: 'guildMemberUpdate',

    /**
     * 
     * @param {GuildMember} oldMember
     * @param {GuildMember} newMember
     * @param {Client} client
     */

    async execute(oldMember, newMember, client) {
        const data = await boost.findOne({ Guild: oldMember.guild.id });
        if(!data) return;

        const oldStatus = oldMember.premiumSince;
        const newStatus = newMember.premiumSince;

        const ch = newMember.guild.channels.cache.get(data.Channel);
        if(!ch) return;
        if(ch.type !== ChannelType.GuildText) return;
        if(!ch.permissionsFor(client.user).has('SendMessages')) return;

        const emoji = client.emojis.cache.get('1096219492201279555');

        if(!oldStatus && newStatus) {
            return ch.send({ embeds: [
                new EmbedBuilder()
                .setAuthor({ name: `${newMember.user.tag}`, iconURL: `${newMember.displayAvatarURL({ dynamic: true })}` })
                .setThumbnail(newMember.guild.iconURL({ dynamic: true }))
                .setDescription(`**${newMember.guild.name}** now has **${newMember.guild.premiumSubscriptionCount}** boosts!\n\nThank you for the boost! ${emoji}\nEnjoy the perks! 🫶`)
                .setFooter({ text: `${newMember.user.tag} boosted the server :)`, iconURL: newMember.displayAvatarURL({ dynamic: true }) })
            ] });
        } else return;
    }
}