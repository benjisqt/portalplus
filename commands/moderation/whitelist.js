const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, Client, EmbedBuilder } = require('discord.js');
const whitelist = require('../../models/whitelist');

module.exports = {
    category: 'Moderation',
    data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('whitelist')
    .setDescription('Portal+ Whitelist System')
    .addSubcommand((sub) =>
        sub.setName('enable')
        .setDescription('Enable the whitelist')
        .addStringOption((opt) =>
            opt.setName('punishment')
            .setDescription('The punishment if non whitelisted people join')
            .setRequired(true)
            .addChoices(
                { name: 'Ban the user', value: 'ban' },
                { name: 'Kick the user', value: 'kick' }
            )
        )
    )
    .addSubcommand((sub) =>
        sub.setName('disable')
        .setDescription('Disable the whitelist')
    )
    .addSubcommand((sub) =>
        sub.setName('add')
        .setDescription('Add people to the whitelist!')
        .addUserOption((opt) =>
            opt.setName('user')
            .setDescription('The user to be whitelist <@userid>')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('addall')
        .setDescription('Add all members to the whitelist')
    )
    .addSubcommand((sub) =>
        sub.setName('remove')
        .setDescription('Remove someone from the whitelist!')
        .addUserOption((opt) =>
            opt.setName('user')
            .setDescription('The user to be whitelist <@userid>')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('clear')
        .setDescription("Clear the whitelist of all people")
    )
    .addSubcommand((sub) =>
        sub.setName('list')
        .setDescription('List all people in the whitelist')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const sub = interaction.options.getSubcommand();

        switch(sub) {
            case 'enable': {
                const data = await whitelist.findOne({ Guild: interaction.guildId });
                if(data) return interaction.reply({ content: `\`❗️\` The whitelist system is already enabled! If you want to edit people, you can do:\n\`/whitelist add\`, \`/whitelist remove\`, \`/whitelist clear\` or \`/whitelist addall\`.`, ephemeral: true });

                await new whitelist({
                    Guild: interaction.guildId,
                    Users: [
                        interaction.user.id
                    ]
                }).save();

                return interaction.reply({
                    content: `\`✅\` Whitelist has been enabled!\n\`📃\` You can edit people by running the following commands:\n\`/whitelist add\` - Add people\n\`/whitelist remove\` - Remove people\n\`/whitelist clear\` - Clear all people\n\`/whitelist addall\` - Add all people in the guild to the whitelist`,
                    ephemeral: true
                });
            }
            break;
            
            case 'disable': {
                const data = await whitelist.findOne({ Guild: interaction.guildId });
                if(!data) return interaction.reply({ content: `\`❗️\` The whitelist system is already disabled!`, ephemeral: true });

                data.deleteOne({ Guild: interaction.guildId });
                return interaction.reply({ content: `\`✅\` The whitelist system in this guild has been disabled!`, ephemeral: true });
            }
            break;

            case 'add': {
                const data = await whitelist.findOne({ Guild: interaction.guildId });
                if(!data) return interaction.reply({ content: `\`❗️\` The whitelist system is disabled!`, ephemeral: true });

                const user = interaction.options.getUser('user');

                if(data.Users.includes(user.id)) return interaction.reply({ content: `\`❗️\` This user is already whitelisted!`, ephemeral: true });

                data.Users.push(user.id);
                data.save();

                return interaction.reply({ content: `\`✅\` <@${user.id}> has been whitelisted!`, ephemeral: true });
            }
            break;

            case 'addall': {
                const emoji = client.emojis.cache.get('1096078204680286329');
                const data = await whitelist.findOne({ Guild: interaction.guildId });
                if(!data) return interaction.reply({ content: `\`❗️\` The whitelist system is disabled!`, ephemeral: true });

                const members = await interaction.guild.members.cache.filter(u => u.id !== interaction.user.id && !u.user.bot);

                const arrayf = [];

                members.forEach(m => {
                    arrayf.push(m.id);
                });

                if(members.size < 2) return interaction.reply({ content: `\`❗️\` You are the only member in this server!`, ephemeral: true });

                data.Users.forEach(u => {
                    const mem = interaction.guild.members.cache.get(u);
                    if(!mem) {
                        const index = data.Users.indexOf(u);
                        data.Users.splice(index, 1);
                    }
                });

                if(arrayf.toString() === data.Users.toString()) return interaction.reply({ content: `\`❗️\` Nothing changed; the whitelist and members are the same.`, ephemeral: true });

                await interaction.reply({ content: `${emoji} Adding all members of the guild to the whitelist, this may take a while depending on your member count. Please be patient!`, ephemeral: true });

                let num = 0;

                members.forEach(m => {
                    if(data.Users.includes(m.id)) {
                        const index = data.Users.indexOf(m.id);
                        data.Users.splice(index, 1);
                    } else {
                        num++;
                    }
                })

                members.forEach(m => {
                    data.Users.push(m.id);
                });

                data.save();

                setTimeout(() => {
                    return interaction.editReply({ content: `\`✅\` Added ${num} members to the whitelist!`, ephemeral: true });
                }, 3000)
            }
            break;

            case 'remove': {
                const data = await whitelist.findOne({ Guild: interaction.guildId });
                if(!data) return interaction.reply({ content: `\`❗️\` The whitelist system is disabled!`, ephemeral: true });

                const user = interaction.options.getUser('user');

                if(user.id === interaction.user.id) return interaction.reply({
                    content: `\`❗️\` `,
                    ephemeral: true,
                })

                if(!data.Users.includes(user.id)) return interaction.reply({ content: `\`❗️\` That user is not in the whitelist.`, ephemeral: true });

                const index = data.Users.indexOf(user.id);

                data.Users.splice(index, 1);

                data.save();

                return interaction.reply({
                    content: `\`✅\` Removed <@${user.id}> from the whitelist!`,
                    ephemeral: true
                });
            }
            break;

            case 'clear': {
                const data = await whitelist.findOne({ Guild: interaction.guildId });
                if(!data) return interaction.reply({ content: `\`❗️\` The whitelist system is disabled!`, ephemeral: true });

                const array = [
                    interaction.user.id
                ];

                data.Users = [];
                data.Users.push(array);
                data.save();

                return interaction.reply({
                    content: `\`✅\` Cleared all members from the whitelist (except you)`,
                    ephemeral: true
                });
            }
            break;

            case 'list': {
                const data = await whitelist.findOne({ Guild: interaction.guildId });
                if(!data) return interaction.reply({ content: `\`❗️\` The whitelist system is disabled!`, ephemeral: true });

                const dat = await data.Users.map((m) => {
                    return [
                        `<@${m}>`
                    ]
                }).join('\n');

                if(dat.length > 1024) return interaction.reply({ content: `\`❗️\` There is over 1024 characters, so the list cannot be displayed.`, ephemeral: true });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`All Whitelisted Members In ${interaction.guild.name}`)
                        .setDescription(`${dat}`)
                        .setColor('Gold')
                    ], ephemeral: true
                })
            }
            break;
        }
    }
}