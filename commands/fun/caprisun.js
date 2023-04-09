const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const caprisun = require('../../models/caprisun');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('caprisun')
    .setDescription('See what caprisun you are'),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const whichone = Math.floor(Math.random() * 5) + 1;
        let capri;
        let desc;
        let img;

        if(whichone === 1) {
            capri = 'Orange';
            desc = `An absolute classic. You're the leader of your friend group and get many bitches.`;
            img = `https://cdn.discordapp.com/attachments/1057077101662052494/1094446402496635051/Capri-Sun-Orange-1.jpg`
        }
        if(whichone === 2) {
            capri = 'Blackcurrant';
            desc = `A classic. You have many friends and are very attractive :smirk:`;
            img = `https://cdn.discordapp.com/attachments/1057077101662052494/1094446478031863858/db797c92fd1629f1a89a98451e0e273a.jpg`;
        }
        if(whichone === 3) {
            capri = 'Tropical';
            desc = `The person in a friend group that is liked by some people, but not by most.`;
            img = `https://cdn.discordapp.com/attachments/1057077101662052494/1094446563675361360/DJ9502.jpg`;
        }
        if(whichone === 4) {
            capri = 'Summer Berries';
            desc = `The guy everyone goes to for one specific scenario, but never has any real friends.`;
            img = `https://cdn.discordapp.com/attachments/1057077101662052494/1094446634542309376/DJ9504.jpg`;
        }
        if(whichone === 5) {
            capri = 'Mango';
            desc = `The person who tries to impersonate the popular people to try and become popular as well.`;
            img = `https://cdn.discordapp.com/attachments/1057077101662052494/1094446913874571304/5449000008367.jpeg`;
        };

        const valid = await caprisun.findOne({ Guild: interaction.guildId, User: interaction.user.id });
        if(valid) return interaction.reply({ embeds: [
            new EmbedBuilder()
            .setTitle(`Hey!`)
            .setDescription(`You can't reroll your capri sun! It's perfectly assigned to you by the gods!`)
            .setColor('Red')
        ], ephemeral: true });

        new caprisun({
            Capri: capri,
            Guild: interaction.guildId,
            User: interaction.user.id
        }).save();

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Caprisun result!`)
                .setImage(img)
                .setDescription(`You are a ${capri} Capri-Sun. This makes you:\n${desc}`)
                .setColor('Random')
            ]
        })
    }
}