const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('prediction')
        .setDescription('Ask Kirika and Fuyumi what they think the score of a game will be')
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

        const channel = interaction.guild.channels.cache.get('608509082835484702')//.send({ content: 'your message' });
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
        teamcity = interaction.options.getString('teamcity')
        teamname = interaction.options.getString('teamname')
        teamInput = teamcity + ' ' + teamname
        squad = TitleCase(teamInput)
        console.log(squad)

        console.log(`${time} ${username(ID)} used /prediction ${squad}`)

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

        channel.send(`<@607824305119821855> Oh Fuyumiiiii :) prediction time`)
        channel.send(`!prediction ${squad}`)

        SPORT = undefined
        LEAGUE = undefined
        ABBR = undefined

        if (squad === '') {
            return interaction.reply('<@' + message.author.id + '> You gotta tell me which team you want my prediction for <:KirikaSmile:608201680374464532>')
        } else {
            fs.readFile('sports.json', 'utf8', (err, data) => {
                sports = JSON.parse(data)

                let LeaguesEntries = Object.entries(sports)

                for (let i = 0; i < LeaguesEntries.length; i++) {
                    let TeamsEntries = Object.entries(LeaguesEntries[i][1])
                    for (let j = 0; j < TeamsEntries.length; j++) {
                        if (TeamsEntries[j][0].includes(squad)) {
                            LEAGUE = LeaguesEntries[i][0].toLowerCase()
                            ABBR = TeamsEntries[j][1].abbr
                            console.log(LEAGUE, ABBR)
                        }
                    }
                }
                if (LEAGUE === 'nfl') {
                    SPORT = 'football'
                    minscore = 0
                    maxscore = 48
                }
                if (LEAGUE === 'nhl') {
                    SPORT = 'hockey'
                    minscore = 0
                    maxscore = 11
                }
                if (LEAGUE === 'nba') {
                    SPORT = 'basketball'
                    minscore = 61
                    maxscore = 141
                }
                if (LEAGUE === 'mlb') {
                    SPORT = 'baseball'
                    minscore = 0
                    maxscore = 21
                }
                if (LEAGUE === 'ncaaf') {
                    SPORT = 'football'
                    LEAGUE = 'college-football'
                    minscore = 0
                    maxscore = 73
                }
                if (LEAGUE === 'wnba') {
                    SPORT = 'basketball'
                    minscore = 61
                    maxscore = 141
                }

                if (LEAGUE === undefined) {
                    return interaction.reply('I\'m sorry, I don\'t recognize that team <:KirikaSmile:608201680374464532> Make sure you\'re including both the city *and* team name and you\'re using the official team spelling as well')
                }
            })
            setTimeout(() => {
                if (LEAGUE != undefined) {
                    fs.readFile('kirikapredictions.json', 'utf8', (err, data) => {
                        scores = JSON.parse(data)

                        if (scores.kirika === undefined) {
                            console.log(SPORT, LEAGUE, ABBR, '1')
                            getPrediction(SPORT, LEAGUE, ABBR)
                        } else {
                            newpredict = 0
                            if (scores.kirika.prediction[LEAGUE] === undefined) {
                                scores.kirika.prediction[LEAGUE] = []
                                console.log(SPORT, LEAGUE, ABBR, '2')
                                getPrediction(SPORT, LEAGUE, ABBR)
                            } else {
                                for (let i = 0; i < scores.kirika.prediction[LEAGUE].length; i++) {
                                    if (scores.kirika.prediction[LEAGUE][i].includes(squad)) {
                                        if ((new Date().getTime()) - (Date.parse(scores.kirika.prediction[LEAGUE][i][6])) < 5400000) {
                                            return interaction.reply(scores.kirika.prediction[LEAGUE][i][4] + ' ' + scores.kirika.prediction[LEAGUE][i][5] + ', ' + scores.kirika.prediction[LEAGUE][i][1] + ' ' + scores.kirika.prediction[LEAGUE][i][2] + ' <:beatzWICKED:1165575471153549342>'),
                                                newpredict = 1
                                        }
                                    }
                                }

                                if (newpredict === 0) {
                                    console.log(SPORT, LEAGUE, ABBR, '3')
                                    getPrediction(SPORT, LEAGUE, ABBR)
                                }
                            }                           
                        }

                        function getPrediction(sport, league, abbr) {
                            return new Promise(async function (resolve, reject) {
                                try {
                                    const req = await fetch('http://site.api.espn.com/apis/site/v2/sports/' + sport + '/' + league + '/teams/' + abbr, {
                                        method: 'get',
                                        headers: {},
                                        redirect: 'follow'
                                    });
                                    //sends the request
                                    espn = await req.json()                   //formats the raw request into JSON

                                    if (espn.team.nextEvent[0] != undefined) {
                                        prediction = []

                                        hometeam = espn.team.nextEvent[0].competitions[0].competitors[0].team.displayName
                                        awayteam = espn.team.nextEvent[0].competitions[0].competitors[1].team.displayName
                                        homename = espn.team.nextEvent[0].competitions[0].competitors[0].team.shortDisplayName
                                        awayname = espn.team.nextEvent[0].competitions[0].competitors[1].team.shortDisplayName
                                        homescore = randomNumber(minscore, maxscore)
                                        awayscore = randomNumber(minscore, maxscore)
                                        eventDate = espn.team.nextEvent[0].date

                                        if (homescore === awayscore) {
                                            console.log('Tiebreak' + homescore, awayscore)
                                            winningteam = randomNumber(1, 2)
                                            if (winningteam === 1) {
                                                homescore = (homescore + randomNumber(1, 2))
                                            } else {
                                                awayscore = (awayscore + randomNumber(1, 2))
                                            }
                                        }

                                        if ((new Date().getTime()) - (Date.parse(eventDate)) < -604800000) {
                                            if (league === 'nfl') {
                                                return interaction.reply('It seems the ' + squad + ' are on a bye this week <:KirikaSmile:608201680374464532>')
                                            } else if (league != 'nfl') {
                                                return interaction.reply(`I don\'t know who the ${TitleCase(teamname)} are playing next. Try again when the season gets closer <:KirikaSmile:608201680374464532>`)
                                            }
                                        } else if ((new Date().getTime()) - (Date.parse(eventDate)) > 0) {
                                            console.log((new Date().getTime()), (Date.parse(eventDate)), (new Date().getTime()) - (Date.parse(eventDate)))
                                            return interaction.reply(`I don\'t know who the ${TitleCase(teamname)} are playing next. Try again when their game gets closer <:KirikaSmile:608201680374464532>`)
                                        } else {
                                            prediction.push(hometeam, homename, homescore, awayteam, awayname, awayscore, eventDate)
                                            return interaction.reply('The ' + squad + ' game? Hmmm.... I\'m thinkin ' + awayname + ': ' + awayscore + ' - ' + homename + ': ' + homescore + ' <:KirikaSmile:608201680374464532>'),
                                                scores.kirika.prediction[LEAGUE].push(prediction),
                                                fs.writeFile('kirikapredictions.json', JSON.stringify(scores), (err) => {
                                                    if (err) throw err;

                                                })
                                        }

                                        resolve(hometeam, homescore, awayteam, awayscore, eventDate)
                                    } else {
                                        reject()
                                    }
                                } catch (err) {
                                    return interaction.reply('Hang on. ESPN is being a baka <:beatzBaka:1167640027652698312> Try again in a second'),
                                        console.log(err)
                                }
                            })
                        }

                    })
                }
            }, 1000)
        }

    }
}
