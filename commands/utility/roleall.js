const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleall')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('Assign a role to all members!')
        .addSubcommand((sub) =>
            sub.setName('add')
            .setDescription('Assign a role to all members!')
            .addRoleOption((opt) =>
                opt.setName('role')
                .setDescription('The role you want to assign!')
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
            sub.setName('remove')
            .setDescription('Remove a role from all members!')
            .addRoleOption((opt) =>
                opt.setName('role')
                .setDescription('The role you want to assign!')
                .setRequired(true)
            )
        ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction, client) {
        const sub = interaction.options.getSubcommand();
        const role = interaction.options.getRole('role');
        const clientroleposition = interaction.guild.members.me.roles.highest.position;
        const emoji = client.emojis.cache.get('1096078204680286329');
        const success = client.emojis.cache.get('1099831412451979284');
        const wrong = client.emojis.cache.get('1102395290700496908');

        switch(sub) {
            case 'add': {
                if (role.position >= interaction.guild.members.me.roles.highest.position) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`\`❗️\` That role's position is higher than my highest role position.\nPlease make the role below my role position, or make my role position above the role.`)
                            .setColor('Red')
                            .setFooter({ text: `Portal+ Role Position Error` })
                    ],
                    content: ``
                });
        
                let membersnotassigned = [];
        
                const members = interaction.guild.members.cache.filter((mem) => mem.roles.highest.position < clientroleposition && !mem.roles.cache.has(role.id));
                const notmembers = interaction.guild.members.cache.filter((mem) => mem.roles.highest.position >= clientroleposition && !mem.roles.cache.has(role.id));
        
                const msg = await interaction.reply({ content: `${emoji} Assigning ${role.name} to everyone in the guild...\nThis may take a while, please be patient.` });
        
                if (notmembers.size <= 0) membersnotassigned === 'None';
                if (notmembers.size > 0) {
                    notmembers.forEach((mem) => {
                        membersnotassigned.push(mem.user.tag)
                    });
                }
        
                if (members.size <= 0) return msg.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`> ${wrong} No Members`)
                            .setDescription(`There are no members to assign this role to.`)
                            .setColor('Red')
                    ]
                });
        
                members.forEach((mem) => {
                    mem.roles.add(role.id);
                });
        
                msg.edit({
                    content: `There may have been some members that did not receive their role:\n${membersnotassigned.join('\n')}`,
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`> ${success} Successfully Assigned Roles`)
                            .setDescription(`**Successfully assigned \`${role.name}\` to all members in the guild.**`)
                            .setColor('Gold')
                    ]
                })
            }
            break;

            case 'remove': {
                if (role.position >= interaction.guild.members.me.roles.highest.position) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`\`❗️\` That role's position is higher than my highest role position.\nPlease make the role below my role position, or make my role position above the role.`)
                            .setColor('Red')
                            .setFooter({ text: `Portal+ Role Position Error` })
                    ],
                    content: ``
                });
        
                let membersnotassigned = [];
        
                const members = interaction.guild.members.cache.filter((mem) => mem.roles.highest.position < clientroleposition && mem.roles.cache.has(role.id));
                const notmembers = interaction.guild.members.cache.filter((mem) => mem.roles.highest.position >= clientroleposition && mem.roles.cache.has(role.id));
        
                const msg = await interaction.reply({ content: `${emoji} Removing ${role.name} from everyone in the guild...\nThis may take a while, please be patient.` });
        
                if (notmembers.size <= 0) membersnotassigned === 'None';
                if (notmembers.size > 0) {
                    notmembers.forEach((mem) => {
                        membersnotassigned.push(mem.user.tag)
                    });
                }
        
                if (members.size <= 0) return msg.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`> ${wrong} No Members`)
                            .setDescription(`There are no members to remove this role from.`)
                            .setColor('Red')
                    ]
                });
        
                members.forEach((mem) => {
                    mem.roles.remove(role.id);
                });
        
                msg.edit({
                    content: `There may have been some members that did not have their role removed:\n${membersnotassigned.join('\n')}`,
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`> ${success} Successfully Removed Roles`)
                            .setDescription(`**Successfully removed \`${role.name}\` from all members in the guild.**`)
                            .setColor('Gold')
                    ]
                })
            }
            break;
        }
    }
}