const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const player = require('../../index');

module.exports = {
    category: 'Music',
    data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Loop the song or queue!')
    .addStringOption((opt) =>
        opt.setName('options')
        .setDescription('Loop options!')
        .addChoices(
            { name: 'Loop the queue', value: 'queue' },
            { name: 'Loop the song', value: 'song' },
            { name: 'Turn off loop', value: 'off' }
        )
        .setRequired(true)
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const { options, member, guild, channel } = interaction;

        const option = options.getString('options');
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

        let mode;

        switch(option) {
            case 'off':
                mode = 0;
                break;
            case 'song':
                mode = 1;
                break;
            case 'queue':
                mode = 2;
                break;
        }

        mode = queue.setRepeatMode(mode);
        mode = mode ? (mode === 2 ? 'Repeat Queue' : 'Repeat Song') : 'Off';
        return interaction.reply({
            content: `\`🔁\` Set loop mode to \`${mode}\``
        });
    }
}