const { Client, Guild, VoiceChannel, GuildMember, VoiceState } = require('discord.js');
const vctimer = require('../../models/vctimer');
const vctimerinfo = require('../../models/vctimerinfo');

module.exports = {
    name: 'voiceStateUpdate',

    /**
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     */

    async execute(oldState, newState) {
        console.log('voiceStateUpdate event ran');
        
        const data = await vctimer.findOne({ Guild: newState.guild.id });
        if(!data) {
            return console.log('Returned because vctimer info was not found.')
        }

        const timerinfo = await vctimerinfo.findOne({ Guild: newState.guild.id, Channel: oldState.channelId });

        if(timerinfo && oldState.channel.members.size <= 0) {
            oldState.channel.setName(timerinfo.ChannelName);
        }

        if(!newState.channelId) {
            if(!oldState.channelId) return;

            const data = await vctimerinfo.findOne({ Guild: oldState.guild.id, Channel: oldState.channelId });
            if(!data) return;

            await vctimerinfo.deleteOne({ Guild: oldState.guild.id, Channel: oldState.channelId }, { new: true });
        }

        if(!newState.channel) {
            if(!oldState.channelId) return;

            const data = await vctimerinfo.findOne({ Guild: oldState.guild.id, Channel: oldState.channelId });
            if(!data) return;

            await vctimerinfo.deleteOne({ Guild: oldState.guild.id, Channel: oldState.channelId }, { new: true });
        }

        const newtimerinfo = await vctimerinfo.findOne({ Guild: newState.guild.id, Channel: newState.channelId });
        if(!newtimerinfo) {
            await vctimerinfo.create({
                Guild: newState.guild.id,
                Channel: newState.channelId,
                ChannelName: newState.channel.name,
                Duration: '0',
            });

            newState.channel.setName(`0: ${newState.channel.name}`);
        } else {
            const membersinVC = newState.channel.members;
            if(membersinVC.size <= 0) {
                await vctimerinfo.findOneAndDelete({ Guild: newState.guild.id, Channel: newState.channelId }, { new: true });
                return;
            }

            const numberduration = Number(newtimerinfo.Duration);
            if(numberduration < 0) {
                return console.log('New Timer Info Duration Invalid.')
            };

            const newduration = numberduration + 1;

            const stringduration = newduration.toString();

            newtimerinfo.Duration = stringduration;
            newtimerinfo.save();

            newState.channel.setName(`${stringduration}: ${newState.channel.name}`)
        }

        setInterval(async() => {
            const intervaltimerinfo = await vctimerinfo.findOne({ Guild: newState.guild.id, Channel: newState.channelId });
            if(!intervaltimerinfo) return;
            
            if(!newState.channel) {
                return console.log('New State Channel not found.');
            };

            const membersinVC = newState.channel.members;
            if(membersinVC.size <= 0) {
                await vctimerinfo.findOneAndDelete({ Guild: newState.guild.id, Channel: newState.channelId }, { new: true });
                return;
            }

            const numberduration = Number(intervaltimerinfo.Duration);
            if(numberduration < 0) {
                return console.log('New Timer Info Duration Invalid.')
            };

            const newduration = numberduration + 3;

            const stringduration = newduration.toString();

            intervaltimerinfo.Duration = stringduration;
            intervaltimerinfo.save();

            newState.channel.setName(`${intervaltimerinfo.Duration}: ${newState.channel.name}`)
            console.log('Updated name');
        }, 3000);
    }
}