const TwitchBot = require('twitch-bot')
var oauth = require('./oauth.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs')
const tts = require('say')
//const WebSocket = require('ws');

// {//twitch event sub stuff that, quite frankly, I don't really understand but it needs to be here
// 	const crypto = require('crypto')
// const express = require('express');
// const app = express();
// const port = 8080;

// // Notification request headers
// const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
// const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
// const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
// const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();

// // Notification message types
// const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
// const MESSAGE_TYPE_NOTIFICATION = 'notification';
// const MESSAGE_TYPE_REVOCATION = 'revocation';

// // Prepend this string to the HMAC that's created from the message
// const HMAC_PREFIX = 'sha256=';

// app.use(express.raw({          // Need raw message body for signature verification
//     type: 'application/json'
// }))  


// app.post('/eventsub', (req, res) => {
//     let secret = getSecret();
//     let message = getHmacMessage(req);
//     let hmac = HMAC_PREFIX + getHmac(secret, message);  // Signature to compare

//     if (true === verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE])) {
//         console.log("signatures match");

//         // Get JSON object from body, so you can process the message.
//         let notification = JSON.parse(req.body);

//         if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
//             // TODO: Do something with the event's data.

//             console.log(`Event type: ${notification.subscription.type}`);
//             console.log(JSON.stringify(notification.event, null, 4));

//             res.sendStatus(204);
//         }
//         else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
//             res.status(200).send(notification.challenge);
//         }
//         else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
//             res.sendStatus(204);

//             console.log(`${notification.subscription.type} notifications revoked!`);
//             console.log(`reason: ${notification.subscription.status}`);
//             console.log(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
//         }
//         else {
//             res.sendStatus(204);
//             console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
//         }
//     }
//     else {
//         console.log('403');    // Signatures didn't match.
//         res.sendStatus(403);
//     }
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// })


// function getSecret() {
//     // TODO: Get secret from secure storage. This is the secret you pass 
//     // when you subscribed to the event.
//     return oauth.FuyumiSecret;
// }

// // Build the message used to get the HMAC.
// function getHmacMessage(request) {
//     return (request.headers[TWITCH_MESSAGE_ID] + 
//         request.headers[TWITCH_MESSAGE_TIMESTAMP] + 
//         request.body);
// }

// // Get the HMAC.
// function getHmac(secret, message) {
//     return crypto.createHmac('sha256', secret)
//     .update(message)
//     .digest('hex');
// }

// // Verify whether our hash matches the hash that Twitch passed in the header.
// function verifyMessage(hmac, verifySignature) {
//     return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
// }
// }

//const socket = new WebSocket('ws://localhost:8080/ws');//wss://eventsub.wss.twitch.tv/ws

// socket.onopen = function(e) {
// 	console.log('Connection Successful')
// };

// socket.onmessage = function(event) {
// 	console.log(JSON.parse(event.data).payload.session.id)
// }

// socket.onclose = function(event) {
// 	console.log('Connection closed')
// }

tts.getInstalledVoices((error, voices) => {
    if (error) {
        console.log("error:\n")
        console.log(error)
    }
    console.log("voices:\n")
    console.log(voices)
})

const Bot = new TwitchBot({
    username: 'fuyumi_sama',
    oauth: 'oauth:' + oauth.FuyumiAuth + '',
    channels: ['shadowbeatz']
});

function canSend(cd, lastUse) {
    if ((new Date().getTime() - lastUse) > (cd * 1000)) {
        return true
    } else {
        return false
    }
}

