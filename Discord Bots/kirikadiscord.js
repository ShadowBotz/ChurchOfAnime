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

//Each discord bot has a unique token
client.login(oauth.KirikaToken);

// Creates an event listener for bot ready-state
client.on('ready', () => {
    var d = new Date();
    var time = (d.getHours()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ':' + (d.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })) + ':' + (d.getSeconds()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ' - '

    console.log(time + 'bot running')
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'kirikacommands');
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

    const command = interaction.client.commands.get(interaction.commandName);
    // if (interaction.commandName === 'addteam') {
	// 	await interaction.deferReply();
	// 	await wait(3000);
	// 	// await interaction.editReply('Pong!');
	// }

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
client.on("messageCreate", message => {
    //console.log(message)
    splt = message.content.split(" ")

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
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
            message.channel.send('Hang on. ESPN is being a baka <:beatzBaka:1167640027652698312> Try again in a second')
            console.log('getTeamInfo\n' + err)
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
                        userfandom.push([LeaguesEntries[i][0].toLowerCase(), TeamsEntries[j][0], SPORT, TeamsEntries[j][1].abbr])
                    }
                }
            }

            if (userfandom.length < 1) {
                message.channel.send('' + username(id) + ' hasn\'t told me who their favorite teams are yet <:beatzDespair:1019839939522859109> Maybe they don\'t like sports')
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
                        .setThumbnail(client.guilds.cache.get('172065393525915648').members.cache.get(id).user.displayAvatarURL())
                        .addFields(
                            { name: '=======================================', value: teamarray.join().replaceAll(',', '') }
                        )

                    message.channel.send({ embeds: [teamsEmbed] })
                }
            }
        })
    }

    if (message.channel.type != undefined && message.author != null) {
        if (message.content === '!alerts' && message.author != undefined) {
            //console.log(client.guilds.cache.get('172065393525915648'))
            client.guilds.cache.get('172065393525915648').members.cache.get(message.author.id).roles.add('607809003665489930')
                .then(message.channel.send('You have been added to the alerts list <:KirikaSmile:608201680374464532>'))
                .then(console.log('alerts role added for ' + message.author.username + ''))
                .catch(console.error);
        }

        if (message.content === '!vtubeon' && message.author != undefined) {
            //console.log(client.guilds.cache.get('172065393525915648'))
            client.guilds.cache.get('172065393525915648').members.cache.get(message.author.id).roles.add('859218117833916437')
                .then(message.channel.send('Welcome to the official Church of Anime v-tuber ~~simp~~ fan club <:KirikaSmile:608201680374464532>'))
                .then(console.log('v-tube role added for ' + message.author.username + ''))
                .catch(console.error);
        }

        if (message.channel.id === '608509082835484702' && message.author.id === '124044415634243584') {
            yeet = message.content.split(" ")
            poundDel = yeet[1].substring(2, yeet[1].length - 1)
            if (yeet[0] === 'kirika') {
                client.channels.cache.get(poundDel).send(yeet.slice(2).join(' '))
            }
        }

        if (message.channelId === '175925024098746369' && message.content.includes('||') && !message.content.includes('(')) {
            message.channel.send({ content: 'Hey, if that\'s a spoiler, could you put what show it is outside of the spoiler so people can know not to click if they don\'t want it spoiled? <:KirikaSmile:608201680374464532>', embeds: [] });
        }

        sup = message.content.toLowerCase()
        //   console.log(sup)
        if (sup.includes('hi ') || sup.includes('hey ') || sup.includes('greetings ') || sup.includes('ohayo ') || sup.includes('konbanwa ') || sup.includes('hello ')) {
            if (message.author.id != '607807501722845202') {
                if (sup.includes('kirika')) {
                    try {
                        message.channel.send('Hi <@' + message.author.id + '> <:KirikaSmile:608201680374464532>')
                    }
                    catch (error) {
                        console.log(error)
                    }
                }
            }

        }

        if (message.channelId === '931407561792565280' && message.content.includes('6/6')) {
            message.channel.send('<@' + message.author.id + '> close one <:monkaW:717247350397075466>')
        }

        if (message.channel.name === 'general') {
            message.react('📦');
        }

        if (message.content.includes('!bd')) {
            if (message.content.substring(0, 3) === '!bd') {
                if (message.author.username === 'ShadowBeatz') {
                    fs.readFile('birthdays.json', 'utf8', (err, data) => {
                        cake = message.content.split(" ")
                        birthday = JSON.parse(data)


                        if (birthday[cake[1]] === undefined) {
                            birthday[cake[1]] = { "ID": cake[2].match(/([0-9])+/g) }
                            fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
                                if (err) throw err;
                            })
                        } else {
                            birthday[cake[1]].ID.push(cake[2].match(/([0-9])+/g))
                            fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
                                if (err) throw err;
                            })
                        }
                    })
                }

                if (message.author.username != 'ShadowBeatz') {
                    fs.readFile('birthdays.json', 'utf8', (err, data) => {
                        cake = message.content.split(" ")
                        birthday = JSON.parse(data)
                        AID = message.author.id


                        temp = 0
                        Object.keys(birthday).forEach(function (key) {
                            if (birthday[key].ID.includes(AID)) {
                                temp = temp + 1
                            }
                        })

                        if (temp == 0) {
                            if (cake[2] != undefined) {
                                month = cake[1].toLowerCase()
                                day = cake[2]
                                function twoNumbs(Input) {
                                    return Input.toString().length > 1 ? Input.toString() : "0" + Input.toString()
                                }

                                if (month === 'jan') {
                                    month = '00'
                                } else if (month === 'feb') {
                                    month = '01'
                                } else if (month === 'mar') {
                                    month = '02'
                                } else if (month === 'apr') {
                                    month = '03'
                                } else if (month === 'may') {
                                    month = '04'
                                } else if (month === 'jun') {
                                    month = '05'
                                } else if (month === 'jul') {
                                    month = '06'
                                } else if (month === 'aug') {
                                    month = '07'
                                } else if (month === 'sep') {
                                    month = '08'
                                } else if (month === 'oct') {
                                    month = '09'
                                } else if (month === 'nov') {
                                    month = '10'
                                } else if (month === 'dec') {
                                    month = '11'
                                } else {
                                    month = 'undefined'
                                }

                                bday = month + twoNumbs(day)

                                if (month === 'undefined') {
                                    message.channel.send('I\'m sorry, you\'re going to have to help me out here. I was shot in the head after all <:KirikaSmile:608201680374464532> Try formatting your birthday with the first 3 letters of the month, then two digits for the day. Like "Jun 09"')
                                } else if (["00", "02", "04", "06", "07", "09", "11"].includes(month)) {
                                    if (day < "32") {
                                        if (birthday[bday] === undefined) {
                                            birthday[bday] = { "ID": [AID] }
                                            setTimeout(() => {
                                                fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
                                                    if (err) throw err;
                                                })
                                            }, 2000)
                                        } else {
                                            birthday[bday].ID.push(AID)
                                            setTimeout(() => {
                                                fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
                                                    if (err) throw err;
                                                })
                                            }, 2000)
                                        }
                                        message.channel.send('Got it <:KirikaSmile:608201680374464532>')
                                    } else {
                                        message.channel.send('Funny joke but please enter a day that actually exists. You won\'t get the pretty gold name otherwise <:KirikaSmile:608201680374464532>')
                                    }
                                } else if (["03", "05", "08", "10"].includes(month)) {
                                    if (day < "31") {
                                        if (birthday[bday] === undefined) {
                                            birthday[bday] = { "ID": [AID] }
                                            setTimeout(() => {
                                                fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
                                                    if (err) throw err;
                                                })
                                            }, 2000)
                                        } else {
                                            birthday[bday].ID.push(AID)
                                            setTimeout(() => {
                                                fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
                                                    if (err) throw err;
                                                })
                                            }, 2000)
                                        }
                                        message.channel.send('Got it <:KirikaSmile:608201680374464532>')
                                    } else {
                                        message.channel.send('Funny joke but please enter a day that actually exists. You won\'t get the pretty gold name otherwise <:KirikaSmile:608201680374464532>')
                                    }
                                } else if (month === "01") {
                                    if (day < "29") {
                                        if (birthday[bday] === undefined) {
                                            birthday[bday] = { "ID": [AID] }
                                            setTimeout(() => {
                                                fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
                                                    if (err) throw err;
                                                })
                                            }, 2000)
                                        } else {
                                            birthday[bday].ID.push(AID)
                                            setTimeout(() => {
                                                fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
                                                    if (err) throw err;
                                                })
                                            }, 2000)
                                        }
                                        message.channel.send('Got it <:KirikaSmile:608201680374464532>')
                                    } else if (day === "29") {
                                        if (birthday[bday] === undefined) {
                                            birthday[bday] = { "ID": [AID] }
                                            setTimeout(() => {
                                                fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
                                                    if (err) throw err;
                                                })
                                            }, 2000)
                                        } else {
                                            birthday[bday].ID.push(AID)
                                            setTimeout(() => {
                                                fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
                                                    if (err) throw err;
                                                })
                                            }, 2000)
                                        }
                                        message.channel.send('Oh wow. A leap year baby! <:KirikaSmile:608201680374464532>')
                                    } else {
                                        message.channel.send('Funny joke but please enter a day that actually exists. You won\'t get the pretty gold name otherwise <:KirikaSmile:608201680374464532>')
                                    }
                                }
                            } else {
                                message.channel.send('spacebars help <:KirikaSmile:608201680374464532> Just like this: !bd Apr 20')
                            }

                        } else {
                            temp = 0
                        }

                    })
                }
            }
        }



        switch (splt[0]) {
    	case "!addteam":
    		message.channel.send('"!addteam" is a fancy slash command now <:KirikaSmile:608201680374464532> Try /addteam to register your favorite teams')
    		break;
        case "!fans":
            message.channel.send('"!fans" is a fancy slash command now <:KirikaSmile:608201680374464532> Try /fans')
            break;
        case "!teams":
    		message.channel.send('"!teams" is a fancy slash command now <:KirikaSmile:608201680374464532> Try /teams')
    		break;
        case "!scores":
    		message.channel.send('"!scores" is a fancy slash command now <:KirikaSmile:608201680374464532> Try /scores')
    		break;
        case "!teamscores":
    		message.channel.send('"!teamscores" is a fancy slash command now <:KirikaSmile:608201680374464532> Try /teamscores')
    		break;
        case "!myscores":
    		message.channel.send('"!myscores" is a fancy slash command now <:KirikaSmile:608201680374464532> Try /myscores')
    		break;
        case "!livescores":
    		message.channel.send('"!livescores" is a fancy slash command now <:KirikaSmile:608201680374464532> Try /livescores')
    		break;
        case "!fansplits":
    		message.channel.send('"!fansplits" is a fancy slash command now <:KirikaSmile:608201680374464532> Try /fansplits')
    		break;	
    	}     

        if (splt[0] === '!prediction') {
            squad = TitleCase(splt.slice(1).join(' '))
            console.log(squad)
            SPORT = undefined
            LEAGUE = undefined
            ABBR = undefined

            if (squad === '') {
                message.channel.send('<@' + message.author.id + '> You gotta tell me which team you want my prediction for <:KirikaSmile:608201680374464532>')
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
                        message.channel.send('I\'m sorry, I don\'t recognize that team <:KirikaSmile:608201680374464532> Make sure you\'re including both the city *and* team name and you\'re using the official team spelling as well')
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
                                for (let i = 0; i < scores.kirika.prediction.length; i++) {
                                    if (scores.kirika.prediction[i].includes(squad)) {
                                        if ((new Date().getTime()) - (Date.parse(scores.kirika.prediction[i][6])) < 5400000) {
                                            message.channel.send(scores.kirika.prediction[i][4] + ' ' + scores.kirika.prediction[i][5] + ', ' + scores.kirika.prediction[i][1] + ' ' + scores.kirika.prediction[i][2] + ' <:beatzWICKED:1165575471153549342>')
                                            newpredict = 1
                                        } else {
                                            console.log(scores.kirika.prediction.splice(i, 1))
                                            getPrediction(SPORT, LEAGUE, ABBR)
                                            newpredict = 1
                                        }
                                    }
                                }

                                if (newpredict === 0) {
                                    console.log(SPORT, LEAGUE, ABBR, '2')
                                    getPrediction(SPORT, LEAGUE, ABBR)
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
                                                    message.channel.send('It seems the ' + squad + ' are on a bye this week <:KirikaSmile:608201680374464532>')
                                                }
                                            } else if ((new Date().getTime()) - (Date.parse(eventDate)) > 0) {
                                                message.channel.send('I don\'t know who they\'re playing next. Try again when the season gets closer <:KirikaSmile:608201680374464532>')
                                            } else {
                                                prediction.push(hometeam, homename, homescore, awayteam, awayname, awayscore, eventDate)
                                                message.channel.send('Hmmmmm..... I\'m thinkin ' + awayname + ': ' + awayscore + ' - ' + homename + ': ' + homescore + ' <:KirikaSmile:608201680374464532>')
                                            }

                                            if (prediction.length > 0) {
                                                scores.kirika.prediction.push(prediction)
                                            }


                                            fs.writeFile('kirikapredictions.json', JSON.stringify(scores), (err) => {
                                                if (err) throw err;

                                            })

                                            resolve(hometeam, homescore, awayteam, awayscore, eventDate)
                                        } else {
                                            reject()
                                        }
                                    } catch (err) {
                                        message.channel.send('Hang on. ESPN is being a baka <:beatzBaka:1167640027652698312> Try again in a second')
                                        console.log(err)
                                    }
                                })
                            }

                        })
                    }
                }, 1000)
            }
        }

        if (message.channelId === '931407561792565280' && splt[0] === 'Wordle') {
            if (!isNaN(message.content[7])) {
                if (message.content[11] === 'X' || Number(message.content[11]) < 7) {
                    id = message.author.id

                    setTimeout(() => {
                        fs.readFile('wordlescores.json', 'utf8', (err, data) => {
                            wordle = JSON.parse(data)

                            if (wordle[id].careerGAMES === 1) {
                                message.channel.send('<@' + message.author.id + '> Hey <:KirikaSmile:608201680374464532> Looks like you\'re new to the database! If you want, you can paste a screenshot of your Wordle stats in here and we can get your career logged <:beatzHYPE:1165575358079303680> You could even ping ShadowBeatz if you want <:beatzWICKED:1165575471153549342>')
                            }
                        })
                    }, 3000)
                }
            }
        }

        if (message.content.includes('!at')) {
            //console.log(message.content)
            console.log(client.guilds.cache.get('172065393525915648').members.cache.get('124044415634243584'))
        }

        if (message.content.includes('!get') && message.channel.name === ('test')) {
            randomUser = message.guild.members.random();
            tts = randomUser.id;
            console.log(tts)
        }

    } else {
        //console.log(message)
    }
});

