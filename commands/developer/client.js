const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, ActivityType, Status, Client } = require('discord.js');
const token = require('../../config.json').token;

module.exports = {
    owner: true,
    category: 'Developer',
    data: new SlashCommandBuilder()
        .setName('client')
        .setDescription('Developer settings for the bot!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((sub) =>
            sub.setName('set-username')
                .setDescription('Set a new username for the bot!')
                .addStringOption((opt) =>
                    opt.setName('username')
                        .setDescription('The client\'s new username!')
                        .setRequired(true)
                )
                .addBooleanOption((opt) =>
                    opt.setName('silent')
                        .setDescription('Whether command feedback should only be sent to you')
                )
        )
        .addSubcommand((sub) =>
            sub.setName('set-presence')
                .setDescription('Set the presence of the bot!')
                .addStringOption((opt) =>
                    opt.setName('name')
                        .setDescription('The name of the activity')
                        .setRequired(true)
                )
                .addStringOption((opt) =>
                    opt.setName('type')
                        .setDescription('The type of activity')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Playing', value: '0' },
                            { name: 'Streaming', value: '1' },
                            { name: 'Listening', value: '2' },
                            { name: 'Watching', value: '3' },
                            { name: 'Competing', value: '5' },
                        )
                )
                .addStringOption((opt) =>
                    opt.setName('status')
                        .setDescription('The client\'s new status')
                        .addChoices(
                            { name: 'Online', value: 'online' },
                            { name: 'Do Not Disturb', value: 'dnd' },
                            { name: 'Idle', value: 'idle' },
                            { name: 'Invisible', value: 'invisible' },
                        )
                )
                .addBooleanOption((opt) =>
                    opt.setName('silent')
                        .setDescription('Whether command feedback should only be sent to you')
                )
        )
        .addSubcommand((sub) =>
            sub.setName('destroy')
                .setDescription('Destroy the client and re-login again.')
                .addBooleanOption((opt) =>
                    opt.setName('silent')
                        .setDescription('Whether command feedback should only be sent to you')
                )
        )
        .addSubcommand((sub) =>
            sub.setName('kill')
                .setDescription('Kill the entire bot process (Not recommended!)')
                .addBooleanOption((opt) =>
                    opt.setName('silent')
                        .setDescription('Whether command feedback should only be sent to you')
                )
        ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const sub = interaction.options.getSubcommand();

        const emoji = client.emojis.cache.get('1096078204680286329');
        
        const silent = interaction.options.getBoolean('silent') || false;

        if(silent === true) {
            await interaction.reply({
                content: `${emoji} Please wait...`,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: `${emoji} Please wait...`
            });
        }

        switch(sub) {
            case 'set-username': {
                const username = interaction.options.getString('username');

                try {
                    await client.user.setUsername(username);

                    return interaction.editReply({
                        content: `\`✅\` Client's username has been changed to **${username}**.`,
                    });
                } catch (err) {
                    return interaction.editReply({
                        content: `\`❗️\` An error was found:\n${err}`
                    });
                }
            }
            break;

            case 'set-presence': {
                const name = interaction.options.getString('name');
                const type = interaction.options.getString('type');
                const status = interaction.options.getString('status') || 'online';

                try {
                    await client.user.setPresence({ activities: [{ name: name, type: parseInt(type) }], status: status });

                    return interaction.editReply({
                        content: `\`✅\` Client's presence has been changed.`
                    });
                } catch (err) {
                    return interaction.editReply({
                        content: `\`❗️\` An error has occured:\n${err}`
                    });
                }
            }
            break;

            case 'destroy': {
                try {
                    await interaction.editReply({
                        content: `${emoji} Destroying the client and re-logging...`
                    });
    
                    await client.destroy();
    
                    await client.login(token);
    
                    await client.user.setPresence({ activities: [{ name: `${client.guilds.cache.size} guilds`, type: ActivityType.Watching }], status: 'online' });
    
                    return interaction.editReply({
                        content: `\`✅\` Re-logged in as ${client.user.tag}`
                    });    
                } catch (err) {
                    return interaction.editReply({
                        content: `\`❗️\` An error has occured:\n${err}`
                    });
                }
            }
            break;

            case 'kill': {
                try {
                    await interaction.editReply({
                        content: `\`👋\` Shutting down bot process!`
                    });

                    return process.exit(1);
                } catch (err) {
                    return interaction.editReply({
                        content: `\`❗️\` An error has occurred:\n${err}`
                    });
                }
            }
            break;
        }
    }
}