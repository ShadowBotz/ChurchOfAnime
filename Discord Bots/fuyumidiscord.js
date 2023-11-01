// Import packages/set variables (constants)
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers], partials: ["CHANNEL"] });
const schedule = require('node-schedule');
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');
var oauth = require('./oauth.js');
const { EmbedBuilder } = require('discord.js');

//Each discord bot has a unique token
client.login(oauth.FuyumiID);

// Creates an event listener for bot ready-state
client.on('ready', () => {
    var d = new Date();
    var time = (d.getHours()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ':' + (d.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })) + ':' + (d.getSeconds()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ' - '

    console.log(time + 'bot running')
});

// Creates an event listener for messages
client.on('messageCreate', message => {

    splt = message.content.split(" ")

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function username(Input) {
        if (client.guilds.cache.get('172065393525915648').members.cache.get(Input) != undefined) {
            if (client.guilds.cache.get('172065393525915648').members.cache.get(Input).nickname != null) {
                return client.guilds.cache.get('172065393525915648').members.cache.get(Input).nickname
            } else {
                return client.guilds.cache.get('172065393525915648').members.cache.get(Input).user.globalName
            }
        } else {
            return ("a mystery person")
        }
    }

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

    if (message.channel.type != undefined && message.author != null) {
        if (message.content === '!alertsoff') {
            client.guilds.cache.get('172065393525915648').members.cache.get(message.author.id).roles.remove('607809003665489930')
                .then(message.channel.send('Got it.'))
                .then(console.log('alerts role removed for ' + message.author.username + ''))
                .catch(console.error);
        }

        if (message.content === '!vtubeoff') {
            client.guilds.cache.get('172065393525915648').members.cache.get(message.author.id).roles.remove('859218117833916437')
                .then(message.channel.send('Mmk. Role\'s removed'))
                .then(console.log('v-tube role removed for ' + message.author.username + ''))
                .catch(console.error);
        }

        if (message.channel.id === '608509082835484702' && message.author.id === '124044415634243584') {
            yeet = message.content.split(" ")
            poundDel = yeet[1].substring(2, yeet[1].length - 1)
            if (yeet[0] === 'fuyumi') {
                client.channels.cache.get(poundDel).send(yeet.slice(2).join(' '))
                //console.log(yeet[1].substr(0,i)+yeet[1].substr(i+1))

            }
        }

        if (message.content === '!weeblist') {
            message.channel.send('"kyoniwasawa" <:pepeLaugh:619388817236951070> https://myanimelist.net/animelist/KyonIwasawa')
        }

        if (message.channelId === '931407561792565280' && message.content.includes('*/6')) {
            message.channel.send('<@' + message.author.id + '> <:OMEGALUL:854391735458988063>')
        }


        sup = message.content.toLowerCase()
        if (sup.includes('hi ') || sup.includes('hey ') || sup.includes('greetings ') || sup.includes('ohayo ') || sup.includes('konbanwa ') || sup.includes('hello ')) {
            if (message.author.id != '607824305119821855') {
                if (sup.includes('fuyumi')) {
                    message.channel.send('Hello <@' + message.author.id + '>')
                }
            }
        }

        if (message.content.includes('!bd')) {
            if (message.content.substring(0, 3) === '!bd') {
                if (message.author.username != 'ShadowBeatz') {
                    fs.readFile('birthdays.json', 'utf8', (err, data) => {
                        birthday = JSON.parse(data)
                        AID = message.author.id
                        //console.log(typeof AID)

                        temp = 0
                        Object.keys(birthday).forEach(function (key) {
                            if (birthday[key].ID.includes(AID)) {
                                temp = temp + 1
                            }
                        })
                        if (temp == 0) {
                            if (message.content.toLowerCase() === '!bd feb 29') {
                                message.channel.send('You were not born on February 29th you damn liar.')
                            }
                        } else {
                            message.channel.send('Your birthday is already logged. Ask Shadow to fix it if you messed it up.')
                            temp = 0
                        }
                    })
                }
            }
        }

        if (message.content.toLowerCase() === '!remove') {
            fs.readFile('birthdays.json', 'utf8', (err, data) => {
                birthday = JSON.parse(data)
                AID = message.author.id

                temp = 0
                Object.keys(birthday).forEach(function (key) {
                    if (birthday[key].ID.includes(AID)) {
                        temp = temp + 1
                    }
                })
                if (temp == 0) {
                    message.channel.send('<@' + message.author.id + '> Your birthday isn\'t logged.')
                } else {
                    client.channels.cache.get('607815006633066496').send('<@124044415634243584> ' + message.author.username + ' (ID: ' + message.author.id + ') would like their birthday removed')
                    temp = 0
                }
            })
        }

        if (message.channelId === '931407561792565280' && splt[0] === 'Wordle') {
            if (!isNaN(message.content[7])) {
                if (message.content[11] === 'X' || Number(message.content[11]) < 7) {
                    id = message.author.id
                    score = 0

                    fs.readFile('wordlescores.json', 'utf8', (err, data) => {
                        wordle = JSON.parse(data)
                        count = message.content.split("\n")
                        failures = 0

                        for (let i = 2; i < count.length; i++) {
                            for (let j = 0; j < count[i].length; j++) {
                                if (count[i][j] === '⬛' || count[i][j] === '⬜') {
                                    score = score + 3
                                } else if (count[i][j].charCodeAt(0).toString(16) === 'd83d' || count[i][j].charCodeAt(0).toString(16) === 'dfe6' || count[i][j].charCodeAt(0).toString(16) === 'dfe8') { //dfe6 and dfe8 refer to yellow and blue squares
                                    score = score + 1
                                }
                            }
                        }

                        if (message.content[11] != 'X') {
                            guesses = Number(message.content[11])
                        } else {
                            failures = 1
                            guesses = 7
                        }

                        if (wordle[id] === undefined) {
                            wordle[id] = { "SCORE": score, "GUESSES": guesses, "GAMES": 1, "FAILURES": failures, "bestSCORE": score, "careerGUESSES": guesses, "careerGAMES": 1, "careerFAILURES": failures }
                        } else {
                            wordle[id].SCORE = wordle[id].SCORE + score
                            wordle[id].GUESSES = wordle[id].GUESSES + guesses
                            wordle[id].GAMES = wordle[id].GAMES + 1
                            wordle[id].FAILURES = wordle[id].FAILURES + failures
                            wordle[id].careerGUESSES = wordle[id].careerGUESSES + guesses
                            wordle[id].careerGAMES = wordle[id].careerGAMES + 1
                            wordle[id].careerFAILURES = wordle[id].careerFAILURES + failures
                        }

                        if (score < wordle[id].bestSCORE) {
                            wordle[id].bestSCORE = score
                        }

                        if (message.content[11] != 'X') {
                            message.channel.send(score + ' points.')//\n\n```prolog\n'+username(id)+' Wordle Stats\n\n===================================\nMonthly Average Score: '+Math.round((wordle[id].SCORE/wordle[id].GAMES + Number.EPSILON) * 1000) / 1000+'\nMonthly Average Guesses: '+Math.round((wordle[id].GUESSES/wordle[id].GAMES + Number.EPSILON) * 1000) / 1000+'\nMonthly Total Score: '+wordle[id].SCORE+'\nMonthly Games: '+wordle[id].GAMES+'\n===================================\nBest Score: '+wordle[id].bestSCORE+'\nCareer Games: '+wordle[id].careerGAMES+'\nCareer Average Guesses: '+Math.round((wordle[id].careerGUESSES/wordle[id].careerGAMES + Number.EPSILON) * 1000) / 1000+'\nCareer Games Failed: '+wordle[id].careerFAILURES+'```')
                        } else {
                            message.channel.send('Lol. I got it in ' + randomNumber(1, 6) + '. ' + score + ' points.')//\n\n```prolog\n'+username(id)+' Wordle Stats\n\n===================================\nMonthly Average Score: '+Math.round((wordle[id].SCORE/wordle[id].GAMES + Number.EPSILON) * 1000) / 1000+'\nMonthly Average Guesses: '+Math.round((wordle[id].GUESSES/wordle[id].GAMES + Number.EPSILON) * 1000) / 1000+'\nMonthly Total Score: '+wordle[id].SCORE+'\nMonthly Games: '+wordle[id].GAMES+'\n===================================\nBest Score: '+wordle[id].bestSCORE+'\nCareer Games: '+wordle[id].careerGAMES+'\nCareer Average Guesses: '+Math.round((wordle[id].careerGUESSES/wordle[id].careerGAMES + Number.EPSILON) * 1000) / 1000+'\nCareer Games Failed: '+wordle[id].careerFAILURES+'```')
                        }

                        fs.writeFile('wordlescores.json', JSON.stringify(wordle), (err) => {
                            if (err) throw err;
                        })
                    })
                }
            }
        }

        if (message.channelId === '931407561792565280') {
            if (message.content.toLowerCase() === '!stats') {

                fs.readFile('wordlescores.json', 'utf8', (err, data) => {
                    id = message.author.id
                    wordle = JSON.parse(data)

                    const wordleStatsEmbed = new EmbedBuilder()
                        .setColor(2173288)
	                    .setTitle(username(id) +' Wordle Stats')
                        .setThumbnail(client.guilds.cache.get('172065393525915648').members.cache.get(id).user.displayAvatarURL())
                        .addFields(
                            { name: '\u200B', value: 'Monthly Average Score: ' + Math.round((wordle[id].SCORE / wordle[id].GAMES + Number.EPSILON) * 1000) / 1000 + '\nMonthly Average Guesses: ' + Math.round((wordle[id].GUESSES / wordle[id].GAMES + Number.EPSILON) * 1000) / 1000 + '\nMonthly Total Score: ' + wordle[id].SCORE + '\nMonthly Games: ' + wordle[id].GAMES + '\n===================================\nBest Score: ' + wordle[id].bestSCORE + '\nCareer Games: ' + wordle[id].careerGAMES + '\nCareer Average Guesses: ' + Math.round((wordle[id].careerGUESSES / wordle[id].careerGAMES + Number.EPSILON) * 1000) / 1000 + '\nCareer Games Failed: ' + wordle[id].careerFAILURES}
                            // { name: 'Monthly Average Score', value: ''+Math.round((wordle[id].SCORE / wordle[id].GAMES + Number.EPSILON) * 1000) / 1000, inline: true},
                            // { name: 'Monthly Average Guesses', value: ''+Math.round((wordle[id].GUESSES / wordle[id].GAMES + Number.EPSILON) * 1000) / 1000, inline: true},
                            // { name: '\u200B', value: '\u200B' },
                            // { name: 'Monthly Total Score', value: ''+wordle[id].SCORE,inline: true},
                            // { name: 'Monthly Games', value: ''+wordle[id].GAMES, inline: true},
                            // { name: '\u200B', value: '\u200B' },
                            // { name: 'Best Score', value: ''+wordle[id].bestSCORE, inline: true},
                            // { name: 'Career Games', value: ''+wordle[id].careerGAMES, inline: true},
                            // { name: '\u200B', value: '\u200B' },
                            // { name: 'Career Average Guesses', value: ''+Math.round((wordle[id].careerGUESSES / wordle[id].careerGAMES + Number.EPSILON) * 1000) / 1000, inline: true},
                            // { name: 'Career Games Failed', value: ''+wordle[id].careerFAILURES, inline: true},
                        )

                        setTimeout(() => {message.channel.send({ embeds: [wordleStatsEmbed] })},1000)
                    //message.channel.send('```prolog\n' + username(id) + ' Wordle Stats\n\n===================================\nMonthly Average Score: ' + Math.round((wordle[id].SCORE / wordle[id].GAMES + Number.EPSILON) * 1000) / 1000 + '\nMonthly Average Guesses: ' + Math.round((wordle[id].GUESSES / wordle[id].GAMES + Number.EPSILON) * 1000) / 1000 + '\nMonthly Total Score: ' + wordle[id].SCORE + '\nMonthly Games: ' + wordle[id].GAMES + '\n===================================\nBest Score: ' + wordle[id].bestSCORE + '\nCareer Games: ' + wordle[id].careerGAMES + '\nCareer Average Guesses: ' + Math.round((wordle[id].careerGUESSES / wordle[id].careerGAMES + Number.EPSILON) * 1000) / 1000 + '\nCareer Games Failed: ' + wordle[id].careerFAILURES + '```')
                })
            }
        }

        if (message.channelId === '931407561792565280') {
            if (message.content.toLowerCase() === '!leaderboard') {

                fs.readFile('wordlescores.json', 'utf8', (err, data) => {
                    wordle = JSON.parse(data)
                    leaderboard = []
                    let WordleEntries = Object.entries(wordle)

                    for (let i = 0; i < WordleEntries.length; i++) {
                        if (WordleEntries[i][1].GAMES > 0) {
                            if (WordleEntries[i][1].GAMES === 1){
                                leaderboard.push([Math.round((WordleEntries[i][1].SCORE / WordleEntries[i][1].GAMES + Number.EPSILON) * 1000) / 1000, ' average --- ', username(WordleEntries[i][0]) + ' (', WordleEntries[i][1].GAMES + ' game)'])
                            }else{
                                leaderboard.push([Math.round((WordleEntries[i][1].SCORE / WordleEntries[i][1].GAMES + Number.EPSILON) * 1000) / 1000, ' average --- ', username(WordleEntries[i][0]) + ' (', WordleEntries[i][1].GAMES + ' games)'])
                            }
                        }
                    }

                    leaderboard = leaderboard.sort((firstItem, secondItem) => firstItem[0] - secondItem[0])

                    const leaderboardEmbed = new EmbedBuilder()
                        .setColor(2173288)
                        .setAuthor({ name: 'Church of Anime Wordle Leaderboard', iconURL: 'https://static.wikia.nocookie.net/logopedia/images/4/45/Wordle_2022_Icon.png/revision/latest?cb=20220514191523', url: 'https://www.nytimes.com/games/wordle/index.html' })
                        .addFields(
                            { name: '\u200B', value: leaderboard.join('\n\n').replaceAll(',', '') }
                        )

                    //console.log(leaderboard)

                    message.channel.send({ embeds: [leaderboardEmbed] })
                })
            }
        }

    //     const exampleEmbed = new EmbedBuilder()
	// .setColor(0x0099FF)
	// .setTitle('Some title')
	// .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
	// .setDescription('Some description here')
	// .setThumbnail('https://i.imgur.com/AfFp7pu.png')
	// .addFields(
	// 	{ name: 'Regular field title', value: 'Some value here' },
	// 	{ name: '\u200B', value: '\u200B' },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// )
	// .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
	// .setImage('https://i.imgur.com/AfFp7pu.png')
	// .setTimestamp()
	// .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

        // if (message.channel.name === 'test' && message.author.username != 'Fuyumi') {
        //     console.log((message.content).charCodeAt(0).toString(16))
        // }

        if (splt[0] === '!prediction') {
            squad = TitleCase(splt.slice(1).join(' '))
            SPORT = undefined
            LEAGUE = undefined
            ABBR = undefined

            if (squad != '') {
                fs.readFile('sports.json', 'utf8', (err, data) => {
                    sports = JSON.parse(data)

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
                        variant = 6
                    }
                    if (LEAGUE === 'nhl') {
                        SPORT = 'hockey'
                        variant = 2
                    }
                    if (LEAGUE === 'nba') {
                        SPORT = 'basketball'
                        variant = 10
                    }
                    if (LEAGUE === 'mlb') {
                        SPORT = 'baseball'
                        variant = 3
                    }
                    if (LEAGUE === 'ncaaf') {
                        SPORT = 'football'
                        LEAGUE = 'college-football'
                        variant = 14
                    }
                    if (LEAGUE === 'xfl') {
                        SPORT = 'football'
                        variant = 6
                    }
                    if (LEAGUE === 'wnba') {
                        SPORT = 'basketball'
                        variant = 10
                    }
                    if (LEAGUE === 'mls') {
                        SPORT = 'soccer'
                        LEAGUE = 'usa.1'
                        variant = 1
                    }
                })

                setTimeout(() => {
                    fs.readFile('fuyumipredictions.json', 'utf8', (err, data) => {
                        scores = JSON.parse(data)

                        function randomScore(a, b, c) {
                            let x = Math.floor(((a + b) / 2) + randomNumber(-c, c))

                            if (x < 0) {
                                return 0
                            } else {
                                return x
                            }
                        }

                        async function Predict() {
                            try {
                                let a = await getPrediction(SPORT, LEAGUE, ABBR)

                                ABBR = a.opponent
                                team1 = a.fullName
                                team1Name = a.shortName
                                team1PF = a.pf
                                team1PA = a.pa
                                lastDate = a.eventDate

                                let b = await getPrediction(SPORT, LEAGUE, ABBR)
                                team2 = b.fullName
                                team2Name = b.shortName
                                team2PF = b.pf
                                team2PA = b.pa

                                team1Score = randomScore(team1PF, team2PA, variant)
                                team2Score = randomScore(team2PF, team1PA, variant)

                                if (team1Score === team2Score) {
                                    console.log('Tiebreak' + team1Score, team2Score)
                                    winningteam = randomNumber(1, 2)
                                    if (winningteam === 1) {
                                        team1Score = (team1Score + randomNumber(1, 2))
                                    } else {
                                        team2Score = (team2Score + randomNumber(1, 2))
                                    }
                                }

                                message.channel.send(team1Name + ' ' + team1Score + ' - ' + team2Name + ' ' + team2Score)
                                scores.fuyumi.prediction.push([team1, team1Name, team1Score, team2, team2Name, team2Score, lastDate])

                                fs.writeFile('fuyumipredictions.json', JSON.stringify(scores), (err) => {
                                    if (err) throw err;

                                })

                            } catch (err) {
                                console.log(err)
                            }
                        }

                        newpredict = 0
                        for (let i = 0; i < scores.fuyumi.prediction.length; i++) {
                            if (scores.fuyumi.prediction[i].includes(squad)) {
                                if ((new Date().getTime()) - (Date.parse(scores.fuyumi.prediction[i][6])) < 5400000) {
                                    if (scores.fuyumi.prediction[i][5] >= scores.fuyumi.prediction[i][2]) {
                                        message.channel.send(scores.fuyumi.prediction[i][4] + ' ' + scores.fuyumi.prediction[i][5] + ', ' + scores.fuyumi.prediction[i][1] + ' ' + scores.fuyumi.prediction[i][2])
                                    } else {
                                        message.channel.send(scores.fuyumi.prediction[i][1] + ' ' + scores.fuyumi.prediction[i][2] + ', ' + scores.fuyumi.prediction[i][4] + ' ' + scores.fuyumi.prediction[i][5])
                                    }

                                    newpredict = 1
                                    break;
                                } else {
                                    console.log(scores.fuyumi.prediction.splice(i, 1))
                                    Predict()
                                    newpredict = 1
                                }
                            }
                        }

                        if (newpredict === 0) {
                            console.log(SPORT, LEAGUE, ABBR)
                            Predict()
                        }

                        async function getPrediction(sport, league, abbr) {
                            try {
                                const req = await fetch('http://site.api.espn.com/apis/site/v2/sports/' + sport + '/' + league + '/teams/' + abbr, {
                                    method: 'get',
                                    headers: {},
                                    redirect: 'follow'
                                });

                                espn = await req.json()

                                if (espn.team.nextEvent[0] != undefined) {

                                    pf = espn.team.record.items[0].stats[3].value
                                    pa = espn.team.record.items[0].stats[2].value
                                    eventDate = espn.team.nextEvent[0].date

                                    if (espn.team.nextEvent[0].competitions[0].competitors[0].team.abbreviation === abbr) {
                                        fullName = espn.team.nextEvent[0].competitions[0].competitors[0].team.displayName
                                        shortName = espn.team.nextEvent[0].competitions[0].competitors[0].team.shortDisplayName
                                        opponent = espn.team.nextEvent[0].competitions[0].competitors[1].team.abbreviation
                                    } else {
                                        fullName = espn.team.nextEvent[0].competitions[0].competitors[1].team.displayName
                                        shortName = espn.team.nextEvent[0].competitions[0].competitors[1].team.shortDisplayName
                                        opponent = espn.team.nextEvent[0].competitions[0].competitors[0].team.abbreviation
                                    }

                                    return { fullName, shortName, opponent, pf, pa, eventDate }
                                } else {
                                    return Promise.reject('Fuyumi Promise Error')
                                }
                            } catch (err) {
                                console.log('Fuyumi Error')
                                console.log(err)
                            }

                        }

                    })
                }), 1000
            }
        }

        if (message.channel.name === 'test' && message.content.includes(' would like their birthday removed')) {
            message.react('🍰')
        }

    } else {
        console.log(message)
    }

});

