const { SlashCommandBuilder, ChatInputCommandInteraction, ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const { Reply } = require('../../util/replies');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play rock paper scissors against an AI or a member!')
    .addStringOption((opt) =>
        opt.setName('choice')
        .setDescription('Your choice!')
        .addChoices(
            { name: 'Rock', value: 'rock' },
            { name: 'Paper', value: 'paper' },
            { name: 'Scissors', value: 'scissors' }
        )
        .setRequired(true)
    )
    .addUserOption((opt) =>
        opt.setName('user')
        .setDescription('The user you want to play with!')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const { guild, channel, options } = interaction;

        const choice = options.getString('choice');
        const user = options.getUser('user');

        if(user) {
            const reply = await interaction.reply({ content: `Waiting for reply...` });
            const button1 = new ButtonBuilder()
            .setCustomId('rock')
            .setDisabled(false)
            .setLabel('Rock')
            .setStyle(ButtonStyle.Primary)

            const button2 = new ButtonBuilder()
            .setCustomId('paper')
            .setDisabled(false)
            .setLabel('Paper')
            .setStyle(ButtonStyle.Primary)

            const button3 = new ButtonBuilder()
            .setCustomId('scissors')
            .setDisabled(false)
            .setLabel('Scissors')
            .setStyle(ButtonStyle.Primary)

            const row = new ActionRowBuilder()
            .addComponents(button1, button2, button3)

            const msg = await interaction.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Rock Paper Scissors! ✂️`)
                    .setDescription(`You have been challenged to a round of Rock, Paper, Scissors!!!\nSelect a button below to make your decision!`)
                    .setColor('Gold')
                ], components: [row],
                content: `<@${user.id}>`
            });

            const filter = i => i.user.id === user.id;

            const userchoice = await msg.awaitMessageComponent({ filter: filter, time: 60000 });

            if(userchoice.customId === choice) {
                return msg.edit({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`You Tied!`)
                        .setDescription(`<@${interaction.user.id}> selected \`${choice}\`, <@${user.id}> chose \`${userchoice.customId}\`. You tied!`)
                        .setColor('Green')
                    ],
                    components: [],
                    content: ''
                })
            }

            if(userchoice.customId === 'paper' && choice === 'scissors') {
                return msg.edit({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`<@${interaction.user.id}> Won!`)
                        .setDescription(`<@${interaction.user.id}> selected \`${choice}\`, <@${user.id}> chose \`${userchoice.customId}\`. You won!`)
                        .setColor('Green')
                    ],
                    components: [],
                    content: ''
                })
            }
            if(userchoice.customId === 'paper' && choice === 'rock') {
                return msg.edit({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`<@${user.id}> Won!`)
                        .setDescription(`<@${interaction.user.id}> selected \`${choice}\`, <@${user.id}> chose \`${userchoice.customId}\`. They won!`)
                        .setColor('Green')
                    ],
                    components: [],
                    content: ''
                })
            }

            if(userchoice.customId === 'scissors' && choice === 'rock') {
                return msg.edit({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`<@${interaction.user.id}> Won!`)
                        .setDescription(`<@${interaction.user.id}> selected \`${choice}\`, <@${user.id}> chose \`${userchoice.customId}\`. You won!`)
                        .setColor('Green')
                    ],
                    components: [],
                    content: ''
                })
            }
            if(userchoice.customId === 'scissors' && choice === 'paper') {
                return msg.edit({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`<@${user.id}> Won!`)
                        .setDescription(`<@${interaction.user.id}> selected \`${choice}\`, <@${user.id}> chose \`${userchoice.customId}\`. They won!`)
                        .setColor('Green')
                    ],
                    components: [],
                    content: ''
                })
            }

            if(userchoice.customId === 'rock' && choice === 'scissors') {
                return msg.edit({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`<@${interaction.user.id}> Won!`)
                        .setDescription(`<@${interaction.user.id}> selected \`${choice}\`, <@${user.id}> chose \`${userchoice.customId}\`. You won!`)
                        .setColor('Green')
                    ],
                    components: [],
                    content: ''
                })
            }
            if(userchoice.customId === 'rock' && choice === 'paper') {
                return msg.edit({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`<@${user.id}> Won!`)
                        .setDescription(`<@${interaction.user.id}> selected \`${choice}\`, <@${user.id}> chose \`${userchoice.customId}\`. They won!`)
                        .setColor('Green')
                    ],
                    components: [],
                    content: ''
                })
            }
        } else {
            const choices = [
                'rock',
                'paper',
                'scissors'
            ];

            const botchoice = choices[Math.floor(Math.random() * choices.length)];

            if(botchoice === choice) return Reply(interaction, 'Gold', '🪨📄✂️', `You chose \`${choice}\`, I chose \`${botchoice}\`. We tied!`);

            if(botchoice === 'paper' && choice === 'scissors') return Reply(interaction, 'Gold', '🪨📄✂️', `You chose \`${choice}\`, I chose \`${botchoice}\`. You won!`);
            if(botchoice === 'paper' && choice === 'rock') return Reply(interaction, 'Gold', '🪨📄✂️', `You chose \`${choice}\`, I chose \`${botchoice}\`. I won!`);

            if(botchoice === 'scissors' && choice === 'rock') return Reply(interaction, 'Gold', '🪨📄✂️', `You chose \`${choice}\`, I chose \`${botchoice}\`. You won!`);
            if(botchoice === 'scissors' && choice === 'paper') return Reply(interaction, 'Gold', '🪨📄✂️', `You chose \`${choice}\`, I chose \`${botchoice}\`. I won!`);

            if(botchoice === 'rock' && choice === 'scissors') return Reply(interaction, 'Gold', '🪨📄✂️', `You chose \`${choice}\`, I chose \`${botchoice}\`. You won!`);
            if(botchoice === 'rock' && choice === 'paper') return Reply(interaction, 'Gold', '🪨📄✂️', `You chose \`${choice}\`, I chose \`${botchoice}\`. You won!`);
        }
    }
}