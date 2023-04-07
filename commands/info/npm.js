const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('npm')
    .setDescription('Get info of a NPM repository')
    .addStringOption((opt) =>
        opt.setName('pkg')
        .setDescription('Package name')
        .setRequired(true)
    ),
    
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const repo = interaction.options.getString('pkg');

        const data = await fetch(`https://registry.npmjs.org/${repo}/latest`).then(res => res.json());

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`NPMJS Repository Information - ${data.name}`)
                .setURL(`https://npmjs.com/package/${data.name}`)
                .addFields(
                    {
                        name: `Name`,
                        value: `${data.name}`
                    },
                    {
                        name: 'Newest Version',
                        value: `${data.version}`
                    },
                    {
                        name: 'Description',
                        value: `${data.description}`
                    },
                    {
                        name: 'License',
                        value: `${data.license}`
                    },
                    {
                        name: 'Keywords',
                        value: `${data.keywords.join(', ') || "No keywords listed."}`
                    },
                    {
                        name: 'Homepage',
                        value: `[Click Here](${data.homepage})`
                    },
                    {
                        name: 'ID',
                        value: `${data._id}`
                    },
                )
                .setColor('Random')
            ], ephemeral: true
        })
    }
}