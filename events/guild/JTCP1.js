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
            if(newState.member.guild === null) return;
        } catch (err) {
            console.log(err);
        }

        const joinData = await joinSchema.findOne({ Guild: newState.guild.id });
        const joinChannelData = await joinSchemaCh.findOne({ Guild: newState.member.guild.id, User: newState.member.id });

        const voiceChannel = newState.channel;
        if(!joinData) return;
        if(!voiceChannel) return;
        else {
            if(voiceChannel.id === joinData.Channel) {
                if(joinChannelData) {
                    const ch = newState.guild.channels.cache.get(joinData.ErrorChannel);
                    if(!ch) return;
                    if(ch.permissionsFor(client.user).has('SendMessages')) {
                        ch.send({ content: `<@${newState.member.id}>, you have already created a channel!` });
                    }
                } else {
                    try {
                        const ch = await newState.member.guild.channels.create({
                            type: ChannelType.GuildVoice,
                            name: `${newState.member.user.username}-room`,
                            userLimit: joinData.VoiceLimit,
                            parent: joinData.Category,
                        });
    
                        try {
                            await newState.member.voice.setChannel(ch.id);
                        } catch (err) {
                            const ch = newState.guild.channels.cache.get(joinData.ErrorChannel);
                            if(!ch) return;
                            if(ch.permissionsFor(client.user).has('SendMessages')) {
                                ch.send({ content: `<@${newState.member.id}>, an error occured with the join-to-create system! Contact the developers.` });
                            } else return;
                        }
    
                        setTimeout(() => {
                            joinSchemaCh.create({
                                Guild: newState.member.guild.id,
                                Channel: ch.id,
                                User: newState.member.id
                            });
                        }, 500);
    
                    } catch (err) {
                        const ch = newState.guild.channels.cache.get(joinData.ErrorChannel);
                        if(!ch) return;
                        if(ch.permissionsFor(client.user).has('SendMessages')) {
                            ch.send({ content: `<@${newState.member.id}>, an error occured with the join-to-create system! Contact the developers.` });
                        } else return;
                    }
    
                    const ch = newState.guild.channels.cache.get(joinData.ErrorChannel);
                    if(!ch) return;
                    if(ch.permissionsFor(client.user).has('SendMessages')) {
                        ch.send({
                            embeds: [
                                new EmbedBuilder()
                                .setAuthor({ name: `Join-To-Create`, iconURL: newState.guild.members.me.displayAvatarURL() })
                                .addFields({
                                    name: `Channel Created`,
                                    value: `> Your voice channel has been\n> created in **${newState.member.guild.name}**`
                                })
                                .setColor('Gold')
                            ]
                        })
                    } else return;
                }
            }
        }
    }
}