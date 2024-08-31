const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('fans')
        .setDescription('Displays the fans of a team in this discord (add teams with /addteam).')
        .addStringOption(option =>
            option.setName('teamcity')
                .setDescription('The city of the team to look up')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('teamname')
                .setDescription('The name of the team to look up')
                .setRequired(true)
        ),
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
        console.log(`${time} ${username(ID)} used /fans`)

        function TitleCase(Input) {
            Input = Input.toLowerCase().split(" ");

            for (var i = 0; i < Input.length; i++) {
                if (Input[i].length === 2) {
                    Input[i] = Input[i].toUpperCase();
                } else {
                    Input[i] = Input[i].charAt(0).toUpperCase() + Input[i].slice(1);
                }
            }

            return Input.join(' ');
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
                        teaminfo.push(espn.team.displayName, espn.team.logos[1].href, espn.team.alternateColor, espn.team.record.items[0].summary, espn.team.standingSummary)
                    } else {
                        teaminfo.push(espn.team.displayName, espn.team.logos[1].href, espn.team.color, espn.team.record.items[0].summary, espn.team.standingSummary)
                    }

                    if (espn.team.displayName.includes(' Eagles') || espn.team.displayName.includes(' Cowboys') || espn.team.displayName.includes(' Flyers') || espn.team.displayName.includes(' Phillies') || espn.team.displayName.includes(' Braves') || espn.team.displayName.includes(' Nationals') || espn.team.displayName.includes(' Yankees') || espn.team.displayName.includes(' Capitals')) {
                        teaminfo.push('<:beatzSusAF:549413960948908063>')
                    } else {
                        if (espn.team.standingSummary != undefined) {
                            if (espn.team.standingSummary[0] === '1') {
                                teaminfo.push('<:beatzWICKED:1165575471153549342>')
                            } else {
                                if (espn.team.record.items[0].stats[4].name === 'clincher') {
                                    if (espn.team.record.items[0].stats[18].value < 0.5) {
                                        teaminfo.push('<:beatzDespair:1019839939522859109>')
                                    } else {
                                        teaminfo.push('<:KirikaSmile:608201680374464532>')
                                    }
                                } else if (espn.team.record.items[0].stats[0].name === 'otLosses') {
                                    if (espn.team.record.items[0].stats[15].value < 0.5) {
                                        teaminfo.push('<:beatzDespair:1019839939522859109>')
                                    } else {
                                        teaminfo.push('<:KirikaSmile:608201680374464532>')
                                    }
                                } else {
                                    if (espn.team.record.items[0].stats[17].value < 0.5) {
                                        teaminfo.push('<:beatzDespair:1019839939522859109>')
                                    } else {
                                        teaminfo.push('<:KirikaSmile:608201680374464532>')
                                    }
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
                return interaction.reply('Hang on. ESPN is being a baka <:beatzBaka:1167640027652698312> Try again in a second'),
                    console.log('getTeamInfo\n' + err)
            }
        }


        teamcity = interaction.options.getString('teamcity')
        teamname = interaction.options.getString('teamname')
        teamInput = teamcity + ' ' + teamname
        team = TitleCase(teamInput)

        fs.readFile('sports.json', 'utf8', (err, data) => {
            sports = JSON.parse(data)

            let LeaguesEntries = Object.entries(sports)

            let outcome = undefined

            for (let i = 0; i < LeaguesEntries.length; i++) {
                if (LeaguesEntries[i][1][team] != undefined) {
                    outcome = [LeaguesEntries[i][0], LeaguesEntries[i][1][team]]
                }
            }

            console.log(outcome)

            if (outcome === undefined) {
                return interaction.reply({ content: 'What? <:beatzSusAF:549413960948908063> What team is that? Is that a typo?', ephemeral: true })
            } else {
                SPORT = undefined
                LEAGUE = outcome[0].toLowerCase()
                modifier = outcome[1].modifier
                chant = outcome[1].chant
                abbr = outcome[1].abbr
                fan = []

                if (LEAGUE === 'nfl') {
                    SPORT = 'football'
                }
                if (LEAGUE === 'nhl') {
                    SPORT = 'hockey'
                }
                if (LEAGUE === 'nba') {
                    SPORT = 'basketball'
                }
                if (LEAGUE === 'mlb') {
                    SPORT = 'baseball'
                }
                if (LEAGUE === 'ncaaf') {
                    SPORT = 'football'
                }
                if (LEAGUE === 'wnba') {
                    SPORT = 'basketball'
                }

                if (outcome[1].fans.length < 1) {
                    fan.push('Nobody likes ' + modifier + '' + team + ' <:beatzF:384222351186853891>')
                } else {
                    for (let i = 0; i < outcome[1].fans.length; i++) {
                        fan.push(username(outcome[1].fans[i]))
                    }

                }
                console.log(SPORT, LEAGUE, abbr)
                getTeamInfo(SPORT, LEAGUE, abbr).then(a => {

                    console.log(a)

                    logo = a[1]
                    color = a[2]
                    emote = a[5]

                    const fansEmbed = new EmbedBuilder()
                        .setColor(color)
                        .setTitle(team + ' Fandom')
                        .setDescription(emote)
                        .setThumbnail(logo)
                        .addFields(
                            { name: '===================================', value: '' + fan.join('\n').replaceAll(',', '') }
                        )

                    return interaction.reply({ embeds: [fansEmbed] })
                })



            }
        })
    },
};