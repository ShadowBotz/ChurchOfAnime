const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('teams')
        .setDescription('Displays the scores of your favorite teams (add teams with /addteam).')
        .addUserOption(option =>
            option.setName('username')
                .setDescription('Name of the person you want to look up the teams for (leave blank to check your own)')
        ),
    async execute(interaction) {
        const guild = interaction.member.guild;
        const ID = interaction.user.id
        const searchid = interaction.options.getUser('username');

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
        if (searchid != null){
            console.log(`${time} ${username(ID)} used /teams ${searchid.id}`)
        } else {
            console.log(`${time} ${username(ID)} used /teams`)
        }
        

        async function getTeamInfo(sport, league, abbr) {
            try {
                const req = await fetch('http://site.api.espn.com/apis/site/v2/sports/' + sport + '/' + league + '/teams/' + abbr, {
                    method: 'get',
                    headers: {},
                    redirect: 'follow'
                });
                //sends the request
                espn = await req.json()
                //formats the raw request into JSON

                if (espn.team != undefined) {
                    var M = league
                    let teaminfo = []

                    if (espn.team.color === '000000') {
                        if (espn.team.record.items != undefined) {
                            teaminfo.push(espn.team.displayName, espn.team.logos[1].href, espn.team.alternateColor, espn.team.record.items[0].summary, espn.team.standingSummary)
                        } else {
                            teaminfo.push(espn.team.displayName, espn.team.logos[1].href, espn.team.alternateColor, "0-0", espn.team.standingSummary)
                        }

                    } else {
                        if (espn.team.record.items != undefined) {
                            teaminfo.push(espn.team.displayName, espn.team.logos[1].href, espn.team.color, espn.team.record.items[0].summary, espn.team.standingSummary)
                        } else {
                            teaminfo.push(espn.team.displayName, espn.team.logos[1].href, espn.team.color, "0-0", espn.team.standingSummary)
                        }
                    }

                    if (espn.team.displayName.includes(' Eagles') || espn.team.displayName.includes(' Cowboys') || espn.team.displayName.includes(' Flyers') || espn.team.displayName.includes(' Phillies') || espn.team.displayName.includes(' Braves') || espn.team.displayName.includes(' Nationals') || espn.team.displayName.includes(' Yankees') || espn.team.displayName.includes(' Capitals')) {
                        teaminfo.push('<:beatzSusAF:549413960948908063>')
                    } else {
                        if (espn.team.standingSummary != undefined) {
                            if (espn.team.standingSummary[0] === '1') {
                                teaminfo.push('<:beatzWICKED:1165575471153549342>')
                            } else {
                                if (espn.team.record.items != undefined) {
                                    if ((espn.team.record.items[0].summary.split("-")[0]) < (espn.team.record.items[0].summary.split("-")[1])) {
                                        console.log(espn.team.displayName,espn.team.record.items[0].summary.split("-")[0],espn.team.record.items[0].summary.split("-")[1])
                                        teaminfo.push('<:beatzDespair:1019839939522859109>')
                                    } else {
                                        teaminfo.push('<:KirikaSmile:608201680374464532>')
                                    }
                                } else {
                                    teaminfo.push('<:KirikaSmile:608201680374464532>')
                                }
                            }
                        } else {
                            teaminfo.push('<:KirikaSmile:608201680374464532>')
                        }
                    }

                    if (espn.team.nextEvent[0] != undefined) {
                        if ((new Date().getTime()) - (Date.parse(espn.team.nextEvent[0].date)) < 0) {
                            teaminfo.push('\n\nTheir next game is: \n' + espn.team.nextEvent[0].competitions[0].competitors[1].team.shortDisplayName + ' vs. ' + espn.team.nextEvent[0].competitions[0].competitors[0].team.shortDisplayName + ' (' + espn.team.nextEvent[0].competitions[0].status.type.shortDetail + ')\n\n')
                        }


                    }

                    return (teaminfo)
                } else {
                    return Promise.reject('getTeamInfo() Kirika Promise Error')
                }
            } catch (err) {
                return interaction.editReply('Hang on. ESPN is being a baka <:beatzBaka:1167640027652698312> Try again in a second'),
                    console.log('getTeamInfo\n' + err)
            }
        }

        function getTeams(id) {
            fs.readFile('sports.json', 'utf8', (err, data) => {
                sports = JSON.parse(data)


                let LeaguesEntries = Object.entries(sports)
                userfandom = []
                SPORT = undefined
                LEAGUE = undefined


                for (let i = 0; i < LeaguesEntries.length; i++) {
                    let TeamsEntries = Object.entries(LeaguesEntries[i][1])
                    for (let j = 0; j < TeamsEntries.length; j++) {
                        let FansEntries = Object.entries(TeamsEntries[j][1])
                        if (FansEntries[0][1].includes(id)) {
                            if (LeaguesEntries[i][0].toLowerCase() === 'nfl') {
                                SPORT = 'football'
                                LEAGUE = 'nfl'
                            }
                            if (LeaguesEntries[i][0].toLowerCase() === 'nhl') {
                                SPORT = 'hockey'
                                LEAGUE = 'nhl'
                            }
                            if (LeaguesEntries[i][0].toLowerCase() === 'nba') {
                                SPORT = 'basketball'
                                LEAGUE = 'nba'
                            }
                            if (LeaguesEntries[i][0].toLowerCase() === 'mlb') {
                                SPORT = 'baseball'
                                LEAGUE = 'mlb'
                            }
                            if (LeaguesEntries[i][0].toLowerCase() === 'ncaaf') {
                                SPORT = 'football'
                                LEAGUE = 'college-football'
                            }
                            if (LeaguesEntries[i][0].toLowerCase() === 'wnba') {
                                SPORT = 'basketball'
                                LEAGUE = 'wnba'
                            }
                            userfandom.push([LeaguesEntries[i][0].toLowerCase(), TeamsEntries[j][0], SPORT, TeamsEntries[j][1].abbr.toLowerCase()])
                        }
                    }
                }

                if (userfandom.length < 1) {
                    return interaction.editReply('' + username(id) + ' hasn\'t told me who their favorite teams are yet <:beatzDespair:1019839939522859109> Maybe they don\'t like sports')
                } else {
                    teamArray()

                    async function teamArray() {
                        var teamarray = []
                        for (var k = 0; k < userfandom.length; k++) {
                            const a = await getTeamInfo(userfandom[k][2], userfandom[k][0], userfandom[k][3])
                            teamarray.push([a[0], ' --- ' + a[3] + ' ', '(' + a[4] + ') ' + a[5]] + '\n')
                        }

                        const teamsEmbed = new EmbedBuilder()
                            .setColor(8446019)
                            .setTitle(username(id) + '\'s Favorite Teams')
                            .setThumbnail(guild.members.cache.get(id).user.displayAvatarURL())
                            .addFields(
                                { name: '=======================================', value: teamarray.join().replaceAll(',', '') }
                            )

                        return interaction.editReply({ embeds: [teamsEmbed] })
                    }
                }
            })
        }

        if (searchid === null) {
            getTeams(ID)
        } else {
            getTeams(searchid.id)
        }

    },
};