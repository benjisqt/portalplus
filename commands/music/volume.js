const { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const player = require('../../index');

module.exports = {
    category: 'Music',
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Adjust the volume of the player!')
        .addNumberOption((opt) =>
            opt.setName('volume')
                .setDescription('The volume of the player!')
                .setRequired(true)
                .setMinValue(1)
        ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction, client) {
        const { options, member, guild, channel } = interaction;
        const volume = interaction.options.getNumber('volume');

        const query = options.getString('query');
        const vc = member.voice.channel;

        if (!vc) return interaction.reply({
            content: `\`❗️\` You are not in a voice channel.`
        });

        if (!member.voice.channelId == guild.members.me.voice.channel) {
            return interaction.reply({
                content: `\`❗️\` The music player is already active in <#${guild.members.me.voice.channelId}>`
            });
        }

        const queue = player.getQueue(guild);

        if (!queue) {
            return interaction.reply({
                content: `\`❗️\` There is no queue!`
            });
        }

        if (volume > 100) {
            const reply = await interaction.reply({
                content: `Answer the prompt below to continue.`
            });

            const msg = await interaction.channel.send({
                content: `Are you sure you want to set the volume beyond 100%? It could distort the audio.`
            });

            msg.react('✅');
            msg.react('❌');

            const collector = await msg.createReactionCollector({
                time: 30000,
                filter: (reaction, user) => user.id === interaction.user.id
            });

            collector.on('collect', async (result, user) => {
                if (result.emoji.name === '✅') {
                    queue.setVolume(volume);

                    reply.edit({
                        content: `\`✅\` Changed volume to ${volume}%`
                    });

                    return msg.delete();
                } else if (result.emoji.name === '❌') {
                    reply.edit({
                        content: `Command aborted.`
                    });

                    setTimeout(async () => {
                        await reply.delete();
                        await msg.delete();
                    }, 1000)
                    return;
                };
            })
        } else {
            queue.setVolume(volume);

            return interaction.reply({
                content: `\`✅\` Changed volume to ${volume}%`
            });
        }
    }
}