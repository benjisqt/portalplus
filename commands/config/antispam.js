const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const antispam = require('../../models/antispam');

module.exports = {
    category: 'Config',
    data: new SlashCommandBuilder()
    .setName('antispam')
    .setDescription('Portal+ Antispam System!')
    .addSubcommand((sub) =>
        sub.setName('on')
        .setDescription('Enable the antispam system!')
    )
    .addSubcommand((sub) =>
        sub.setName('off')
        .setDescription('Disable the antispam system!')
    )
    .addSubcommand((sub) =>
        sub.setName('addexception')
        .setDescription('Add a user that will be exempt from the antispam system!')
        .addUserOption((opt) =>
            opt.setName('user')
            .setDescription('The user you want to exempt!')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('removeexception')
        .setDescription('Remove a user from being exempt from the antispam!')
        .addUserOption((opt) =>
            opt.setName('user')
            .setDescription('The user you want to remove!')
            .setRequired(true)
        )
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();

        const data = await antispam.findOne({ Guild: interaction.guildId });

        switch(sub) {
            case 'on': {
                if(data) return interaction.reply({
                    content: `\`❗️\` The antispam system is already enabled!`
                });

                await antispam.create({
                    Guild: interaction.guildId,
                    Exceptions: []
                });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Antispam System`)
                        .setDescription(`> The antispam system has been enabled. ✅`)
                        .setThumbnail(interaction.guild.members.me.displayAvatarURL({ size: 1024 }))
                        .setFooter({ text: `Portal+ Antispam System` })
                    ]
                })
            }
            break;

            case 'off': {
                if(!data) return interaction.reply({
                    content: `\`❗️\` The antispam system is already off.`
                });

                await antispam.deleteMany({ Guild: interaction.guildId }, { new: true });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Antispam System`)
                        .setDescription(`> The antispam system has been disabled. ✅`)
                        .setThumbnail(interaction.guild.members.me.displayAvatarURL({ size: 1024 }))
                        .setFooter({ text: `Portal+ Antispam System` })
                    ]
                })
            }
            break;

            case 'addexception': {
                const user = interaction.options.getUser('user');
                if(!user.id) return interaction.reply({ content: `\`❗️\` That user is not in this guild.` });
                const member = interaction.guild.members.cache.get(user.id);
                if(!member) return interaction.reply({ content: `\`❗️\` That user is not in this guild.` });

                if(!data) return interaction.reply({ content: `\`❗️\` The antispam is not enabled.` });

                data.Exceptions.push(member.id);
                data.save();

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Antispam System`)
                        .setDescription(`> The antispam system has been edited. ✅\nMember added to exception:\n${member.user.tag}`)
                        .setThumbnail(interaction.guild.members.me.displayAvatarURL({ size: 1024 }))
                        .setFooter({ text: `Portal+ Antispam System` })
                    ]
                })
            }
            break;

            case 'removeexception': {
                const user = interaction.options.getUser('user');
                if(!user.id) return interaction.reply({ content: `\`❗️\` That user is not in this guild.` });
                const member = interaction.guild.members.cache.get(user.id);
                if(!member) return interaction.reply({ content: `\`❗️\` That user is not in this guild.` });

                if(!data) return interaction.reply({ content: `\`❗️\` The antispam is not enabled.` });

                if(!data.Exceptions.includes(member.id)) return interaction.reply({ content: `\`❗️\` That user is not in the exceptions list.` });

                const index = data.Exceptions.indexOf(member.id);

                data.Exceptions.splice(index, 1);
                data.save();

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Antispam System`)
                        .setDescription(`> The antispam system has been edited. ✅\nMember removed from exception:\n${member.user.tag}`)
                        .setThumbnail(interaction.guild.members.me.displayAvatarURL({ size: 1024 }))
                        .setFooter({ text: `Portal+ Antispam System` })
                    ]
                });
            }
            break;
        }
    }
}