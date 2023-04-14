const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const caprisun = require('../../models/caprisun');

module.exports = {
    category: 'Fun',
    data: new SlashCommandBuilder()
    .setName('caprisun')
    .setDescription('See what caprisun you are')
    .addSubcommand((sub) =>
        sub.setName('check')
        .setDescription('Check what Capri-Sun someone is (if they rolled)!')
        .addUserOption((opt) =>
            opt.setName('user')
            .setDescription('The user who\'s Capri-Sun you want to check!')
            .setRequired(true)
        )
        .addBooleanOption((opt) =>
            opt.setName('silent')
            .setDescription('Whether command feedback should only be sent to you')
        )
    )
    .addSubcommand((sub) =>
        sub.setName('roll')
        .setDescription('Roll to find out what Capri-Sun you are!')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();

        switch(sub) {
            case 'check' : {
                const user = interaction.options.getUser('user');
                const member = interaction.guild.members.cache.get(user.id);
                const silent = interaction.options.getBoolean('silent') || false;
                if(!member) return interaction.reply({ content: `That user isn't in this server!`, ephemeral: true });

                const valid = await caprisun.findOne({ Guild: interaction.guildId, User: user.id });
                if(!valid) return interaction.reply({ content: `That user hasn't rolled yet! You should convince them! :smirk:`, ephemeral: true });

                let desc;
                let img;
        
                if(valid.Capri === 'Orange') {
                    desc = `An absolute classic. You're the leader of your friend group and get many bitches.`;
                    img = `https://cdn.discordapp.com/attachments/1057077101662052494/1094446402496635051/Capri-Sun-Orange-1.jpg`
                }
                if(valid.Capri === 'Blackcurrant') {
                    desc = `A classic. You have many friends and are very attractive :smirk:`;
                    img = `https://cdn.discordapp.com/attachments/1057077101662052494/1094446478031863858/db797c92fd1629f1a89a98451e0e273a.jpg`;
                }
                if(valid.Capri === 'Tropical') {
                    desc = `The person in a friend group that is liked by some people, but not by most.`;
                    img = `https://cdn.discordapp.com/attachments/1057077101662052494/1094446563675361360/DJ9502.jpg`;
                }
                if(valid.Capri === 'Summer Berries') {
                    desc = `The guy everyone goes to for one specific scenario, but never has any real friends.`;
                    img = `https://cdn.discordapp.com/attachments/1057077101662052494/1094446634542309376/DJ9504.jpg`;
                }
                if(valid.Capri === 'Mango') {
                    desc = `The person who tries to impersonate the popular people to try and become popular as well.`;
                    img = `https://cdn.discordapp.com/attachments/1057077101662052494/1094446913874571304/5449000008367.jpeg`;
                };

                if(silent === true) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`${user.tag}'s Capri-Sun!`)
                            .setDescription(`${user.username} is a ${valid.Capri} Capri-Sun. This means they are:\n${desc}`)
                            .setImage(img)
                            .setColor('Random')
                        ], ephemeral: true
                    });
                } else {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`${user.tag}'s Capri-Sun!`)
                            .setDescription(`${user.username} is a ${valid.Capri} Capri-Sun. This means they are:\n${desc}`)
                            .setImage(img)
                            .setColor('Random')
                        ]
                    });
                }
            }
            break;

            case 'roll': {
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
            break;
        }
    }
}