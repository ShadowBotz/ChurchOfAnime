// Import packages/set variables (constants)
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS], partials: ["CHANNEL"] });
const schedule = require('node-schedule');
const fs = require('fs');
var oauth = require('./oauth.js')

//Each discord bot has a unique token
client.login(oauth.FuyumiID);

// Creates an event listener for bot ready-state
client.on('ready', () => {
    console.log('bot running')
});

// Creates an event listener for messages
client.on('messageCreate', message => {

    splt = message.content.split(" ")

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
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

                        for (var i = 2; i < count.length; i++) {
                            for (var j = 0; j < count[i].length; j++) {
                                if (count[i][j] === '⬛' || count[i][j] === '⬜') {
                                    score = score + 3
                                } else if (count[i][j].charCodeAt(0).toString(16) === 'd83d' || count[i][j].charCodeAt(0).toString(16) === 'dfe6' || count[i][j].charCodeAt(0).toString(16) === 'dfe8') { //dfe6 and dfe8 refer to yellow and blue squares
                                    score = score + 1
                                }
                            }
                        }

                        if (message.content[11] != 'X') {
                            message.channel.send(score + ' points.')
                            guesses = Number(message.content[11])
                        } else {
                            message.channel.send('Lol. I got it in ' + randomNumber(1, 6) + '. ' + score + ' points.')
                            failures = 1
                            guesses = 7
                        }

                        if (wordle[id] === undefined) {
                            wordle[id] = { "SCORE": score, "GUESSES": guesses, "GAMES": 1, "FAILURES": failures }
                        } else {
                            wordle[id].SCORE = wordle[id].SCORE + score
                            wordle[id].GUESSES = wordle[id].GUESSES + guesses
                            wordle[id].GAMES = wordle[id].GAMES + 1
                            wordle[id].FAILURES = wordle[id].FAILURES + failures
                        }

                        fs.writeFile('wordlescores.json', JSON.stringify(wordle), (err) => {
                            if (err) throw err;
                        })
                    })
                }
            }
        }

        if (message.channelId === '931407561792565280'){
            if (message.content.toLowerCase() === '!average'){

                fs.readFile('wordlescores.json', 'utf8', (err, data) => {
                    id = message.author.id
                    wordle = JSON.parse(data)

                    message.channel.send('Your Wordle guess average is ' + wordle[id].GUESSES/wordle[id].GAMES+'.')
                })
            }
        }

        if (message.channel.name === 'test' && message.author.username != 'Fuyumi') {
            console.log((message.content).charCodeAt(0).toString(16))
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