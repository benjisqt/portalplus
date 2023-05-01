const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    AttachmentBuilder
} = require('discord.js');
const fetch = require('node-fetch');
const { Reply } = require('../../util/replies');

module.exports = {
    category: 'Information',
    data: new SlashCommandBuilder()
        .setName('minecraft')
        .setDescription('Minecraft-related commands')
        .addSubcommand((sub) =>
            sub.setName('profile')
            .setDescription('Information about a Minecraft player')
            .addStringOption((opt) =>
                opt.setName('username')
                .setDescription('The username of the Minecraft account')
                .setRequired(true)
            )
            .addBooleanOption((opt) =>
                opt.setName('silent')
                .setDescription('Whether command feedback should only be sent to you')
            )
        )
        .addSubcommand((sub) =>
            sub.setName('server')
            .setDescription('Information about a Java edition or Bedrock edition Minecraft server')
            .addStringOption((opt) =>
                opt.setName('address')
                .setDescription('The address of the Minecraft server')
                .setRequired(true)
            )
            .addStringOption((opt) =>
                opt.setName('type')
                .setDescription('The type of server')
                .addChoices({
                    name: 'Bedrock Server',
                    value: 'bedrock'
                }, {
                    name: 'Java Edition Server',
                    value: 'java'
                }, )
                .setRequired(true)
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
        const sub = interaction.options.getSubcommand();
        const silent = interaction.options.getBoolean('silent') || false;

        switch(sub) {
            case 'profile' : {
                const user = interaction.options.getString('username');

                const data = await fetch(`https://api.minetools.eu/uuid/${user}`).then(res => res.json());

                if(data.status === 'ERR') return Reply(interaction, 'Red', '🚫', `That username was not found. Please make sure you typed it correctly.`, true);

                const dataa = await fetch(`https://crafatar.com/avatars/${data.id}`).then(res => res.buffer());

                if(silent === true) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`${user}`)
                            .addFields(
                                {
                                    name: 'Skin',
                                    value: `[Download](https://crafatar.com/skins/${data.id})`,
                                },
                                {
                                    name: 'Cape',
                                    value: `[Download](https://crafatar.com/capes/${data.id})`,
                                },
                                {
                                    name: '3D Head Model',
                                    value: `[Download](https://crafatar.com/renders/head/${data.id})`
                                },
                                {
                                    name: 'UUID',
                                    value: `${data.id}`
                                }
                            )
                            .setColor('Random')
                            .setThumbnail(`https://crafatar.com/renders/body/${data.id}`)
                        ], ephemeral: true
                    });
                } else {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`${user}`)
                            .addFields(
                                {
                                    name: 'Skin',
                                    value: `[Download](https://crafatar.com/skins/${data.id})`,
                                },
                                {
                                    name: 'Cape',
                                    value: `[Download](https://crafatar.com/capes/${data.id})`,
                                },
                                {
                                    name: '3D Head Model',
                                    value: `[Download](https://crafatar.com/renders/head/${data.id})`
                                },
                                {
                                    name: 'UUID',
                                    value: `${data.id}`
                                }
                            )
                            .setColor('Random')
                            .setThumbnail(`https://crafatar.com/renders/body/${data.id}`)
                        ]
                    });
                }
            }
            break;

            case 'server' : {
                let site;

                const address = interaction.options.getString('address');
                const type = interaction.options.getString('type');

                if(type === 'bedrock') site = `https://api.mcsrvstat.us/bedrock/2/`;
                if(type === 'java') site = `https://api.mcsrvstat.us/2/`;

                const data = await fetch(`${site}${address}`).then(res => res.json());

                if(data.ping === false) return Reply(interaction, 'Red', '🚫', `That server was not found. Please ensure you selected the right address and version.`, true);

                if(type === 'bedrock') {
                    if(!address.includes(':')) return interaction.reply({ embeds: [
                        new EmbedBuilder()
                        .setTitle(`> Include the port!`)
                        .setDescription(`With Bedrock Edition servers, you need to include the port. An example of correct syntax is shown below.\nIf you don't know the port of the server, 🤷`)
                        .setImage('https://cdn.discordapp.com/attachments/1057055934486155315/1102402033249701999/Screenshot_2023-05-01_at_02.11.59.png')
                        .setColor('Orange')
                    ] })
                    if(silent === true) {
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`Minecraft Server Information: ${address} - ${type}`)
                                .setDescription(`\`\`\`Server Address: ${data.hostname}:${data.port}\nMotd: ${data.motd.clean}\nPlayers Online: ${data.players.online}\nMax Players: ${data.players.max}\nVersion: ${data.version}\nOnline: ${data.online}\nSoftware: ${data.software}\nGamemode: ${data.gamemode}\`\`\``)
                                .setColor('Random')
                            ], ephemeral: true
                        })
                    } else {
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`Minecraft Server Information: ${address} - ${type}`)
                                .setDescription(`\`\`\`Server Address: ${data.hostname}:${data.port}\nMotd: ${data.motd.clean}\nPlayers Online: ${data.players.online}\nMax Players: ${data.players.max}\nVersion: ${data.version}\nOnline: ${data.online}\nSoftware: ${data.software}\nGamemode: ${data.gamemode}\`\`\``)
                                .setColor('Random')
                            ]
                        })
                    }
                }

                if(type === 'java') {
                    if(silent === true) {
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`Minecraft Server Information: ${address} - ${type}`)
                                .setDescription(`\`\`\`Server Address: ${data.hostname}:${data.port}\nMotd: ${data.motd.clean}\nPlayers Online: ${data.players.online}\nMax Players: ${data.players.max}\nVersion: ${data.version}\nOnline: ${data.online}\nSoftware: ${data.software}\`\`\``)
                                .setColor('Random')
                            ], ephemeral: true
                        })
                    } else {
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`Minecraft Server Information: ${address} - ${type}`)
                                .setDescription(`\`\`\`Server Address: ${data.hostname}:${data.port}\nMotd: ${data.motd.clean}\nPlayers Online: ${data.players.online}\nMax Players: ${data.players.max}\nVersion: ${data.version}\nOnline: ${data.online}\nSoftware: ${data.software}\`\`\``)
                                .setColor('Random')
                            ]
                        })
                    }
                }
            }
            break;
        }
    }
}