const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const temprole = require('../../models/temprole');
const vip = require('../../models/vip');
const { Reply } = require('../../util/replies');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('temprole')
    .setDescription('Assign/remove temporary roles to/from someone!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand((sub) =>
        sub.setName('add')
        .setDescription('Add a temporary role to someone!')
        .addUserOption((opt) =>
            opt.setName('user')
            .setDescription('The user you want to assign the temporary role to!')
            .setRequired(true)
        )
        .addRoleOption((opt) =>
            opt.setName('role')
            .setDescription('The role you want to be assigned to the user!')
            .setRequired(true)
        )
        .addStringOption((opt) =>
            opt.setName('duration')
            .setDescription('The duration you want the user to have this temporary role for! (e.g. 2m, 2h, 2d)')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('remove')
        .setDescription('Remove a temporary role from someone!')
        .addUserOption((opt) =>
            opt.setName('user')
            .setDescription('The user you want the role to be removed from!')
            .setRequired(true)
        ).addRoleOption((opt) =>
            opt.setName('role')
            .setDescription('The role you want to be removed')
            .setRequired(true)
        )
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    
    async execute(interaction) {
        const user = interaction.options.getMember('user') || null;
        const role = interaction.options.getRole('role') || null;
        const duration = interaction.options.getString('duration') || null;
        const subcommand = interaction.options.getSubcommand();

        switch(subcommand) {
            case 'add': {
                const vipdata = await vip.findOne({ Guild: interaction.guildId });
                const data = await temprole.find({ Guild: interaction.guildId });

                if(!vipdata && data.length >= 2) return Reply(interaction, 'Red', '🛑', `You can only assign 2 temporary roles at a time. With Portal+ VIP, you get unlimited!`, false);

                if(role.position >= interaction.guild.members.me.roles.highest.position) return Reply(interaction, 'Red', '🛑', `That role is equal to or higher than my highest role. Please position me above this role so I can assign it to people.`, true);
                if(role.position >= interaction.member.roles.highest.position) return Reply(interaction, 'Red', '🛑', `You cannot assign roles that are higher than or equal to your role position.`);

                const msduration = ms(duration);
                if(!msduration || isNaN(msduration)) return Reply(interaction, 'Red', '🛑', `That is not a valid time string. Please provide a valid one like "2 days".`, true);

                const rolecheck = await temprole.findOne({ Guild: interaction.guildId, Role: role.id, User: user.id });
                if(rolecheck) return Reply(interaction, 'Red', '🛑', `That user has already been assigned that temporary role!`, true);
                if(user.roles.cache.has(role.id)) return Reply(interaction, 'Red', '🛑', `That user has already been assigned that role manually.`, true);

                const date = new Date();

                const expiry = date.getTime() + msduration;

                const expirydate = new Date(expiry);

                await temprole.create({
                    Guild: interaction.guildId,
                    Expiry: expirydate,
                    Role: role.id,
                    User: user.id,
                    Moderator: interaction.user.id,
                    Duration: duration,
                });

                user.roles.add(role.id);
                Reply(interaction, 'Green', '✅', `I successfully added the ${role} role to ${user}.\nTheir role will expire in ${duration}.`, false);

                setTimeout(() => {
                    user.roles.remove(role.id);
                    interaction.channel.send({
                        content: `${user.user.tag} has had their role removed.`,
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`Temporary Role Removed`)
                            .setDescription(`> The temporary role assigned to ${user.user.tag} has been removed because the expiry has been reached.`)
                            .addFields(
                                { name: 'Moderator', value: `<@${interaction.member.id}>`, inline: true },
                                { name: 'Duration', value: `${duration}`, inline: true },
                                { name: 'Role', value: `<@${role.id}>`, inline: true }
                            )
                            .setColor('Gold')
                            .setFooter({ text: `Portal+ Temporary Role System (PTRS)`, iconURL: client.user.displayAvatarURL({ size: 1024 }) })
                        ]
                    })
                }, msduration)
            }
            break;

            case 'remove': {
                const vipdata = await vip.findOne({ Guild: interaction.guildId });
                const data = await temprole.findOne({ Guild: interaction.guildId, User: user.id, Role: role.id });
                if(!data) return Reply(interaction, 'Red', '🛑', `That role has been manually assigned, it cannot be removed with this command.`);

                if(role.position >= interaction.guild.members.me.roles.highest.position) return Reply(interaction, 'Red', '🛑', `That role is equal to or higher than my highest role. Please position me above this role so I can remove it from people.`, true);
                if(role.position >= interaction.member.roles.highest.position) return Reply(interaction, 'Red', '🛑', `You cannot take away roles that are higher than or equal to your role position.`);

                await data.deleteOne({ Guild: interaction.guildId, User: user.id, Role: role.id }, { new: true });

                data.save();

                user.roles.remove(role.id);
                return Reply(interaction, 'Green', '✅', `I successfully removed the ${role} role from ${user}.`, false);
            }
            break;
        }
    }
}