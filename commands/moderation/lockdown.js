const { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    category: 'Moderation',
    data: new SlashCommandBuilder()
    .setName('lockdown')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDescription('Lockdown on/off command!')
    .addSubcommand((sub) =>
        sub.setName('on')
        .setDescription('Enable lockdown command!')
        .addRoleOption((opt) =>
            opt.setName('role')
            .setDescription('The role you want the lockdown to take effect on!')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('off')
        .setDescription('Disable lockdown command!')
        .addRoleOption((opt) =>
            opt.setName('role')
            .setDescription('The role you want the lockdown to take effect on!')
            .setRequired(true)
        )
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const role = interaction.options.getRole('role');

        if(interaction.guild.members.me.roles.highest.position <= role.position) {
            return interaction.reply({ content: `\`❗️\` The role you have selected is higher than my highest role.\nPlease place me above this role to run the command.` });
        }

        switch(sub) {
            case 'on': {
                const channels = interaction.guild.channels.cache.filter((ch) => ch.permissionsFor(interaction.guild.members.me).has('ManageChannels') && ch.type === ChannelType.GuildText);

                channels.forEach((ch) => {
                    ch.permissionOverwrites.create(role.id, { SendMessages: false });
                });

                return interaction.reply({ content: `\`✅\` All channels have been locked.\nNOTICE: Some channels may not have been locked due to me not having permissions in them.` });
            }
            break;

            case 'off': {
                const channels = interaction.guild.channels.cache.filter((ch) => ch.permissionsFor(interaction.guild.members.me).has('ManageChannels') && ch.type === ChannelType.GuildText);

                channels.forEach((ch) => {
                    ch.permissionOverwrites.create(role.id, { SendMessages: true });
                });

                return interaction.reply({ content: `\`✅\` All channels have been unlocked.` });
            }
            break;
        }
    }
}