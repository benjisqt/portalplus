const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const player = require('../../index');

module.exports = {
    category: 'Music',
    data: new SlashCommandBuilder()
    .setName('rewind')
    .setDescription('Go a certain amount of time backwards in a song!')
    .addNumberOption((opt) =>
        opt.setName('seconds')
        .setDescription('The amount of seconds you want to jump backwards!')
        .setRequired(true)
        .setMinValue(1)
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const { options, member, guild, channel } = interaction;

        const option = options.getNumber('seconds');
        const vc = member.voice.channel;

        if(!vc) return interaction.reply({
            content: `\`❗️\` You are not in a voice channel.`
        });

        if(!member.voice.channelId == guild.members.me.voice.channel) {
            return interaction.reply({
                content: `\`❗️\` The music player is already active in <#${guild.members.me.voice.channelId}>`
            });
        }

        const queue = player.getQueue(guild);

        if(!queue) {
            return interaction.reply({
                content: `\`❗️\` There is no queue!`
            });
        }

        if(isNaN(option)) return interaction.reply({ content: `\`❌\` That is not a valid number.` });
        
        queue.seek((queue.currentTime - option));

        return interaction.reply({
            content: `\`⏪\` Rewinded ${option} seconds in the song!`
        });
    }
}