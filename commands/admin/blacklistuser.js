const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js');
const blacklistuser = require('../../models/blacklistuser');
const {
    Reply
} = require('../../util/replies');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklistuser')
        .setDescription('Blacklist a user from using Portal commands!')
        .addSubcommand((sub) =>
            sub.setName('add')
            .setDescription(`Add a user to the blacklist to stop them from using commands`)
            .addUserOption((opt) =>
                opt.setName('user')
                .setDescription('The user you want to blacklist')
                .setRequired(true)
            )
            .addStringOption((opt) =>
                opt.setName('reason')
                .setDescription('The reason for blacklisting the user')
            )
            .addBooleanOption((opt) =>
                opt.setName('silent')
                .setDescription('Whether command feedback should only be sent to you')
            )
        )
        .addSubcommand((sub) =>
            sub.setName('remove')
            .setDescription(`Remove a user from the blacklist so they can use commands`)
            .addUserOption((opt) =>
                opt.setName('user')
                .setDescription('The user you want to remove')
                .setRequired(true)
            )
            .addBooleanOption((opt) =>
                opt.setName('silent')
                .setDescription('Whether command feedback should only be sent to you')
            )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        const member = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'No Reason.';
        const silent = interaction.options.getBoolean('silent') || false;

        const data = await blacklistuser.findOne({
            Guild: interaction.guildId
        });

        const sub = interaction.options.getSubcommand();

        switch(sub) {
            case 'add' : {
                if (data) {
                    if (data.UserIDs.includes(member.id)) return Reply(interaction, 'Red', '🚫', `This user is already blacklisted.`, true);
                    data.UserIDs.push(member.id);
                    data.save();
                    if(silent === true) {
                        return Reply(interaction, `Green`, `✅`, `Successful! ${member} will not be able to use commands unless the blacklist is lifted.`, true);
                    } else {
                        Reply(interaction, `Green`, `✅`, `Successful! ${member} will not be able to use commands unless the blacklist is lifted.`, false);
                        return interaction.channel.send({ embeds: [
                            new EmbedBuilder()
                            .setTitle(`You have been blacklisted!`)
                            .setDescription(`<@${member.id}>, you have been blacklisted.\nYou will not be able to run commands unless your blacklist is lifted.`)
                            .setColor('Red')
                            .addFields(
                                { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                                { name: 'Reason', value: `${reason}`, inline: true }
                            )
                        ], content: `<@${member.id}>` })
                    }
                } else {
                    await new blacklistuser({
                        Guild: interaction.guildId,
                        UserIDs: [
                            member.id
                        ],
                    }).save();
                    if(silent === true) {
                        return Reply(interaction, `Green`, `✅`, `Successful! ${member} will not be able to use commands unless the blacklist is lifted.`, true);
                    } else {
                        Reply(interaction, `Green`, `✅`, `Successful! ${member} will not be able to use commands unless the blacklist is lifted.`, false);
                        return interaction.channel.send({ embeds: [
                            new EmbedBuilder()
                            .setTitle(`You have been blacklisted!`)
                            .setDescription(`<@${member.id}>, you have been blacklisted.\nYou will not be able to run commands unless your blacklist is lifted.`)
                            .setColor('Red')
                            .addFields(
                                { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                                { name: 'Reason', value: `${reason}`, inline: true }
                            )
                        ], content: `<@${member.id}>` })
                    }
                }
            }
            break;

            case 'remove' : {
                if(data) {
                    if(data.UserIDs.length <= 0) return Reply(interaction, 'Red', '🚫', `There are no members blacklisted.`, true);
                    if(!data.UserIDs.includes(member.id)) return Reply(interaction, 'Red', '🚫', `This user is not blacklisted.`, true);

                    const index = data.UserIDs.indexOf(member.id);
                    if(index > -1) {
                        data.UserIDs.splice(index, 1)
                    }
    
                    data.save();
    
                    if(silent === true) {
                        return Reply(interaction, 'Green', '✅', `Successfully removed blacklist from ${member.user.tag}`, true);
                    } else {
                        return Reply(interaction, 'Green', '✅', `Successfully removed blacklist from ${member.user.tag}`, false);
                    }
                } else {
                    return Reply(interaction, 'Red', '🚫', `There are no members blacklisted.`, true);
                }
            }
            break;
        }
    }
}