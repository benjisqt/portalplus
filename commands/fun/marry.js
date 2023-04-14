const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const marry = require('../../models/marry');
const { Reply } = require('../../util/replies');

module.exports = {
    category: 'Fun',
    data: new SlashCommandBuilder()
    .setName('marry')
    .setDescription('Marry someone on the server!')
    .addUserOption((opt) =>
        opt.setName('user')
        .setDescription('The user you want to marry!')
        .setRequired(true)
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        if(user.bot) return Reply(interaction, 'Red', '❗️', 'You can\'t marry a bot!', true);
        if(!interaction.guild.members.cache.get(user.id)) return Reply(interaction, 'Red', '❗️', 'This user is not in this server!', true);
        if(user.id === interaction.user.id) return Reply(interaction, 'Red', '❗️', 'You can\'t marry yourself!', true);

        const married = await marry.findOne({ Users: { $all: [interaction.user.id] }});
        if(married) return Reply(interaction, 'Red', '❗️', 'Why are you trying to marry someone else?! You unfaithful swine!', false);

        interaction.reply({ content: `Proposal sent! Good luck!`, ephemeral: true });

        interaction.channel.send({
            content: `<@${user.id}>, ${interaction.user.username} would like to marry you! 💍\nDo you want to? (type yes/no)`
        });

        const filter = m => m.author.id === user.id;

        const collector = interaction.channel.createMessageCollector({ filter: filter, time: 15000 });

        const date = new Date();

        collector.once('collect', async (m) => {
            if(m.content.includes('yes')) {
                await new marry({
                    Guild: interaction.guildId,
                    Users: [ interaction.user.id, user.id ],
                    MarryDate: date,
                }).save();

                return interaction.channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`You may kiss the bride/groom!`)
                        .setDescription(`${interaction.user.username} and ${user.username} are now married!\nEveryone give them a round of applause!`)
                        .setColor('Random')
                    ]
                });
            }

            if(m.content.includes('Yes')) {
                await new marry({
                    Guild: interaction.guildId,
                    Users: [ interaction.user.id, user.id ],
                    MarryDate: date,
                }).save();

                return interaction.channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`You may kiss the bride/groom!`)
                        .setDescription(`${interaction.user.username} and ${user.username} are now married!\nEveryone give them a round of applause!`)
                        .setColor('Random')
                    ]
                });
            }

            if(m.content.includes('no')) {
                return interaction.channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`No!`)
                        .setDescription(`${interaction.user.username}, ${user} said no! :( better luck next time!`)
                        .setColor('Red')
                    ]
                });
            }

            if(m.content.includes('No')) {
                await new marry({
                    Guild: interaction.guildId,
                    Users: [ interaction.user.id, user.id ],
                    MarryDate: date,
                }).save();

                return interaction.channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`You may kiss the bride/groom!`)
                        .setDescription(`${interaction.user.username} and ${user.username} are now married!\nEveryone give them a round of applause!`)
                        .setColor('Random')
                    ]
                });
            }
        })
    }
}