function timeout(userid, time, reason) {
    return new Promise(async function (resolve, reject) {

        const body = {
            data: {
                "user_id": userid,
                "duration": time,
                "reason": reason
            }
        }
        const make_request = await fetch('https://api.twitch.tv/helix/moderation/bans?broadcaster_id=24631624&moderator_id=' + oauth.FuyumiUser_ID, {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + oauth.FuyumiAuth,
                'Client-Id': oauth.FuyumiID,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        //make_request = await fetch(req)                                                             
        format_resolved_request = await make_request.json()
        console.log(format_resolved_request)

        if (format_resolved_request.data != undefined) {
            resolve(format_resolved_request.data)
        } else {
            reject()
        }
    })
}

online = 0
daylightsavings = 1

last_use = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]



Bot.on('join', () => {
    console.log('I\'m here')
    Bot.on('message', chatter => {
        chatmessage = chatter.message.trim().split(" ")
        var num = Math.floor(Math.random() * 10000)
        //const meme = chatter.message.split('').map(char => Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()).join('')

        if (chatter.username != 'kirika_sama' || chatter.username != 'fuyumi_sama' || chatter.username != 'nightbot') {
            fs.readFile('fuyumicommands.json', 'utf8', (err, data) => {
                command = JSON.parse(data)

                if (chatmessage[0] == "!addcomf") {
                    if (online === 1) {
                        if (chatter.username === 'shadowbeatz' || chatter.mod === 'true') {
                            if (command[chatmessage[1]] === undefined) {
                                if (chatter.message.includes('\\')) {
                                    Bot.say("beatzSus")
                                } else {
                                    command[chatmessage[1]] = chatmessage.slice(2).join(" ")
                                    fs.writeFile('fuyumicommands.json', JSON.stringify(command), (err) => {
                                        if (err) throw err;
                                        else Bot.say('Got it. "' + chatmessage[1] + '" command created.')
                                    })
                                }
                            } else {
                                Bot.say("That\'s already a command. beatzSus")
                            }

                        }
                    }

                } else if (chatmessage[0] == "!editcomf") {
                    if (online === 1) {
                        if (chatter.username === 'shadowbeatz' || chatter.mod === 'true') {
                            if (command[chatmessage[1]] != undefined) {
                                if (chatter.message.includes('\\')) {
                                    Bot.say("beatzSus")
                                } else {
                                    command[chatmessage[1]] = chatmessage.slice(2).join(" ")
                                    fs.writeFile('fuyumicommands.json', JSON.stringify(command), (err) => {
                                        if (err) throw err;
                                        else Bot.say('Got it. I edited the "' + chatmessage[1] + '" command.')
                                    })
                                }
                            } else {
                                Bot.say("That\'s... not a command? beatzSus")
                            }
                        }
                    }

                } else if (chatmessage[0] == "!delcomf") {
                    if (online === 1) {
                        if (chatter.username === 'shadowbeatz' || chatter.mod === 'true') {
                            if (command[chatmessage[1]] != undefined) {
                                delete command[chatmessage[1]]
                                fs.writeFile('fuyumicommands.json', JSON.stringify(command), (err) => {
                                    if (err) throw err;
                                    else Bot.say('Got it. The "' + chatmessage[1] + '" command has been deleted.')
                                })
                            } else {
                                Bot.say("Way ahead of you. Wasn\'t a command to begin with.")
                            }
                        }
                    }
                }

                else if (command[chatmessage[0]] != undefined) {
                    if (canSend(10, last_use[0])) {
                        last_use[0] = new Date().getTime()
                        Bot.say(command[chatmessage[0]])

                    }
                }
            })
        }

        if (chatter.display_name != "ShadowBeatz" || chatter.display_name != "Nightbot") {
            fs.readFile('viewers.json', 'utf8', (err, data) => {
                temp = JSON.parse(data)

                if (!temp.viewers.includes(chatter.display_name)) {

                    temp.viewers.push(chatter.display_name)

                    fs.writeFile('viewers.json', JSON.stringify(temp), (err) => {
                        if (err) throw err;
                    })
                }
            })
        }



        switch (chatmessage[0]) {
            case "!start":
                if (chatter.username === 'shadowbeatz') {
                    if (canSend(30, last_use[0])) {
                        last_use[0] = new Date().getTime()
                        Bot.say('I\'m here')
                        online = 1
                    }
                }
                break;

            case "o/":
                if (chatter.username === 'shadowbeatz') {
                    Bot.say('beatzLeave')
                    online = 0

                    fs.readFile('fuyumicommands.json', 'utf8', (err, data) => {
                        command = JSON.parse(data)

                        fs.writeFile('fuyumicommands(backup).json', JSON.stringify(command), (err) => {
                            if (err) throw err;
                        })
                    })
                }
                break;

            case "!favviewer":
                if (chatter.username === 'shadowbeatz') {
                    fs.readFile('viewers.json', 'utf8', (err, data) => {
                        temp = JSON.parse(data)
                        max = temp.viewers.length
                        num = Math.floor(Math.random() * max)

                        favviewer = temp.viewers[num]

                        fs.writeFile('favviewer.txt', favviewer, (err) => {
                            if (err) throw err;
                        });

                        Bot.say('"' + favviewer + '" is Shadow\'s favorite viewer. Congrats ' + favviewer + ', I\'m sure you\'re very honored right now.')
                    })

                }
                break;

            case "!song":
                if (canSend(30, last_use[19])) {
                    last_use[19] = new Date().getTime()
                    fs.readFile('C:/Users/shado/Documents/Snip/Snip.txt', 'utf8', (err, data) => {
                        if (data === '') {

                            Bot.say('@' + chatter.display_name + ' There\'s nothing playing beatzSus')

                        } else {

                            fs.readFile('C:/Users/shado/Documents/Snip/Snip_Metadata.json', 'utf8', (err, data) => {
                                nowplaying = JSON.parse(data)
                                artist = []

                                let x = 0
                                do {
                                    artist.push(nowplaying.item.artists[x].name)
                                    x += 1
                                } while (nowplaying.item.artists[x] != undefined)

                                if (artist.length === 1) {
                                    Bot.say('@' + chatter.display_name + ' The current song is "' + nowplaying.item.name + '" by ' + artist + ' ' + nowplaying.item.external_urls.spotify + ' FuyumiJam')
                                } else if (artist.length === 0) {
                                    Bot.say('@' + chatter.display_name + ' The current song is "' + nowplaying.item.name + '" by nobody apparently? wtf ' + nowplaying.item.external_urls.spotify + '')
                                } else if (artist.length > 1) {
                                    last = artist.pop()

                                    Bot.say('@' + chatter.display_name + ' The current song is "' + nowplaying.item.name + '" by ' + artist.join(', ') + ' and ' + last + ' ' + nowplaying.item.external_urls.spotify + ' FuyumiJam')
                                }

                            })
                        }
                    })
                    break;
                }
            case "!thots":
                if (online === 1) {
                    if (canSend(5, last_use[20])) {
                        last_use[20] = new Date().getTime()
                        const ascii = 97;
                        const letterIndex1 = Math.floor(Math.random() * 26);
                        const letterIndex2 = Math.floor(Math.random() * 26);
                        const letterIndex3 = Math.floor(Math.random() * 26);
                        const letter1 = String.fromCharCode(ascii + letterIndex1);
                        const letter2 = String.fromCharCode(ascii + letterIndex2);
                        const letter3 = String.fromCharCode(ascii + letterIndex3);
                        const random = `${letter1}${letter2}${letter3}`

                        if (random == 'fag' || random == "fgt" || random == "ngr" || random == "nig" || random == "kkk" || random == "sjv" || random == 'jap' || random == 'nga' || random == 'kys' || random == 'kms') {
                            Bot.say('I\'d rather not get cancelled.')
                        } else {
                            Bot.say('I wanna have ' + random + ' with @' + chatter.display_name + '.')
                        }
                        break;
                    }
                }


        }

        if (chatter.message.includes('sidearms')) {
            if (canSend(30, last_use[15])) {
                last_use[15] = new Date().getTime()
                Bot.say('beatzSigh')
            }
        }

        if (chatter.message.includes('snowyb7AAAAAHHHHHHHHHHAAAAA')) {
            if (canSend(30, last_use[14])) {
                last_use[14] = new Date().getTime()
                Bot.say('Please never bring that abomination into this chat ever again.')
            }
        }

        if (chatter.message.includes('flying59Wat')) {
            if (canSend(30, last_use[18])) {
                last_use[18] = new Date().getTime()
                Bot.say('Please never bring that abomination into this chat ever again.')
            }
        }

        if (chatter.message.toLowerCase().includes('yikes')) {
            if (chatter.username != 'shadowbeatz') {
                fs.readFile('yikes.json', 'utf8', (err, data) => {
                    yike = JSON.parse(data)
                    user = chatter.username

                    if (yike[user] == undefined) {
                        yike[user] = 1
                    } else {
                        yike[user] = (yike[user] + 1)
                    }

                    if (yike[user] == 100) {
                        Bot.say('@' + chatter.display_name + ' Okay, you\'ve said that word in this chat LITERALLY a hundred times now. I think it\'s time you get some help.')
                    }

                    if (chatter.mod == false) {
                        timeout(chatter.user_id, "10", "saying yikes")
                            .catch((error) => {
                                console.log(error);
                            });
                        if (yike[user] != 100) {
                            if (canSend(30, last_use[19])) {
                                last_use[19] = new Date().getTime()
                                Bot.say('@' + chatter.display_name + ' Yiiiiiiiiiiiiiiikes bro')
                            }
                        }
                    } else {
                        if (yike[user] != 100) {
                            if (canSend(30, last_use[19])) {
                                last_use[19] = new Date().getTime()
                                Bot.say('@' + chatter.display_name + ' Abuse of power lookin ass beatzSus')
                            }
                        }
                    }

                    fs.writeFile('yikes.json', JSON.stringify(yike), (err) => {
                        if (err) throw err;
                    })
                })
            }
        }



        if (chatter.username === 'profbasara') {
            if (chatter.message.includes('live or')) {
                Bot.say('It\'s obviously a repeat @ProfBasara I don\'t know why you keep asking that')
            }
        }

        if (chatter.username === 'kirika_sama') {
            if (chatter.message === 'OH SHIT YOGURT FIGHT!!!! beatzMeat beatzMeat beatzMeat') {
                Bot.say('TWO YOGURTS ENTER! ONE YOGURT LEAVES!')
            }
        }

        if (chatter.username === 'kirika_sama') {
            if (chatter.message === 'PETTHEALLIE') {
                Bot.say('PETTHEALLIE')
            }
        }

        if (num == 69) {
            Bot.say('@' + chatter.display_name + ' can you please shut up?')
            setTimeout(() => { Bot.say('beatzSmug') }, 5000)
        }

        if (chatter.message.toLowerCase().includes('!followage')) {
            Bot.say('@' + chatter.display_name + ' Just click on your name in chat and you can see')
        }

        // if (chatter.username === 'harvey_')
        // 	Bot.say('shut up harvey') 				
    })
})

Bot.on('reward-redeemed', redemption => {
    console.log(redemption)
})

Bot.on('subscription', event => {
    if (event.msg_param_cumulative_months == 69) {
        Bot.say("@" + event.display_name + " Nice beatzWICKED")
    } else {
        if (event.msg_param_sub_plan == '1000' && event.msg_id == 'sub') {
            Bot.say("@" + event.display_name + " Ha. Weeb.")
        }
    }
});



ttsqueue = []
currently_speaking = false

async function mayne(name) {
    currently_speaking = true
    await speaketh()
    console.log(name + '\'s message has been spoken.')
    if (ttsqueue.length != 0) {
        mayne(name)
    } else {
        currently_speaking = false
    }
}

function speaketh() {
    return new Promise((resolve, reject) => {
        ttssay = ttsqueue.shift()
        tts.speak(ttssay, 'IVONA 2 Brian OEM', 1.0, (err) => { //'Microsoft Haruka Desktop'
            if (err) {
                reject(err)
            }
            resolve()
        })
    })
};
;

Bot.on('message', highlight => {

    console.log(highlight)

    blacklist = highlight.message.toLowerCase()
    if (online === 1) {
        if (highlight.msg_id == 'highlighted-message' && !blacklist.includes("nigger")) {
            ttsqueue.push(highlight.message)
            if (currently_speaking == false) {
                mayne(highlight.display_name)
            }

            // Bot.say('Since Shadow is playing a weeb game, he doesn\'t want tts spam to ruin the immersion, so tts is off while this game is live.')
        }
    };

    if (highlight.message == '`' && highlight.username == 'shadowbeatz')
        tts.stop(err => {
            if (err)
                return console.error(err)

            Bot.say('Yeah that\'s enough of that')
        })
});

Bot.on('error', err => {
    console.log(err)
})