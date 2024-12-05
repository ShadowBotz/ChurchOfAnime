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
var d = new Date();
var time = (d.getHours()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ':' + (d.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })) + ':' + (d.getSeconds()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ' - '

let pokerGameInProgress = 0
let players = []

last_use = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let cards = ['A :clubs:', 'A :diamonds:', 'A :hearts:', 'A :spades:', '2 :clubs:', '2 :diamonds:', '2 :hearts:', '2 :spades:', '3 :clubs:', '3 :diamonds:', '3 :hearts:', '3 :spades:', '4 :clubs:', '4 :diamonds:', '4 :hearts:', '4 :spades:', '5 :clubs:', '5 :diamonds:', '5 :hearts:', '5 :spades:', '6 :clubs:', '6 :diamonds:', '6 :hearts:', '6 :spades:', '7 :clubs:', '7 :diamonds:', '7 :hearts:', '7 :spades:', '8 :clubs:', '8 :diamonds:', '8 :hearts:', '8 :spades:', '9 :clubs:', '9 :diamonds:', '9 :hearts:', '9 :spades:', '10 :clubs:', '10 :diamonds:', '10 :hearts:', '10 :spades:', 'J :clubs:', 'J :diamonds:', 'J :hearts:', 'J :spades:', 'Q :clubs:', 'Q :diamonds:', 'Q :hearts:', 'Q :spades:', 'K :clubs:', 'K :diamonds:', 'K :hearts:', 'K :spades:']

const dealHand = (handSize, deck) => {
    let hand = []

    for (let i = 0; i < handSize; i++) {
        hand.push(deck.splice(randomNumber(0, (deck.length - 1)), 1))
    }

    return hand
}

const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const TitleCase = (Input) => {
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

const username = (Input) => {
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

    if (interaction.commandName === 'teams') {
        await interaction.deferReply();
        await command.execute(interaction)
    }

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

    if (message.channel.type != undefined && message.author != null) {
        if (message.content === '!alerts' && message.author != undefined) {
            //console.log(client.guilds.cache.get('172065393525915648'))
            client.guilds.cache.get('172065393525915648').members.cache.get(message.author.id).roles.add('607809003665489930')
                .then(message.channel.send('You have been added to the alerts list <:KirikaSmile:608201680374464532>'))
                .then(console.log('alerts role added for ' + message.author.username + ''))
                .catch(console.error);
        }

        if (message.content === '!ass' && message.author != undefined) {
            //console.log(client.guilds.cache.get('172065393525915648'))
            client.guilds.cache.get('172065393525915648').members.cache.get(message.author.id).roles.add('1307307788690788372')
                .then(message.channel.send('You have been added to the A.S.S. (Anime Session Squad) <:KirikaSmile:608201680374464532>'))
                .then(console.log('anime squad role added for ' + message.author.username + ''))
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

        switch (splt[0]) {
            case "!addteam":
                message.channel.send('"!addteam" is a fancy slash command now <:KirikaSmile:608201680374464532> Try /addteam to register your favorite teams')
                break;
            case "!bd":
                message.channel.send('The birthday command is a fancy slash command now <:KirikaSmile:608201680374464532> Try /birthday to add your birthday')
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
            case "!poker":
                message.channel.send('changed the command get fucked idiot')
                break;
            case "!prediction":
                if (message.author.id != '607807501722845202') { //kirika's ID
                    message.channel.send('I use a fancy slash command for !prediction now <:KirikaSmile:608201680374464532> Try /prediction')
                }
                break;
            case "!rope":
                fs.readFile('kirikapredictions.json', 'utf8', (err, data) => {
                    scores = JSON.parse(data)
                    let x = 0
                    let total = 0

                    for (i = scores.kirika.prediction.nfl.length - 1; i >= 0; i--) {
                        total++
                        if (((new Date().getTime()) - (Date.parse(scores.kirika.prediction.nfl[i][6]))) > 0) {
                            scores.kirika.prediction.nfl.splice(i, 1)
                            x++
                        }
                    }
        
                    for (i = scores.kirika.prediction.mlb.length - 1; i >= 0; i--) {
                        total++
                        if (((new Date().getTime()) - (Date.parse(scores.kirika.prediction.mlb[i][6]))) > 0) {
                            scores.kirika.prediction.mlb.splice(i, 1)
                            x++
                        }
                    }
        
                    fs.writeFile('kirikapredictions.json', JSON.stringify(scores), (err) => {
                        var d = new Date();
                        var time = (d.getHours()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ':' + (d.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })) + ':' + (d.getSeconds()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ' -'
                        if (err) throw err;
                        console.log(`${time} Removed ${x} of ${total} predictions :O`)
                    })
                })
                break;
            case "!noe":

                if (pokerGameInProgress === 0) {
                    let board = []
                    i = 2
                    message.channel.send('Poker hand has started KirikaSmile !poker to join. I\'ll deal the board in 30 seconds')
                    pokerGameInProgress = 1
                    board.push(dealHand(5, cards))
                    board.push([username(message.author.id), dealHand(2, cards)])

                    message.channel.send(`${board[1][1][0]} ${board[1][1][1]} ${board[1][0]}`)

                    players.push(username(message.author.id))

                    board[1][0] = [board[0][0], board[0][1], board[0][2], board[0][3], board[0][4], board[1][1][0], board[1][1][1], board[1][0]]

                    const spades = board[1][0].filter((card) => card.toString().includes(':spades:'))
                    const hearts = board[1][0].filter((card) => card.toString().includes(':hearts:'))
                    const clubs = board[1][0].filter((card) => card.toString().includes(':clubs:'))
                    const diamonds = board[1][0].filter((card) => card.toString().includes(':diamonds:'))

                    if (spades.length >= 5) {
                        board[1][0].push(5)
                    } else if (hearts.length >= 5) {
                        board[1][0].push(5)
                    } else if (clubs.length >= 5) {
                        board[1][0].push(5)
                    } else if (diamonds.length >= 5) {
                        board[1][0].push(5)
                    }

                    console.log(spades)

                    setTimeout(() => { message.channel.send('10 seconds KirikaSmile') }, 20000)

                    setTimeout(() => {
                        message.channel.send(`${board[0][0]} ${board[0][1]} ${board[0][2]}`)
                        message.channel.send(`${board[0][3]} ${board[0][4]}`)
                        cards = ['A :clubs:', 'A :diamonds:', 'A :hearts:', 'A :spades:', '2 :clubs:', '2 :diamonds:', '2 :hearts:', '2 :spades:', '3 :clubs:', '3 :diamonds:', '3 :hearts:', '3 :spades:', '4 :clubs:', '4 :diamonds:', '4 :hearts:', '4 :spades:', '5 :clubs:', '5 :diamonds:', '5 :hearts:', '5 :spades:', '6 :clubs:', '6 :diamonds:', '6 :hearts:', '6 :spades:', '7 :clubs:', '7 :diamonds:', '7 :hearts:', '7 :spades:', '8 :clubs:', '8 :diamonds:', '8 :hearts:', '8 :spades:', '9 :clubs:', '9 :diamonds:', '9 :hearts:', '9 :spades:', '10 :clubs:', '10 :diamonds:', '10 :hearts:', '10 :spades:', 'J :clubs:', 'J :diamonds:', 'J :hearts:', 'J :spades:', 'Q :clubs:', 'Q :diamonds:', 'Q :hearts:', 'Q :spades:', 'K :clubs:', 'K :diamonds:', 'K :hearts:', 'K :spades:']

                        pokerGameInProgress = 0
                        board = []
                        players = []
                        i = 2
                    }, 30000)

                } else {
                    if (players.length < 8) {
                        if (players.includes(username(message.author.id))) {
                            message.channel.send('You\'re already in the hand beatzSus')
                        } else {
                            board.push([username(message.author.id), dealHand(2, cards)])
                            message.channel.send(`${board[i][1][0]} ${board[i][1][1]} ${board[i][0]}`)
                            players.push(username(message.author.id))
                            i = i + 1
                        }
                    } else {
                        message.channel.send(`Sorry ${username(message.author.id)}, max of 8 players allowed per hand beatzFeels you can get in next time KirikaSmile`)
                    }
                }
                break;
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

        // copies the deleted message into a private channel

client.on("messageDelete", message => {
    console.log(`${time} ${message.author.username} said "${message.content}"`)
    //client.channels.cache.get('1314217289737965598').send(`${time} ${message.author.username} said "${message.content}"`)

})

// Assigns the streamer role to anyone live on Twitch

streamingrn = 0

client.on('presenceUpdate', (oldMember, newMember) => {
    if (oldMember != null) {
        // if (newMember.userId === '306578848177192960') {
        //console.log(newMember.userId, ' '+username(newMember.userId))
        // }

        var d = new Date();
        var time = (d.getHours()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ':' + (d.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })) + ':' + (d.getSeconds()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ' - '

        if (newMember.userId === '124044415634243584') {
            // console.log(newMember)
            // console.log(newMember.activities[0])
        }

        a = newMember.activities[0]
        b = oldMember.activities[0]
        currentlyStreaming = 0
        beenStreaming = 0


        if (a != undefined) {
            newMember.activities.forEach((element, index) => {
                if (element.type === 1) {
                    if (element.name === 'Twitch') {
                        currentlyStreaming += 1
                    }
                }
            })
        }

        if (b != undefined) {
            oldMember.activities.forEach((element, index) => {
                if (element.type === 1) {
                    if (element.name === 'Twitch') {
                        beenStreaming += 1
                    }
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
            // if (newMember.userId != '306578848177192960' || newMember.userId != '205980021251244032') {
            client.guilds.cache.get('172065393525915648').members.cache.get(newMember.userId).roles.add('610621341984489472')
            //     console.log(newMember)
            // }else{
            //     console.log('lol '+username(newMember.userId)+' tried it ', newMember.userId)
            // }
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

schedule.scheduleJob('2 30 22 * * *', function () {
    client.channels.cache.get('172252229145853953').send(('Good morning India <:KirikaSmile:608201680374464532>'))
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

schedule.scheduleJob('0 0 2 * * *', function () {
    fs.readFile('kirikapredictions.json', 'utf8', (err, data) => {
        scores = JSON.parse(data)
        let x = 0
        let total = 0

        if (scores.kirika != undefined) {
            if (scores.kirika.prediction.nfl.length > 0) {
            for (i = scores.kirika.prediction.nfl.length - 1; i >= 0; i--) {
                total++
                if (((new Date().getTime()) - (Date.parse(scores.kirika.prediction.nfl[i][6]))) > 0) {
                    scores.kirika.prediction.nfl.splice(i, 1)
                    x++
                }
            }
        }

            if (scores.kirika.prediction.mlb.length > 0) {
            for (i = scores.kirika.prediction.mlb.length - 1; i >= 0; i--) {
                total++
                if (((new Date().getTime()) - (Date.parse(scores.kirika.prediction.mlb[i][6]))) > 0) {
                    scores.kirika.prediction.mlb.splice(i, 1)
                    x++
                }
            }
        }
            if (scores.kirika.prediction.nhl.length > 0) {
            for (i = scores.kirika.prediction.nhl.length - 1; i >= 0; i--) {
                total++
                if (((new Date().getTime()) - (Date.parse(scores.kirika.prediction.nhl[i][6]))) > 0) {
                    scores.kirika.prediction.nhl.splice(i, 1)
                    x++
                }
            }
        }

            if (scores.kirika.prediction.nba.length > 0) {
            for (i = scores.kirika.prediction.nba.length - 1; i >= 0; i--) {
                total++
                if (((new Date().getTime()) - (Date.parse(scores.kirika.prediction.nba[i][6]))) > 0) {
                    scores.kirika.prediction.nba.splice(i, 1)
                    x++
                }
            }
        }

            if (scores.kirika.prediction.wnba.length > 0) {
            for (i = scores.kirika.prediction.wnba.length - 1; i >= 0; i--) {
                total++
                if (((new Date().getTime()) - (Date.parse(scores.kirika.prediction.nba[i][6]))) > 0) {
                    scores.kirika.prediction.wnba.splice(i, 1)
                    x++
                }
            }
        }

            if (scores.kirika.prediction.ncaaf.length > 0) {
            for (i = scores.kirika.prediction.ncaaf.length - 1; i >= 0; i--) {
                total++
                if (((new Date().getTime()) - (Date.parse(scores.kirika.prediction.ncaaf[i][6]))) > 0) {
                    scores.kirika.prediction.ncaaf.splice(i, 1)
                    x++
                }
            }
        }

            fs.writeFile('kirikapredictions.json', JSON.stringify(scores), (err) => {
                var d = new Date();
                var time = (d.getHours()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ':' + (d.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })) + ':' + (d.getSeconds()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ' -'
                if (err) throw err;
                console.log(`${time} Removed ${x} of ${total} predictions :O`)
            })
        }
    })
});