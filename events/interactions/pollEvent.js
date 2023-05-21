const { ButtonInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const poll = require('../../models/poll');

module.exports = {
    name: 'interactionCreate',
    
    /**
     * 
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const emoji = client.emojis.cache.get('1109898459324096533')

        if(interaction.user.bot) return;
        if(!interaction.message) return;
        if(!interaction.guild) return;

        const data = await poll.findOne({ Guild: interaction.guildId, Message: interaction.message.id });
        if(!data) return;
        const msg = await interaction.channel.messages.fetch(data.Message);

        if(interaction.customId === 'up') {
            if(data.UpvoteMembers.includes(interaction.user.id)) return await interaction.reply({ content: `\`🛑\` You have already sent an upvote on this post!`, ephemeral: true });

            let downvotes = data.Downvotes;

            if(data.DownvoteMembers.includes(interaction.user.id)) {
                downvotes = downvotes - 1;
            }

            const newembed = EmbedBuilder.from(msg.embeds[0])
            .setFields(
                { name: `Upvotes`, value: `> **${data.Upvotes + 1}**`, inline: true },
                { name: `Downvotes`, value: `> **${downvotes}**`, inline: true },
                { name: `Author`, value: `> <@${data.Owner}>`, inline: true }
            );

            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('up')
                .setLabel('✅')
                .setStyle(ButtonStyle.Secondary),
    
                new ButtonBuilder()
                .setCustomId('down')
                .setLabel('❌')
                .setStyle(ButtonStyle.Secondary),
    
                new ButtonBuilder()
                .setCustomId('votes')
                .setLabel('Votes')
                .setStyle(ButtonStyle.Secondary)
            )

            await interaction.update({ embeds: [newembed], components: [buttons] });

            data.Upvotes++;

            if(data.DownvoteMembers.includes(interaction.user.id)) {
                data.Downvotes = data.Downvotes - 1;
            }

            data.UpvoteMembers.push(interaction.user.id);
            data.DownvoteMembers.pull(interaction.user.id);
            data.save();
        }

        if(interaction.customId === 'down') {
            if(data.DownvoteMembers.includes(interaction.user.id)) return await interaction.reply({ content: `\`🛑\` You have already sent a downvote on this post!`, ephemeral: true });

            let upvotes = data.Upvotes;

            if(data.UpvoteMembers.includes(interaction.user.id)) {
                upvotes = upvotes - 1;
            }

            const newembed = EmbedBuilder.from(msg.embeds[0])
            .setFields(
                { name: `Upvotes`, value: `> **${upvotes}**`, inline: true },
                { name: `Downvotes`, value: `> **${data.Downvotes + 1}**`, inline: true },
                { name: `Author`, value: `> <@${data.Owner}>`, inline: true }
            );

            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('up')
                .setLabel('✅')
                .setStyle(ButtonStyle.Secondary),
    
                new ButtonBuilder()
                .setCustomId('down')
                .setLabel('❌')
                .setStyle(ButtonStyle.Secondary),
    
                new ButtonBuilder()
                .setCustomId('votes')
                .setLabel('Votes')
                .setStyle(ButtonStyle.Secondary)
            )

            await interaction.update({ embeds: [newembed], components: [buttons] });

            data.Downvotes++;

            if(data.UpvoteMembers.includes(interaction.user.id)) {
                data.Upvotes = data.Upvotes - 1;
            }

            data.DownvoteMembers.push(interaction.user.id);
            data.UpvoteMembers.pull(interaction.user.id);
            data.save();
        }

        if(interaction.customId === 'votes') {
            let upvoters = [];
            await data.UpvoteMembers.forEach(async member => {
                upvoters.push(`<@${member}>`)
            });

            let downvoters = [];
            await data.DownvoteMembers.forEach(async member => {
                downvoters.push(`<@${member}>`)
            });

            const embed = new EmbedBuilder()
            .setColor('Gold')
            .setAuthor({ name: `Poll Information`, iconURL: `${emoji.url}` })
            .setTimestamp()
            .setDescription(`<@${data.Owner}>: ${data.Topic}`)
            .addFields(
                { name: 'Upvoters', value: `> ${upvoters.join(', ').slice(0, 1020) || "No upvoters."}`, inline: true },
                { name: 'Downvoters', value: `> ${downvoters.join(', ').slice(0, 1020) || "No upvoters."}`, inline: true },
                { name: 'Author', value: `> ${interaction.user}`, inline: true }
            )

            await interaction.reply({
                embeds: [embed],
            })
        }
    }
}