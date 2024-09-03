// Import packages/set variables (constants)

const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers], partials: ["CHANNEL"] });
const schedule = require('node-schedule');
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');
var oauth = require('./oauth.js');
const { EmbedBuilder } = require('discord.js');
const path = require('node:path');
const wait = require('node:timers/promises').setTimeout;

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

//Each discord bot has a unique token
client.login(oauth.FuyumiToken);

// Creates an event listener for bot ready-state
client.on('ready', () => {
    let d = new Date();
    let time = (d.getHours()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ':' + (d.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })) + ':' + (d.getSeconds()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ' -'
    console.log(`${time} bot running`)
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'fuyumicommands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    // if (interaction.commandName === 'stats' || interaction.commandName === 'leaderboard') {
    // 	await interaction.deferReply();
    // 	await wait(4000);
    // 	await interaction.editReply('Pong!');
    // }

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

// Creates an event listener for messages
client.on('messageCreate', message => {

    //console.log(message)

    splt = message.content.split(" ");
    spl = message.content.split("?");
    var teamGet = spl.join(" ");
    //console.log(teamGet.slice(4, -5))

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
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

        if (message.content.includes('Oh wow. A leap year baby!')) {
            if (message.author.username == 'Kirika') {
                message.channel.send('You were not born on February 29th you damn liar.')
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
            console.log(message)
            if (!isNaN(message.content[7])) {
                if (message.content[13] === 'X' || Number(message.content[13]) < 7) {
                    let id = message.author.id
                    let name = message.author.username
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

                        if (message.content[13] != 'X') {
                            guesses = Number(message.content[13])
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
                            wordle[id].USERNAME = name
                        }

                        if (score < wordle[id].bestSCORE) {
                            wordle[id].bestSCORE = score
                        }

                        if (message.content[13] != 'X') {
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

        if (message.channelId === '931407561792565280' && splt[0] === 'Wordle') {
            if (!isNaN(message.content[7])) {
                id = message.author.id

                fs.readFile('pastgames.json', 'utf8', (err, data) => {
                    wordle = JSON.parse(data)

                    if (wordle[splt[1].replaceAll(',', '')] === undefined) {
                        wordle[splt[1].replaceAll(',', '')] = [[id, splt[2]]]
                    } else {
                        wordle[splt[1].replaceAll(',', '')].push([id, splt[2]])
                    }

                    fs.writeFile('pastgames.json', JSON.stringify(wordle), (err) => {
                        if (err) throw err;
                    })
                })
            }
        }

        if (message.channelId === '931407561792565280') {
            if (message.content.toLowerCase() === '!stats') {
                message.channel.send('It\'s a slash command now. Just do /stats')
            }
        }

        if (message.channelId === '931407561792565280') {
            if (message.content.toLowerCase() === '!leaderboard') {
                message.channel.send('It\'s a slash command now. Just do /leaderboard')
            }
        }

        if (message.channelId === '607815006633066496') {
            if (message.content.toLowerCase() === '!test') {
                fs.readFile('wordlescores.json', 'utf8', (err, data) => {
                    wordle = JSON.parse(data)
                    let WordleEntries = Object.entries(wordle)

                    console.log(WordleEntries[1][0])


                })
            }
        }

        if (message.channelId === '608509082835484702') {
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
                        if (LEAGUE === 'wnba') {
                            SPORT = 'basketball'
                            variant = 10
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

                                    if ((new Date().getTime()) - (Date.parse(lastDate)) > -604800000) {
                                        if ((new Date().getTime()) - (Date.parse(lastDate)) < 0) {
                                            client.channels.cache.get('299346622985273344').send(team1Name + ' ' + team1Score + ' - ' + team2Name + ' ' + team2Score)
                                            scores.fuyumi.prediction.push([team1, team1Name, team1Score, team2, team2Name, team2Score, lastDate])
                                        }
                                    }

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
                                            client.channels.cache.get('299346622985273344').send(scores.fuyumi.prediction[i][4] + ' ' + scores.fuyumi.prediction[i][5] + ', ' + scores.fuyumi.prediction[i][1] + ' ' + scores.fuyumi.prediction[i][2])
                                        } else {
                                            client.channels.cache.get('299346622985273344').send(scores.fuyumi.prediction[i][1] + ' ' + scores.fuyumi.prediction[i][2] + ', ' + scores.fuyumi.prediction[i][4] + ' ' + scores.fuyumi.prediction[i][5])
                                        }
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

schedule.scheduleJob('0 0 0 1 * *', function () {
    fs.readFile('wordlescores.json', 'utf8', (err, data) => {
        wordle = JSON.parse(data)
        leaderboard = []
        let WordleEntries = Object.entries(wordle)

        const month = ["December", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November"]
        const date = new Date()
        let name = month[date.getMonth()]
        let year = date.getFullYear();
        let mthyr = `${name} ${year}`

        for (let i = 0; i < WordleEntries.length; i++) {
            if (WordleEntries[i][1].GAMES > 9) {
                leaderboard.push([Math.round((WordleEntries[i][1].SCORE / WordleEntries[i][1].GAMES + Number.EPSILON) * 1000) / 1000, WordleEntries[i][0], WordleEntries[i][1].GAMES + ' games)'])
            }
        }

        leaderboard = leaderboard.sort((firstItem, secondItem) => firstItem[0] - secondItem[0])

        fs.readFile('leaderboardhistory.json', 'utf8', (err, data2) => {
            history = JSON.parse(data2)

            history[mthyr] = { leaderboard }

            fs.writeFile('leaderboardhistory.json', JSON.stringify(history), (err) => {
                var d = new Date();
                var time = (d.getHours()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ':' + (d.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })) + ':' + (d.getSeconds()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ' -'
                if (err) throw err;
                console.log(`${time} Stored this month's wordle leaderboard.`)
            })
        })

        for (let i = 0; i < WordleEntries.length; i++) {
            WordleEntries[i][1].SCORE = 0
            WordleEntries[i][1].GUESSES = 0
            WordleEntries[i][1].GAMES = 0
            WordleEntries[i][1].FAILURES = 0
        }

        fs.writeFile('wordlescores.json', JSON.stringify(wordle), (err) => {
            var d = new Date();
            var time = (d.getHours()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ':' + (d.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })) + ':' + (d.getSeconds()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ' -'
            if (err) throw err;
            console.log(`${time} Wordle scores reset.`)
        })
    })
});

schedule.scheduleJob('5 0 2 * * *', function () {
    fs.readFile('fuyumipredictions.json', 'utf8', (err, data) => {
        scores = JSON.parse(data)
        let x = 0
        let total = 0

        if (scores.fuyumi != undefined) {
            for (i = scores.fuyumi.prediction.length - 1; i >= 0; i--) {
                total++
                if (((new Date().getTime()) - (Date.parse(scores.fuyumi.prediction[i][6]))) > 0) {
                    scores.fuyumi.prediction.splice(i, 1)
                    x++
                }
            }

            fs.writeFile('fuyumipredictions.json', JSON.stringify(scores), (err) => {
                var d = new Date();
                var time = (d.getHours()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ':' + (d.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })) + ':' + (d.getSeconds()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ' -'
                if (err) throw err;
                console.log(`${time} Removed ${x} of ${total} predictions`)
            })
        }
    })
});