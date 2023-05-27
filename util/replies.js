const { EmbedBuilder } = require('discord.js');

async function Reply(interaction, color, emoji, description, ephemeral) {
    return interaction.reply({
        embeds: [
            new EmbedBuilder()
            .setColor(color)
            .setDescription(`${emoji} | ${description}`)
        ], ephemeral: ephemeral
    })
}
async function EditReply(interaction, content, color, emoji, description, ephemeral) {
    return interaction.editReply({
        content: `${content}`,
        embeds: [
            new EmbedBuilder()
            .setColor(color)
            .setDescription(`${emoji} | ${description}`)
        ], ephemeral: ephemeral
    })
}

/**
 * 
 * @param {*} interaction 
 * @param {*} client 
 * @param {String} description 
 * @param {Boolean} ephemeral 
 */

async function ReplyError(interaction, client, description, ephemeral) {
    const emoji = client.emojis.cache.get('1102395290700496908');

    return interaction.reply({
        embeds: [
            new EmbedBuilder()
            .setTitle(`${emoji} Portal+ Has Encountered An Error.`)
            .setDescription(`> ${description}`)
            .setColor('Red')
            .setFooter({ text: `Portal+` })
            .setTimestamp()
        ],
        ephemeral: ephemeral
    })
}

module.exports = { Reply, EditReply, ReplyError };