// Assigns the streamer role to anyone live on Twitch

streamingrn = 0

client.on('presenceUpdate', (oldMember, newMember) => {
    if (oldMember != null) {

        var d = new Date();
        var time = (d.getHours()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ':' + (d.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })) + ':' + (d.getSeconds()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ' - '

        if (newMember.userId === '124044415634243584') {
            // console.log(newMember)
            // console.log(newMember.activities[0])
        }

        // if (newMember.activities[0] != undefined){
        //   if (newMember.activities[0].type === 'CUSTOM_STATUS'){
        //     console.log(newMember.activities)
        //     console.log(client.guilds.cache.get('172065393525915648').members.cache.get(newMember.userId).user.username)
        //   }
        // }  

        a = newMember.activities[0]
        b = oldMember.activities[0]
        currentlyStreaming = 0
        beenStreaming = 0

        if (a != undefined) {
            newMember.activities.forEach((element, index) => {
                if (element.type === 1) {
                    currentlyStreaming += 1
                }
            })
        }

        if (b != undefined) {
            oldMember.activities.forEach((element, index) => {
                if (element.type === 1) {
                    beenStreaming += 1
                }
            })
        }

        // if (newMember.userId === '124044415634243584') {
        //     if (a === undefined && oldMember.activities[0] != undefined) {
        //         if (oldMember.activities[0].type === 'STREAMING') {
        //             client.channels.cache.get('607817203588268062').send(('The stream is over, but if you missed it, you can watch the stream on the new VOD channel here (just give it an hour or two, depending on the length of the stream <:KirikaSmile:608201680374464532>) https://www.youtube.com/channel/UCkQBMVEYiDg3jqc2mcjlThA'))
        //         }
        //     }
        // }

        if (currentlyStreaming >= 1) {
            client.guilds.cache.get('172065393525915648').members.cache.get(newMember.userId).roles.add('610621341984489472')
            // if (a.type === 'STREAMING'){
            if (beenStreaming === 0) {
                streamingrn += 1
                console.log(time + client.guilds.cache.get('172065393525915648').members.cache.get(newMember.userId).user.username + ' started streaming (' + streamingrn + ')')
                if (newMember.userId === '124044415634243584') {
                    if (oldMember.activities[0] != undefined) {
                        if (oldMember.activities[0].type != 1) {
                            client.channels.cache.get('607817203588268062').send(('<@&607809003665489930> Streaming some ' + a.state + ' <:KirikaSmile:608201680374464532> "' + a.details + '" http://www.twitch.tv/ShadowBeatz'))
                        }
                    }
                    if (oldMember.activities[0] === undefined) {
                        client.channels.cache.get('607817203588268062').send(('<@&607809003665489930> Streaming some ' + a.state + ' <:KirikaSmile:608201680374464532> "' + a.details + '" http://www.twitch.tv/ShadowBeatz'))
                    }
                    console.log(newMember.activities[0])
                }
                // }  
            }
        } else {
            if (client.guilds.cache.get('172065393525915648').members.cache.get(newMember.userId) != undefined) {
                if (client.guilds.cache.get('172065393525915648').members.cache.get(newMember.userId)._roles.includes('610621341984489472')) {
                    client.guilds.cache.get('172065393525915648').members.cache.get(newMember.userId).roles.remove('610621341984489472')
                    streamingrn -= 1
                    console.log(time + client.guilds.cache.get('172065393525915648').members.cache.get(newMember.userId).user.username + ' stopped streaming (' + streamingrn + ')')
                }
            }//else{
            // 	console.log(newMember)
            // 	 }
        }


        if (a === undefined && oldMember != null) {
            if (oldMember.activities[0] != undefined) {
                if (oldMember.activities[0].type === 1) {
                    if (client.guilds.cache.get('172065393525915648').members.cache.get(newMember.userId) != undefined) {
                        client.guilds.cache.get('172065393525915648').members.cache.get(newMember.userId).roles.remove('610621341984489472')
                        //console.log(time+client.guilds.cache.get('172065393525915648').members.cache.get(newMember.userId).user.username+' stopped streaming')
                    }
                }
            }
        }
    }
});

