const { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const { ReplyError } = require('../../util/replies');

module.exports = {
    category: 'Fun',
    data: new SlashCommandBuilder()
    .setName('snipe')
    .setDescription('Get back here, deleted message!'),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const successemoji = client.emojis.cache.get('1099831412451979284');
        const msg = await client.snipes.get(interaction.channel.id);
        if(!msg) return await ReplyError(interaction, client, `I can't find any deleted message!`, true);

        const ID = msg.author.id;
        const member = interaction.guild.members.cache.get(ID);
        const URL = member.displayAvatarURL({ dynamic: true, size: 512 });

        const embed = new EmbedBuilder()
        .setColor('Gold')
        .setTitle(`${successemoji} Successfully Captured Deleted Message!`)
        .setDescription(`> Get back here, deleted message!`)
        .addFields(
            { name: 'Content', value: `${msg.content}`, inline: true },
            { name: 'User', value: `${member.user.tag}`, inline: true },
        )
        .setFooter({ text: `Member ID: ${ID}`, iconURL: `${URL}` })

        if(msg.image) embed.setImage(msg.image);
        await interaction.reply({ embeds: [embed] })
    }
}