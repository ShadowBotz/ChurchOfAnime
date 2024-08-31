const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('teamscores')
		.setDescription('Displays the recent scores of a requested team')
        .addStringOption(option =>
            option.setName('teamcity')
                .setDescription('The city of the requested team')
                .setRequired(true)
                )
        .addStringOption(option =>
            option.setName('teamname')
                .setDescription('The name of the requested team')
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
        console.log(`${time} ${username(ID)} used /teamscores`)

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
                                    if (espn.team.record.items[0].stats[4].name === 'clincher') {
                                        if (espn.team.record.items[0].stats[18].value < 0.5) {
                                            teaminfo.push('<:beatzDespair:1019839939522859109>')
                                        } else {
                                            teaminfo.push('<:KirikaSmile:608201680374464532>')
                                        }
                                    } else if (espn.team.record.items[0].stats[0].name === 'OTLosses') {
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
                return interaction.reply('Hang on. ESPN is being a baka <:beatzBaka:1167640027652698312> Try again in a second'),
                console.log('getTeamInfo\n' + err)
            }
        }

        let kirikapred = []
        let fuyumipred = []
        teamcity = interaction.options.getString('teamcity')
        teamname = interaction.options.getString('teamname')
        teamInput = teamcity+' '+teamname
        squad = TitleCase(teamInput)

        fs.readFile('kirikapredictions.json', 'utf8', (err, data) => {
            kpred = JSON.parse(data)           

            for (let i = 0; i < kpred.kirika.prediction.length; i++) {
                if (kpred.kirika.prediction[i].includes(squad)) {
    
                        if (kpred.kirika.prediction[i][5] >= kpred.kirika.prediction[i][2]) {
                            kirikapred.push('<:KirikaSmile:608201680374464532> Kirika: ' + kpred.kirika.prediction[i][4] + ' ', +kpred.kirika.prediction[i][5] + ' - ', kpred.kirika.prediction[i][1] + ' ', kpred.kirika.prediction[i][2] + '')
                        } else {
                            kirikapred.push('<:KirikaSmile:608201680374464532> Kirika: ' + kpred.kirika.prediction[i][1] + ' ', kpred.kirika.prediction[i][2] + ' - ', kpred.kirika.prediction[i][4] + ' ', kpred.kirika.prediction[i][5] + '')
                        }
                        break;
                    
                }
            }
        })

        fs.readFile('fuyumipredictions.json', 'utf8', (err, data) => {
            fpred = JSON.parse(data)

            for (let i = 0; i < fpred.fuyumi.prediction.length; i++) {
                if (fpred.fuyumi.prediction[i].includes(squad)) {
                    
                        if (fpred.fuyumi.prediction[i][5] >= fpred.fuyumi.prediction[i][2]) {
                            fuyumipred.push('<:FuyumiJam:624560349101817856> Fuyumi: ' + fpred.fuyumi.prediction[i][4] + ' ', +fpred.fuyumi.prediction[i][5] + ' - ', fpred.fuyumi.prediction[i][1] + ' ', fpred.fuyumi.prediction[i][2] + '')
                        } else {
                            fuyumipred.push('<:FuyumiJam:624560349101817856> Fuyumi: ' + fpred.fuyumi.prediction[i][1] + ' ', fpred.fuyumi.prediction[i][2] + ' - ', fpred.fuyumi.prediction[i][4] + ' ', fpred.fuyumi.prediction[i][5] + '')
                        }
                        break;
                    
                }
            }
        })

        fs.readFile('sports.json', 'utf8', (err, data) => {
            sports = JSON.parse(data)
            SPORT = undefined
            LEAGUE = undefined
            ABBR = undefined
            let games = []
            let logo
            let color = null

            let LeaguesEntries = Object.entries(sports)

            for (let i = 0; i < LeaguesEntries.length; i++) {
                let TeamsEntries = Object.entries(LeaguesEntries[i][1])
                for (let j = 0; j < TeamsEntries.length; j++) {
                    if (TeamsEntries[j][0].includes(squad)) {
                        LEAGUE = LeaguesEntries[i][0].toLowerCase()
                        ABBR = TeamsEntries[j][1].abbr
                    }
                }
            }



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
                LEAGUE = 'college-football'
            }
            if (LEAGUE === 'wnba') {
                SPORT = 'basketball'
            }


            async function getScores(sport, league, team) {
                try {
                    const req = await fetch('http://site.api.espn.com/apis/site/v2/sports/' + sport + '/' + league + '/scoreboard', {
                        method: 'get',
                        headers: {},
                        redirect: 'follow'
                    });
                    //sends the request
                    espn = await req.json()                   //formats the raw request into JSON

                    if (espn.events[0] != undefined) {
                        games = []

                        for (i = 0; i < espn.events.length; i++) {
                            if (espn.events[i].name.includes(team)) {
                                games.push([espn.events[i].competitions[0].competitors[1].team.shortDisplayName + " ", espn.events[i].competitions[0].competitors[1].score + " - ", espn.events[i].competitions[0].competitors[0].team.shortDisplayName + " ", espn.events[i].competitions[0].competitors[0].score + " (", espn.events[i].competitions[0].status.type.shortDetail + ")"])
                            }
                        }



                        if (games.length < 1) {
                            if (LEAGUE === 'nfl') {
                                games.push(team + ' have a bye this week')
                            } else {
                                games.push(team + ' didn\'t play today')
                            }

                            getTeamInfo(SPORT, LEAGUE, ABBR).then(a => {

                                logo = a[1]
                                color = a[2]
                                record = a[3]
                                standings = a[4]
                                if (a[6] != undefined) {
                                    nextgame = a[6]
                                    AngelPredictions = '__Angel Predictions__\n'
                                } else {
                                    nextgame = '\n\n'
                                    AngelPredictions = ''
                                }

                                const scoresEmbed = new EmbedBuilder()
                                    .setColor(color)
                                    .setTitle(squad + ' Game')
                                    .setDescription(record + ' (' + standings + ')')
                                    .addFields(
                                        { name: '===================================', value: '' + games.join('\n\n').replaceAll(',', '').replaceAll('Ducks', 'Cucks').replaceAll('Panthers', 'Most Trash Garbage Team In The Whole League') + nextgame + AngelPredictions + (kirikapred.join('')).replaceAll(',', '') + '\n' + (fuyumipred.join('')).replaceAll(',', '') }
                                    )

                                if (logo != undefined){
                                    scoresEmbed.setThumbnail(logo)
                                }

                                    return interaction.reply({ embeds: [scoresEmbed] })

                            })
                        } else {
                            getTeamInfo(SPORT, LEAGUE, ABBR).then(a => {

                                logo = a[1]
                                color = a[2]
                                record = a[3]
                                standings = a[4]

                                const scoresEmbed = new EmbedBuilder()
                                    .setColor(color)
                                    .setTitle(squad + ' Game')
                                    .setDescription(record + ' (' + standings + ')')
                                    .addFields(
                                        { name: '===================================', value: '' + games.join('\n\n').replaceAll(',', '').replaceAll('Ducks', 'Cucks').replaceAll('Panthers', 'Most Trash Garbage Team In The Whole League') + '\n\n' + (kirikapred.join('')).replaceAll(',', '') + '\n' + (fuyumipred.join('')).replaceAll(',', '') }
                                    )
                                
                                    if (logo != undefined){
                                        scoresEmbed.setThumbnail(logo)
                                    }

                                    return interaction.reply({ embeds: [scoresEmbed] })
                            })

                        }
                    } else {
                        return Promise.reject('getScores() Kirika Promise Error')
                    }

                } catch (err) {
                    return interaction.reply('Hang on. ESPN is being a baka <:beatzBaka:1167640027652698312> Try again in a second'),
                    console.log(err)
                }

            }
            if (LEAGUE === undefined) {
                return interaction.reply({content: 'I\'m sorry, I don\'t recognize that team <:KirikaSmile:608201680374464532> Make sure you\'re including both the city *and* team name and you\'re using the official team spelling as well', ephemeral: true})
            } else {
                console.log(SPORT, LEAGUE, squad)
                getScores(SPORT, LEAGUE, squad)
            }
        })
	},
};