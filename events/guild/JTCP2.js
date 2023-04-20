const { Client, GuildMember, ChannelType, EmbedBuilder, VoiceState } = require('discord.js');
const joinSchema = require('../../models/jointocreate');
const joinSchemaCh = require('../../models/jointocreatechannels');

module.exports = {
    name: 'voiceStateUpdate',

    /**
     * 
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     * @param {Client} client
     */

    async execute(oldState, newState, client) {
        try {
            if(oldState.member.guild === null) return;
        } catch (err) {
            return console.log(err);
        }

        const leaveData = await joinSchema.findOne({ Guild: oldState.member.guild.id });
        const leavechanneldata = await joinSchemaCh.findOne({ Guild: oldState.member.guild.id, User: oldState.member.id });
        if(!leavechanneldata) return
        else {
            const vc = await oldState.member.guild.channels.cache.get(leavechanneldata.Channel);

            try {
                await vc.delete();
            } catch (err) {
                if(!leaveData) return;
                const ch = newState.guild.channels.cache.get(leaveData.ErrorChannel);
                if(!ch) return;
                if(ch.permissionsFor(client.user).has('SendMessages')) {
                    ch.send({ content: `<@${newState.member.id}>, an error occured with the join-to-create system! Contact the developers.` });
                } else return;
            }

            await joinSchemaCh.deleteMany({ Guild: oldState.member.guild.id, User: oldState.member.id });

            if(!leaveData) return;
            const ch = newState.guild.channels.cache.get(leaveData.ErrorChannel);
            if(!ch) return;
            if(ch.permissionsFor(client.user).has('SendMessages')) {
                ch.send({
                    embeds: [
                        new EmbedBuilder()
                        .setAuthor({ name: `Join-To-Create`, iconURL: newState.guild.members.me.displayAvatarURL() })
                        .addFields({
                            name: `Channel Deleted`,
                            value: `> Your voice channel has been\n> deleted in **${newState.member.guild.name}**`
                        })
                        .setColor('Gold')
                    ]
                });
            } else return;
        }
    }
}