// Gets Kirika to say Happy Birthday

client.on('guildMemberUpdate', (oldMember, newMember) => {
    if (newMember._roles.includes('379807620141154314') && !oldMember._roles.includes('379807620141154314')) {
        client.channels.cache.get('172252229145853953').send(('Happy Birthday <@' + newMember.user.id + '> <:KirikaSmile:608201680374464532> :cake:'))
    }

});

// Gets Kirika to say "good morning"

schedule.scheduleJob('2 0 8 * * *', function () {
    client.channels.cache.get('172252229145853953').send(('Good morning <:KirikaSmile:608201680374464532>'))
});

// Gets Kirika to give the Birthday Weeb role to whoever's birthday it is

schedule.scheduleJob('2 0 0 * * *', function () {
    fs.readFile('birthdays.json', 'utf8', (err, data) => {
        birthday = JSON.parse(data)
        function twoNumbs(Input) {
            return Input > 9 ? Input.toString() : "0" + Input.toString()
        }

        date = new Date
        date = twoNumbs(date.getMonth()) + twoNumbs(date.getDate())
        //console.log(client.fetchUser('214954544444997632'))
        if (birthday[date] != undefined) {
            for (i = 0; i < birthday[date].ID.length; i++) {
                guild = client.guilds.cache.get('172065393525915648')
                if (guild.members.cache.get(birthday[date].ID[i]) != null && guild.members.cache.get(birthday[date].ID[i]) != undefined) {
                    client.guilds.cache.get('172065393525915648').members.cache.get(birthday[date].ID[i]).roles.add('379807620141154314')
                }
            }
            //birthday[date].Posted = "1"
            //fs.writeFile('birthdays.json', JSON.stringify(birthday), (err)=>{
            //if (err) throw err;
            //else console.log('Role added')
            //})
        }
    })
});

schedule.scheduleJob('10 0 0 10 10 *', function () {
    client.channels.cache.get('172252229145853953').send(('Happy Birthday <@171887129637552128>\'s daughter <:KirikaSmile:608201680374464532> :cake:'))
});

//Kirika assigns the tts role randomly at midnight

schedule.scheduleJob('0 1 0 * * *', function () {
    randomUser = client.guilds.cache.get('172065393525915648').members.cache.random();
    tts = randomUser.id;
    Weeb = client.guilds.cache.get('172065393525915648').members.cache.get(tts).user.username;

    if (tts != '607807501722845202' || tts != '607824305119821855') { //makes sure Kirika or Fuyumi can't be weeb of the day
        client.guilds.cache.get('172065393525915648').members.cache.get(tts).roles.add('762186129918394399');
        client.channels.cache.get('607815006633066496').send('' + Weeb + ' (ID: ' + tts + ') is the weeb of the day <:KirikaSmile:608201680374464532>')
    }
});