// Gets Fuyumi to remind the special snowflake it ain't their birthday anymore

client.on('guildMemberUpdate', (oldMember, newMember) => {
    if (oldMember._roles.includes('379807620141154314') && !newMember._roles.includes('379807620141154314'))
        client.channels.cache.get('172252229145853953').send(('Alright, ' + newMember.user.username + '\'s party is over. You can go home now'))
});

// Gets Fuyumi to take away the Birthday Weeb role at the end of the day

schedule.scheduleJob('58 59 23 * * *', function () {
    fs.readFile('birthdays.json', 'utf8', (err, data) => {
        birthday = JSON.parse(data)
        function twoNumbs(Input) {
            return Input > 9 ? Input.toString() : "0" + Input.toString()
        }

        date = new Date
        date = twoNumbs(date.getMonth()) + twoNumbs(date.getDate())
        if (birthday[date] != undefined) {
            for (i = 0; i < birthday[date].ID.length; i++) {
                guild = client.guilds.cache.get('172065393525915648')
                if (guild.members.cache.get(birthday[date].ID[i]) != null && guild.members.cache.get(birthday[date].ID[i]) != undefined) {
                    client.guilds.cache.get('172065393525915648').members.cache.get(birthday[date].ID[i]).roles.remove('379807620141154314')
                }
            }
            //birthday[date].Posted = "0"
            //fs.writeFile('birthdays.json', JSON.stringify(birthday), (err)=>{
            //if (err) throw err;
            //else console.log('Role removed')
            //})
        }
    })
});

//Fuyumi takes away the tts role

schedule.scheduleJob('0 58 23 * * *', function () {
    randomUser = client.guilds.cache.get('172065393525915648').roles.cache.get('762186129918394399').members.keys().next().value
    //console.log(randomUser)
    if (randomUser != undefined) {
        client.guilds.cache.get('172065393525915648').members.cache.get(randomUser).roles.remove('762186129918394399');
    }
});