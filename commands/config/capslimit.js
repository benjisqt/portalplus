const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const capslimit = require('../../models/capslimit');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('capslimit')
    .setDescription('Set a limit for the amount of capitals in a message')
    .addSubcommand((sub) =>
        sub.setName('enable')
        .setDescription('Enable the caps limit')
        .addNumberOption((opt) =>
            opt.setName('capitals')
            .setDescription('The amount of capitals you want to block')
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('disable')
        .setDescription('Disable the caps limit')
    )
    .addSubcommand((sub) =>
        sub.setName('modify')
        .setDescription('Modify the caps limit')
        .addNumberOption((opt) =>
            opt.setName('capitals')
            .setDescription('The amount of capitals you want to block')
            .setRequired(true)
            .setMinValue(1)
        )
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    
    async execute(interaction) {
        const limit = interaction.options.getNumber('capitals') || 0;
        const sub = interaction.options.getSubcommand();
        const data = await capslimit.findOne({ Guild: interaction.guildId });

        switch(sub) {
            case 'enable': {
                if(data) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`\`🛑\` | The caps limit system has already been enabled. To modify, run \`/capslimit modify\`.`)
                        .setColor('Red')
                    ]
                });

                await capslimit.create({
                    Guild: interaction.guildId,
                    CapsLimit: limit,
                });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`\`✅\` Enabled Capitals Limit`)
                        .setDescription(`> The capitals limit has been enabled.\nAny messages sent with more than ${limit} capitals will be deleted and the user will be verbally warned.`)
                        .setColor('Gold')
                        .setFooter({
                            text: `Portal+ Caps Limit`
                        })
                    ]
                });
            }
            break;

            case 'disable': {
                if(!data) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`\`🛑\` | The caps limit is already disabled.`)
                        .setColor('Red')
                    ]
                });

                await capslimit.deleteMany({ Guild: interaction.guildId });
                
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`\`✅\` Disabled Capitals Limit`)
                        .setDescription(`> The capitals limit has been disabled.\nAny amount of capitals are now allowed.`)
                        .setColor('Gold')
                        .setFooter({
                            text: `Portal+ Caps Limit`
                        })
                    ]
                });
            }
            break;

            case 'modify': {
                if(!data) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`\`🛑\` | The caps limit is disabled.`)
                        .setColor('Red')
                    ]
                });

                await data.updateOne({ Guild: interaction.guildId, CapsLimit: limit }, { new: true });

                await data.save();

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`\`✅\` Modified Capitals Limit`)
                        .setDescription(`> The capitals limit has been modified.\nAny messages sent with more than ${limit} capitals will be deleted and the user will be verbally warned.`)
                        .setColor('Gold')
                        .setFooter({
                            text: `Portal+ Caps Limit`
                        })
                    ]
                });
            }
            break;
        }
    }
}