const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { Wordle } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('wordle')
    .setDescription("Play wordle in Portal+!"),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const game = new Wordle({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: `Portal+ Wordle`,
                color: `Gold`
            },
            customWord: null,
            timeoutTime: 30000,
            winMessage: `You won! The word was **{word}**.`,
            loseMessage: `You lost! Sorry :( The word was **{word}**`,
            playerOnlyMessage: `Only {player} can use these buttons.`
        });

        game.startGame();
        game.on('gameOver', result => {
            return;
        })
    }
}