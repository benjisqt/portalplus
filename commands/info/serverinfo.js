const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Get information about the current server')
    .addBooleanOption((opt) =>
        opt.setName('silent')
        .setDescription('Whether command feedback should only be sent to you')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */

    async execute(interaction, client) {
        const emoji = client.emojis.cache.get('1089627778632142960');
        const emoji2 = client.emojis.cache.get('1089627779894628422');
        const silent = interaction.options.getBoolean('silent') || false;

        interaction.guild.fetchOwner();
        let owner;
        let vanityuses;
        const onlinemembers = (await (await interaction.guild.members.fetch())).filter((member) => !member.user.bot && member.presence?.status == 'online').size;
        const idlemembers = (await (await interaction.guild.members.fetch())).filter((member) => !member.user.bot && member.presence?.status == 'idle').size;
        const dndmembers = (await (await interaction.guild.members.fetch())).filter((member) => !member.user.bot && member.presence?.status == 'dnd').size;
        const invisiblemembers = (await (await interaction.guild.members.fetch())).filter((member) => !member.user.bot && member.presence?.status == 'invisible').size;
        const offlinemembers = (await (await interaction.guild.members.fetch())).filter((member) => !member.user.bot && member.presence?.status == 'offline').size;

        const totalonline = onlinemembers + idlemembers + dndmembers + invisiblemembers;
        const totalmembers = interaction.guild.members.cache.filter(m => !m.user.bot).size;
        if(interaction.guild.ownerId) owner = `<@${interaction.guild.ownerId}>`;
        if(!interaction.guild.ownerId) owner = `no-one`
        const origin = `<t:${Math.round(interaction.guild.createdTimestamp / 1000)}:f> (<t:${Math.round(interaction.guild.createdTimestamp / 1000)}:R>)`
        const boostertier = interaction.guild.premiumTier;
        const boosts = interaction.guild.premiumSubscriptionCount;
        const checkvanity = interaction.guild.vanityURLCode || "Vanity not available.";
        if(interaction.guild.vanityURLCode) vanityuses = `${interaction.guild.vanityURLUses} uses`
        if(!interaction.guild.vanityURLCode) vanityuses = "No uses, as vanity is not available.";

        const percentage = totalonline / totalmembers * 100;
        const roundedpercentage = Math.round(percentage)

        if(silent === true) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(interaction.guild.name)
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
                    .setDescription(`This guild is owned by ${owner}`)
                    .addFields(
                        { name: 'Origin', value: `Created on ${origin}` },
                        { name: 'Members', value: `${emoji2} ${totalonline} online out of of ${totalmembers} (${roundedpercentage}%)` },
                        { name: 'Boosters', value: `${emoji} Tier ${boostertier} with ${boosts} boosts` },
                        { name: 'Vanity', value: `${emoji2} ${checkvanity}\n${emoji2} ${vanityuses}` },
                    )
                    .setColor('Random')
                ], ephemeral: true
            })
        } else {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(interaction.guild.name)
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
                    .setDescription(`This guild is owned by ${owner}`)
                    .addFields(
                        { name: 'Origin', value: `Created on ${origin}` },
                        { name: 'Members', value: `${emoji2} ${totalonline} online out of of ${totalmembers} (${roundedpercentage}%)` },
                        { name: 'Boosters', value: `${emoji} Tier ${boostertier} with ${boosts} boosts` },
                        { name: 'Vanity', value: `${emoji2} ${checkvanity}\n${emoji2} ${vanityuses}` },
                    )
                    .setColor('Random')
                ]
            })
        }
    }
}