const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { Hangman } = require('discord-gamecord');

module.exports = {
    category: 'Fun',
    data: new SlashCommandBuilder()
    .setName('hangman')
    .setDescription('Play Hangman within Portal+!'),
    
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const Game = new Hangman({
            message: interaction,
            embed: {
                title: 'Portal+ Hangman',
                color: 'Gold'
            },
            hangman: { hat: "🧢", head: "😳", shirt: "👕", pants: "👖", boots: "👟👟"  },
            timeoutTime: 60000,
            timeWords: "all",
            winMessage: "Congrats, you won! The word was {word}.",
            loseMessage: "Damn, you lost :( The word was {word}.",
            playerOnlyMessage: "Only {player} can use these buttons."
        });
        
        Game.startGame();
        Game.on('gameOver', async result => {
            return;
        })
    }
}