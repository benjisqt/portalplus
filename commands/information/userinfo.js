const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder
} = require('discord.js');
const moment = require('moment');

module.exports = {
    category: 'Information',
    data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Information on a user')
    .addUserOption((opt) =>
        opt.setName('user')
        .setDescription('The user you want to get information on')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        await interaction.deferReply();

        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
        if(!member) return interaction.reply({ content: `That user is not in this guild.`, ephemeral: true });
        const silent = interaction.options.getBoolean('silent') || false;
        let roles;

        const memberRoles = member.roles.cache.filter((roles) => roles.id !== interaction.guild.id).map((role) => role.toString());
        if(memberRoles.length <= 0) roles = 'No Roles.';
        else roles = memberRoles;

        let flags = user.flags.toArray();

        let badges = [];
        let extrabadges = [];

        await Promise.all(flags.map (async badge => {
            if(badge === 'Staff') badges.push('<a:AniDiscordStaff:1112159813678407710>')
            if(badge === 'ActiveDeveloper') badges.push('<:ActiveDeveloper:1112160400096641105>')
            if(badge === 'BugHunterLevel1') badges.push('<:BugHunter1:1112160302100914217>')
            if(badge === 'BugHunterLevel2') badges.push('<:BugHunter2:1112160340566884373>')
            if(badge === 'CertifiedModerator') badges.push('<:DiscordModerator:1112160005043519528>')
            if(badge === 'Hypesquad') badges.push('<a:AniHypeSquad:1112160076468338779>')
            if(badge === 'HypeSquadOnlineHouse1') badges.push('<:HypeSquadBravery:1112160137021501581>')
            if(badge === 'HypeSquadOnlineHouse2') badges.push('<:HypeSquadBrilliance:1112160176426987530>')
            if(badge === 'HypeSquadOnlineHouse3') badges.push('<:HypeSquadBalance:1112160226746056834>')
            if(badge === 'Partner') badges.push('<:Partnered:1112159958167994438>')
            if(badge === 'Staff') badges.push('<a:AniDiscordStaff:1112159813678407710>')
            if(badge === 'PremiumEarlySupporter') badges.push('<:EarlySupporter:1112160506573242458>')
            if(badge === 'VerifiedBot') badges.push('<:VerifiedBot:1112160565717114941>')
            if(badge === 'VerifiedDeveloper') badges.push('<:VeriBotDev:1112160469734674432>')
        }));

        const userData = await fetch(`https://japi.rest/discord/v1/user/${user.id}`);
        const { data } = await userData.json();

        if(data.public_flags_array) {
            await Promise.all(data.public_flags_array.map(async badge => {
                if(badge === 'NITRO') badges.push('<a:AniNitro:1112163935978782793>');
            }))
        }

        if(user.bot) {
            const botFetch = await fetch(`https://discord.com/api/v10/applications/${user.id}/rpc`)

            let json = await botFetch.json();

            let flagsBot = json.flags;

            const gateways = {
                APPLICATION_COMMAND_BADGE: 1 << 23,
            };

            const arrayFlags = [];

            for (let i in gateways) {
                const bit = gateways[i];
                if ((flagsBot & bit) === bit) arrayFlags.push(i);
            }

            if(arrayFlags.includes('APPLICATION_COMMAND_BADGE')) {
                badges.push(`<:slashcmds:1112164774449528873>`)
            }
        }

        if(!user.discriminator || user.discriminator === 0 || user.tag === `${user.username}#0`) {
            badges.push('<:ChangedUser:1112165454945992714>')
        }
            
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${user.tag}`)
                .addFields(
                    { name: 'Originated', value: `<t:${Math.round(user.createdTimestamp / 1000)}:f> <t:${parseInt(user.createdTimestamp / 1000)}:R>` },
                    { name: 'Joined', value: `<t:${Math.round(member.joinedTimestamp / 1000)}:f> <t:${Math.round(member.joinedTimestamp / 1000)}:R>` },
                )
                .setDescription(`${roles}\n\n${badges.join(' ') || "No Badges Assigned."}`)
                .setImage('https://cdn.discordapp.com/attachments/895632161057669180/930131558168412230/void_red_bar.PNG')
                .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
                .setColor('Gold')
            ]
        })
    }
}