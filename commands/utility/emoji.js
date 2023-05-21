const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, Client, EmbedBuilder } = require('discord.js');
const { default: axios } = require('axios');
const { Reply, EditReply } = require('../../util/replies');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('emoji')
    .setDescription('Emoji management commands')
    .addSubcommand((sub) =>
        sub.setName('steal')
        .setDescription('Steal an emoji from another server!')
        .addStringOption((opt) =>
            opt.setName('emoji')
            .setDescription("The emoji you want to steal!")
            .setRequired(true)
        ).addStringOption((opt) =>
            opt.setName('name')
            .setDescription('The name of your stolen emoji!')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('enlarge')
        .setDescription('Enlarge an emoji!')
        .addStringOption((opt) =>
            opt.setName('emoji')
            .setDescription('The emoji you want to enlarge!')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('add')
        .setDescription('Add an emoji to your server!')
        .addAttachmentOption((opt) =>
            opt.setName('emoji')
            .setDescription('The emoji you want to add to the server')
            .setRequired(true)
        )
        .addStringOption((opt) =>
            opt.setName('name')
            .setDescription('The name of the new emoji!')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('remove')
        .setDescription('Remove an emoji to your server!')
        .addStringOption((opt) =>
            opt.setName('emoji')
            .setDescription('The emoji that you want to remove!')
            .setRequired(true)
        )
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction) {
        let emoji = interaction.options.getString('emoji')?.trim();
        let emojiattachment = interaction.options.getAttachment('emoji');
        const loadingemoji = client.emojis.cache.get('1096078204680286329');
        const name = interaction.options.getString('name');
        const link = interaction.options.getString('link');
        const sub = interaction.options.getSubcommand();

        switch(sub) {
            case 'steal': {
                if(!interaction.member.permissions.has(PermissionFlagsBits.ManageGuildExpressions)) return Reply(interaction, 'Red', '🛑', `You do not have the Manage Emojis permission.`, true);
                if(!interaction.guild.members.me.permissions.has('ManageEmojisAndStickers')) return Reply(interaction, 'Red', '🛑', `I do not have the Manage Emojis permission.`, true);
        
                if(emoji.startsWith('<') && emoji.endsWith('>')) {
                    const id = emoji.match(/\d{15,}/g)[0];
        
                    const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
                    .then(image => {
                        if(image) return "gif"
                        else return "png"
                    }).catch(err => {
                        return "png"
                    });
        
                    emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
                }
        
                if(!emoji.startsWith('http')) {
                    return await interaction.reply({ content: `You cannot enlarge default emojis!`, ephemeral: true });
                }
        
                if(!emoji.startsWith("https")) {
                    return await interaction.reply({ content: `You cannot enlarge default emojis!`, ephemeral: true });
                }
        
                interaction.guild.emojis.create({ attachment: `${emoji}`, name: `${name}` })
                .then((emoji) => {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription(`✅ | Successfully stolen emoji ${emoji}`)
                            .setColor('Green')
                            .setFooter({ text: `EMOJI STOLEN BOZO` })
                        ]
                    })
                }).catch(err => {
                    console.log(err);
                    return Reply(interaction, 'Red', '🛑', `There was an error whilst performing that command.`, true);
                })
            }
            break;

            case 'enlarge': {
                if(emoji.startsWith('<') && emoji.endsWith('>')) {
                    const id = emoji.match(/\d{15,}/g)[0];
        
                    const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
                    .then(image => {
                        if(image) return "gif"
                        else return "png"
                    }).catch(err => {
                        return "png"
                    });
        
                    emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
                }
        
                if(!emoji.startsWith('http')) {
                    return await interaction.reply({ content: `You cannot enlarge default emojis!`, ephemeral: true });
                }
        
                if(!emoji.startsWith("https")) {
                    return await interaction.reply({ content: `You cannot enlarge default emojis!`, ephemeral: true });
                }
        
                const embed = new EmbedBuilder()
                .setTitle(`Enlarged emoji`)
                .setDescription(`> I have enlarged the emoji. The image is shown below.`)
                .setImage(emoji)
                .setColor('Gold')
            }
            break;

            case 'add': {
                if(!interaction.member.permissions.has(PermissionFlagsBits.ManageGuildExpressions)) return Reply(interaction, 'Red', '🛑', `You do not have the Manage Emojis permission.`, true);
                if(!interaction.guild.members.me.permissions.has('ManageEmojisAndStickers')) return Reply(interaction, 'Red', '🛑', `I do not have the Manage Emojis permission.`, true);

                await interaction.reply({ content: `${loadingemoji} Adding emoji... Please wait.` });

                const newemoji = await interaction.guild.emojis.create({ attachment: emojiattachment, name: name }).catch(err => {
                    setTimeout(() => {
                        console.log(err);
                        return interaction.editReply({ content: `${err.rawError.message}` })
                    }, 2000);
                });

                setTimeout(() => {
                    if(!newemoji) return;

                    const embed = new EmbedBuilder()
                    .setDescription(`\`✅\` Added emoji with name ${name} - ${emoji}`)
                    .setColor('Green')

                    interaction.editReply({ content: ``, embeds: [embed] })
                }, 2000);
            }
            break;

            case 'remove': {
                if(!interaction.member.permissions.has(PermissionFlagsBits.ManageGuildExpressions)) return Reply(interaction, 'Red', '🛑', `You do not have the Manage Emojis permission.`, true);
                if(!interaction.guild.members.me.permissions.has('ManageEmojisAndStickers')) return Reply(interaction, 'Red', '🛑', `I do not have the Manage Emojis permission.`, true);

                await interaction.reply({ content: `${loadingemoji} Removing emoji... Please wait.` });

                const emojicheck = await interaction.guild.emojis.fetch()
                .then(emojis => {
                    return emojis.find(x => x.name === emoji || x.toString() === emoji)
                }).catch(err => {
                    console.log(err);
                })

                if(!emojicheck) return Reply(interaction, 'Red', '🛑', `That emoji was not found in this server.`, true);

                const deletedemoji = await emojicheck.delete();

                return EditReply(interaction, ``, `Gold`, `✅`, `Successfully removed emoji with name \`${deletedemoji.name}\``, false);
            }
            break;
        }
    }
}