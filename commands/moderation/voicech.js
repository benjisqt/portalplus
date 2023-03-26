const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');
const {
    Reply
} = require('../../util/replies');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voicech')
        .setDescription('Voice channel management commands')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand((sub) =>
            sub.setName('kick')
            .setDescription('Kick a user from the voice channel they are in')
            .addUserOption((opt) =>
                opt.setName('user')
                .setDescription('The user you want to kick from the vc')
                .setRequired(true)
            )
            .addBooleanOption((opt) =>
                opt.setName('silent')
                .setDescription('Whether command feedback should only be sent to you')
            )
        )
        .addSubcommand((sub) =>
            sub.setName('setuserlimit')
            .setDescription('Set a user limit for the voice channel')
            .addChannelOption((opt) =>
                opt.setName('vc')
                .setDescription('The voice channel you want to manage')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice)
            )
            .addNumberOption((opt) =>
                opt.setName('people')
                .setDescription('The amount of users you want to limit the vc to')
                .setRequired(true)
                .setMaxValue(99)
                .setMinValue(0)
            )
            .addBooleanOption((opt) =>
                opt.setName('silent')
                .setDescription('Whether command feedback should only be sent to you')
            )
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const subgroup = interaction.options.getSubcommand();
        const silent = interaction.options.getBoolean('silent');

        switch (subgroup) {
            case 'kick': {
                const user = interaction.options.getMember('user');

                if (!user.voice.channel) return Reply(interaction, 'Red', '🚫', 'That user is not in a voice channel!', true)

                user.voice.disconnect();

                if (silent === true) {
                    return Reply(interaction, 'Green', `✅`, `Successfully disconnected ${user} from the voice channel!`, true)
                } else {
                    return Reply(interaction, 'Green', `✅`, `Successfully disconnected ${user} from the voice channel!`, false)
                }
            }
            break;

        case 'setuserlimit': {
            const vc = interaction.options.getChannel('vc');
            const people = interaction.options.getNumber('people');

            const validvc = interaction.guild.channels.cache.filter(ch => ch.id === vc.id);
            if (!validvc) return Reply(interaction, 'Red', '🚫', 'This is not a valid VC.', true);

            vc.setUserLimit(people);

            if (people === 0) {
                if (silent === true) {
                    return Reply(interaction, 'Green', '✅', `Reset the user limit of ${vc} to infinite people!`, true)
                } else {
                    return Reply(interaction, 'Green', '✅', `Reset the user limit of ${vc} to infinite people!`, false)
                }
            }

            if (silent === true) {
                return Reply(interaction, 'Green', '✅', `Set the user limit of ${vc} to ${people} people!`, true)
            } else {
                return Reply(interaction, 'Green', '✅', `Set the user limit of ${vc} to ${people} people!`, false)
            }
        }
        break;
        }
    }
}