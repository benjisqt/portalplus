const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client
} = require('discord.js');
const blacklistcmd = require('../../models/blacklistcmd');
const { Reply } = require('../../util/replies');

module.exports = {
    category: 'Admin',
    data: new SlashCommandBuilder()
        .setName('blacklistcmd')
        .setDescription('Blacklist a command')
        .addSubcommand((sub) =>
            sub.setName('add')
            .setDescription('Add a command to be blacklisted')
            .addStringOption((opt) =>
                opt.setName('cmd')
                .setDescription('Provide the name of the command (/blacklistcmd add meme)')
                .setRequired(true)
            )
            .addBooleanOption((opt) =>
                opt.setName('silent')
                .setDescription('Whether command feedback should only be sent to you')
            )
        )
        .addSubcommand((sub) =>
            sub.setName('remove')
            .setDescription('Remove a command from the blacklist')
            .addStringOption((opt) =>
                opt.setName('cmd')
                .setDescription('Provide the name of the command (/blacklistcmd remove meme)')
                .setRequired(true)
            )
            .addBooleanOption((opt) =>
                opt.setName('silent')
                .setDescription('Whether command feedback should only be sent to you')
            )
        ),
    
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const sub = interaction.options.getSubcommand();
        const cmd = interaction.options.getString('cmd');
        const silent = interaction.options.getBoolean('silent') || false;

        const data = await blacklistcmd.findOne({ Guild: interaction.guildId });

        const command = client.commands.get(cmd);

        const notallowed = [
            'blacklistcmd',
            'moderation'
        ]

        if(notallowed.includes(cmd)) return Reply(interaction, 'Red', '🚫', 'You cannot blacklist the command you selected, as it is a Core command.', true);

        if(!command) return Reply(interaction, 'Red', '🚫', `This command is outdated or is not in the bot.`, true);

        switch(sub) {
            case 'add' : {
                if(data) {
                    if(data.Commands.includes(cmd)) return Reply(interaction, 'Red', '🚫', `This command is already blacklisted!`, true);
                    data.Commands.push(cmd);
                    data.save();
                    if(silent === true) {
                        return Reply(interaction, 'Green', `✅`, `${cmd} will no longer be able to be used unless an admin removes the whitelist.`, true)
                    } else {
                        return Reply(interaction, 'Green', `✅`, `${cmd} will no longer be able to be used unless an admin removes the whitelist.`, false)
                    }
                } else {
                    await new blacklistcmd({
                        Guild: interaction.guildId,
                        Commands: [
                            cmd
                        ]
                    }).save();

                    if(silent === true) {
                        return Reply(interaction, 'Green', `✅`, `${cmd} will no longer be able to be used unless an admin removes the whitelist.`, true)
                    } else {
                        return Reply(interaction, 'Green', `✅`, `${cmd} will no longer be able to be used unless an admin removes the whitelist.`, false)
                    }
                }
            }
            break;

            case 'remove' : {
                if(!data) return Reply(interaction, 'Red', '🚫', `There are no commands blacklisted.`, true);

                if(!data.Commands.includes(cmd)) return Reply(interaction, 'Red', '🚫', `That command is not blacklisted.`, true);

                const index = data.Commands.indexOf(cmd);
                if(index > -1) {
                    data.Commands.splice(index, 1)
                }

                data.save();

                if(silent === true) {
                    return Reply(interaction, 'Green', `✅`, `${cmd} is now able to be used!`, true)
                } else {
                    return Reply(interaction, 'Green', `✅`, `${cmd} is now able to be used!`, false)
                }
            }
            break;
        }
    }
}