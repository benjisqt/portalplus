const { SlashCommandBuilder, ChatInputCommandInteraction, SystemChannelFlagsBitField } = require('discord.js');

module.exports = {
    disabled: false,
    data: new SlashCommandBuilder()
    .setName('impersonate')
    .setDescription('Impersonate a user with a webhook!')
    .addUserOption((opt) =>
        opt.setName('user')
        .setDescription('The user you want to impersonate!')
        .setRequired(true)
    )
    .addStringOption((opt) =>
        opt.setName('message')
        .setDescription('The message you want the user to say')
        .setRequired(true)
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {

        const { options } = interaction;

        const member = options.getMember('user');
        const message = options.getString('message');

        const name = member.nickname || member.user.username;

        await interaction.channel.createWebhook({
            name: name,
            avatar: member.displayAvatarURL({ dynamic: true })
        }).then(webhook => {
            webhook.send({ content: message });
            webhook.delete();
        });

        await interaction.reply({ content: `Member has been impersonated!`, ephemeral: true });
    }
}