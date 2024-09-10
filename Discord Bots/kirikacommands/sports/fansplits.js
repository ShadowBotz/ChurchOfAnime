const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('fansplits')
		.setDescription('Shows the fan distribution of this discord by conference and/or division')
        .addStringOption(option =>
            option.setName('league')
                .setDescription('The league you want the scores for')
                .setRequired(true)
                .addChoices(
					{ name: 'MLB', value: 'mlb' },
					{ name: 'NBA', value: 'nba' },
                    { name: 'NCAAF', value: 'college-football' },
					{ name: 'NFL', value: 'nfl' },
                    { name: 'NHL', value: 'nhl' },
                    { name: 'WNBA', value: 'wnba' },
				)),
	async execute(interaction) {
        const guild = interaction.member.guild;
        const ID = interaction.user.id

        function username(Input) {
            if (guild.members.cache.get(Input) != undefined) {
                if (guild.members.cache.get(Input).nickname != null) {
                    return guild.members.cache.get(Input).nickname
                } else {
                    return guild.members.cache.get(Input).user.globalName
                }
            } else {
                return ("a mystery person")
            }
        }

        var d = new Date();
        var time = (d.getHours()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ':' + (d.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })) + ':' + (d.getSeconds()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ' - '
        LEAGUE = interaction.options.getString('league');

        console.log(`${time} ${username(ID)} used /fansplits ${LEAGUE}`)
    
        fs.readFile('sports.json', 'utf8', (err, data) => {
            sports = JSON.parse(data)

                let TeamsEntries = Object.entries(sports[LEAGUE.toUpperCase()])
                conferences = []
                divisions = []
                dfancount = ''

                for (let i = 0; i < TeamsEntries.length; i++) {
                    if (!conferences.includes(TeamsEntries[i][1].conference)) {
                        if (conferences.length < 1) {
                            conferences.push(TeamsEntries[i][1].conference, ': ')
                            cfancount = TeamsEntries[i][1].fans.length
                        } else {
                            conferences.push(cfancount, ' ----- ')
                            conferences.push(TeamsEntries[i][1].conference, ': ')
                            cfancount = TeamsEntries[i][1].fans.length
                        }
                    } else {
                        cfancount = cfancount + TeamsEntries[i][1].fans.length
                    }

                    if (TeamsEntries[i][1].division != null) {
                        if (!divisions.includes(TeamsEntries[i][1].division)) {
                            if (divisions.length < 1) {
                                divisions.push(TeamsEntries[i][1].division, ': ')
                                dfancount = TeamsEntries[i][1].fans.length
                            } else {
                                divisions.push(dfancount, ' \n')
                                divisions.push(TeamsEntries[i][1].division, ': ')
                                dfancount = TeamsEntries[i][1].fans.length
                            }
                        } else {
                            dfancount = dfancount + TeamsEntries[i][1].fans.length
                        }
                    }
                }
                conferences.push(cfancount)
                divisions.push(dfancount)
                const fansplitEmbed = new EmbedBuilder()
                            .setColor(8446019)
                            .setTitle('Church of Anime ' + LEAGUE.toUpperCase() + ' Fan Distribution')
                            .setThumbnail('https://a.espncdn.com/i/teamlogos/leagues/500/'+LEAGUE+'.png')
                            .addFields(
                                { name: '===================================', value: '' + conferences.join().replaceAll(',', '') + '\n\n' + divisions.join().replaceAll(',', '') }
                            )

                    return interaction.reply({ embeds: [fansplitEmbed] })
            
        })
        
	},
};