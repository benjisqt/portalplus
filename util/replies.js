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

module.exports = { Reply, EditReply };