const TwitchBot = require('twitch-bot');
var oauth = require('./oauth.js');
const fetch = require('node-fetch');
const fs = require('fs');

const Bot = new TwitchBot({
  username: 'kirika_sama',
  oauth: 'oauth:'+oauth.KirikaAuth+'',
  channels: ['shadowbeatz']
})
 
//asynchronous Function to return a promise containing the uptime from a username given as an arg.
function getUptime(username){
  return new Promise(async function(resolve, reject){
            //creates the request
         const req = new fetch.Request('https://api.twitch.tv/helix/streams?user_login=shadowbeatz', {
            method: 'get',
            headers: {
                'Client-Id': oauth.KirikaID,
				'Authorization': 'Bearer '+oauth.KirikaAuth+'',
                'Accept': 'application/vnd.twitchtv.v5+json'
                },
            redirect: 'follow'
            });
                make_request = await fetch(req)                                                              //sends the request
            	format_resolved_request = await make_request.json()                   //formats the raw request into JSON
            
            if(format_resolved_request.data[0]!=null){                
                isolated_uptime = await format_resolved_request.data[0].started_at   	 //pulls the uptime from the JSON
                resolve(isolated_uptime)												 //returns the uptime (in UTC format)				                                            
            }else{
                reject()
            }       
    })                                             
}

function canSend(cd, lastUse){
	if ((new Date().getTime()-lastUse)>(cd*1000)){
		return true
	}else{
		return false
	}
}

boi = 0
hero = 0

last_use = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

Bot.on('join', () => {
	console.log('Ready to go, Captain o7')
  //command list
  Bot.on('message', chatter => {
    // console.log(""+chatter.username+": " +chatter.message+ "")
	m = chatter.message[0]
  	chatmessage = chatter.message.trim().split(" ")

	//if (chatmessage[0] == "!addcomk")
	  
    switch (chatmessage[0]) {
    	// case "!addcommand":
    	// 	fs.readFile(__dirname + '/kirikacommands.json', 'utf8', (err, data) => {
    	// 		temp = JSON.parse(data)
    	// 		if(temp[chatmessage[1]] === undefined){
    	// 			temp[chatmessage[1]] = chatmessage[2]
    	// 			temp2 = JSON.stringify(temp)
    	// 			fs.writeFile('kirikacommands.json', temp2, (err)=>{
    	// 				if (err) throw err;
    	// 				else Bot.say('Command created KirikaSmile')
    	// 			})
    	// 		}else{
    	// 			Bot.say("Command already exists you goof KirikaSmile")
    	// 		}
    	// 	})
    	// 	break;

			case "!uptime":
			//runs the getUptime function, needs the .then because getUptime is asynchronous
			if (canSend(30, last_use[23])){
					last_use[23] = new Date().getTime()
					getUptime('shadowbeatz').then(resolved_uptime =>{
			  //finds difference between time of stream creation and current time (in ms)
				  time_in_ms = new Date().getTime() - Date.parse(resolved_uptime)       
				  hours = Math.floor(time_in_ms/(1000*60*60))
				  mins = Math.floor((time_in_ms-(hours*1000*60*60))/(1000*60))
				  seconds = Math.floor((time_in_ms-(hours*1000*60*60)-(mins*1000*60))/1000)
				  Bot.say('Shadow has been live for '+hours+" hours "+mins+" minutes and "+seconds+" seconds.")
				})
			//if stream is offline an error will be thrown, .catch() executes upon error detection
				.catch(err =>{  
				  Bot.say("Shadow isn't live, and I'm a bit concerned that you're using the !uptime command in a channel that's clearly offline :)")
				})
			}
			break;

    		case "!test":
            if(chatter.username === 'shadowbeatz'){
    		  if (canSend(30, last_use[1])){
    		    last_use[1] = new Date().getTime()
    			Bot.say('hi :)')
                boi = 0
                hero = 0
    		  }
            }  		
    		break;

    		case "!emotes":
    		if (canSend(30, last_use[0])){
    			last_use[0] = new Date().getTime()
    			Bot.say('beatzKappa beatzAllie beatzDesuka beatzOyasumi beatzBaka beatzFeels beatzF beatzSigh beatzYD beatzDisgust beatzChug beatzHauu beatzLurk beatzOnegai beatzSnacc beatzMeat beatzAYAYA beatzHey beatzSmug beatzSus')
    		}
    		break;

    		case "!america":
    		if (canSend(30, last_use[2])){
    			last_use[2] = new Date().getTime()
    			Bot.say('https://clips.twitch.tv/SuccessfulArborealFrogSaltBae')
    		}
    		break;

    		case "!critmachine":
    		if (canSend(30, last_use[3])){
    			last_use[3] = new Date().getTime()
					Bot.say('Sugoi Totodile beatzChug https://www.twitch.tv/videos/218576153')
    		}
    		break;

    		case "!cure":
    		if (canSend(30, last_use[4])){
    			last_use[4] = new Date().getTime()
					Bot.say('Feeling sick? I have the medicine :) https://gyazo.com/84101ed5d172d2b4c906a2f7a3269f5f')
    		}
    		break;

			case "!commissions":
    		if (canSend(30, last_use[5])){
    			last_use[5] = new Date().getTime()
    			Bot.say('Shadow is now doing music commissions KirikaSmile If you need a song for a project or just want something to add to a playlist, check out the website for more details http://www.shadowbeatzinc.com')
    		}
    		break;

			case "!FC":
    		if (canSend(30, last_use[5])){
    			last_use[5] = new Date().getTime()
    			Bot.say('3821-3662-8512')
    		}
    		break;

			case "!d1":
    		if (canSend(30, last_use[6])){
    			last_use[6] = new Date().getTime()
    			Bot.say('Check out D1! Twitch: www.twitch.tv/D1 | Youtube: www.youtube.com/user/D1ofAquavibe | Twitter: www.twitter.com/D1ofAquavibe')
    		}
    		break;

			case "!deathcounter":
    		if (canSend(30, last_use[7])){
    			last_use[7] = new Date().getTime()
    			Bot.say('Shadow has died 0 times beatzAllie')
    		}
    		break;

			case "!discord":
    		if (canSend(30, last_use[8])){
    			last_use[8] = new Date().getTime()
    			Bot.say('Only rule is don\'t be an asshole. Be an asshole and get insta-banned. Mets fans wanted. https://discord.gg/qtDRQhd')
    		}
    		break;

			// case "!mediashare":
    		// if (canSend(30, last_use[9])){
    		// 	last_use[9] = new Date().getTime()
    		// 	Bot.say('@'+chatter.display_name+' Mediashare is now enabled for a short time KirikaSmile Share a video with the stream for the low low price of 8.3 cents per second (some restrictions apply) https://streamlabs.com/shadowbeatz/tip')
                //setTimeout(() => { Bot.say('@'+chatter.display_name+' But I want to make it perfectly clear that I\'m not relying 100% on this goal. I hate these things because of the potential for guilt that comes with seeing a goal and not being able or wanting to give money, so I\'m completely okay with seeing you say "lol welcome to the real world streamer boy. Sucks to suck" or something. Do not give if guilt is a factor. Please. Take care of yourself first.') }, 1000)
    		// }
    		// break;

			case "!emote":
    		if (canSend(30, last_use[10])){
    			last_use[10] = new Date().getTime()
    			Bot.say('If you can\'t see JusticeArrived MimikyuHi SombraThinking OrisaYay you need to install FrankerFaceZ: https://www.frankerfacez.com')
    		}
    		break;

			case "!fuckyoulas":
    		if (canSend(30, last_use[11])){
    			last_use[11] = new Date().getTime()
    			Bot.say('r')
    		}
    		break;

			case "!hauu":
    		if (canSend(30, last_use[12])){
    			last_use[12] = new Date().getTime()
    			Bot.say('OMOCHIKAERI~~~ beatzHauu beatzHauu beatzHauu beatzHauu beatzHauu')
    		}
    		break;

			case "!playlist":
    		if (canSend(30, last_use[13])){
    			last_use[13] = new Date().getTime()
    			Bot.say('Non-copyright sounds playlist on Spotify KirikaSmile FuyumiJam https://open.spotify.com/playlist/1PZsaHXzb4hzEDSZSy6GJh?si=e8a4b42d08e64c5b')
    		}
    		break;

			case "!missed":
    		if (canSend(30, last_use[14])){
    			last_use[14] = new Date().getTime()
    			Bot.say('/me Missed the stream? You can go rewatch it at http://www.twitch.tv/shadowbeatz/profile/past_broadcasts :)')
    		}
    		break;

			case "!reason":
    		if (canSend(30, last_use[15])){
    			last_use[15] = new Date().getTime()
    			Bot.say('Reason is a computer program for creating and editing music. It emulates a rack of hardware synthesizers, samplers, signal processors, sequencers, and mixers, all of which can be freely interconnected in an arbitrary manner. You can get Reason here: https://www.propellerheads.se/products/reason/')
    		}
    		break;

			case "!sanic":
    		if (canSend(30, last_use[16])){
    			last_use[16] = new Date().getTime()
    			Bot.say('Sugoi Sonic player beatzChug / https://clips.twitch.tv/PlainAmusedButterOSfrog')
    		}
    		break;

			case "!soundcloud":
    		if (canSend(30, last_use[17])){
    			last_use[17] = new Date().getTime()
    			Bot.say('You can download some of Shadow\'s songs from his SoundCloud @ https://soundcloud.com/shadowbeatzinc-1')
    		}
    		break;

			case "!specs":
    		if (canSend(30, last_use[18])){
    			last_use[18] = new Date().getTime()
    			Bot.say('Shadow\'s computer specs are CPU: i7-4770, GPU: GTX 3080, 32Gb Ram, 1x mouse, Corsair strafe, ASUS VG248QE')
    		}
    		break;

			case "!weeb":
    		if (canSend(30, last_use[19])){
    			last_use[19] = new Date().getTime()
    			Bot.say('beatzChug ME WEEB beatzFeels ME SPAM beatzHauu MODS BAKA beatzBaka IF BAN beatzDisgust')
    		}
    		break;

			// case "!weeblist":
   //  		if (canSend(30, last_use[20])){
   //  			last_use[20] = new Date().getTime()
   //  			Bot.say('@'+chatter.display_name+' Here is someone else\'s animelist that coincidentally has all of the anime that Shadow has watched as well. Sort by score and anything 8 and above is what he recommends beatzHauu http://myanimelist.net/animelist/KyonIwasawa')
   //  		}
   //  		break;

			case "banger":
    		if (canSend(30, last_use[21])){
    			last_use[21] = new Date().getTime()
    			Bot.say('ヾ(⌐■_■)ノ♪')
    		}
    		break;

			case "owo":
    		if (canSend(30, last_use[22])){
    			last_use[22] = new Date().getTime()
    			Bot.say('https://gyazo.com/3b95a1586a29c95faf7a910d5210efbd')
    		}
    		break;

    	case "FALCON!":
    		if (canSend(30, last_use[25])){
    			last_use[25] = new Date().getTime()
    			Bot.say('PAWNCH! beatzMeat')
    		}
    		break;	

    	case "!satisfactory":
    		if (canSend(30, last_use[26])){
    			last_use[26] = new Date().getTime()
    			Bot.say('The game is in Early Access right now so there is nothing in terms of a defined "endgoal", but the idea is to advance through technology tiers and automate production of items to create bigger and better factories. There is no real finish line yet, similar to how Minecraft was pre-Ender Dragon KirikaSmile')
    		}
    		break;	

    	case "!rerun":
    		if (canSend(30, last_use[26])){
    			last_use[26] = new Date().getTime()
    			Bot.say('/me This stream is not live, it\'s a rerun of a previous stream, so unless Shadow is in the chat, he won\'t be able to respond to your questions or thank you for a sub. I might though if his lazy ass gave me the instructions on how to do so KirikaSmile')
    		}
    		break;

    	case "!purge":
    		if (canSend(30, last_use[27])){
    			last_use[27] = new Date().getTime()
    			Bot.say('/me The purge has been delayed and subsequent events shall henceforth commence on a bi-weekly shedjule. The council arrived at this resolution to allow for more varied content creation opportunities during off-weeks.')
    		}
    		break;

    	case "!subgoals":
    		if (canSend(30, last_use[28])){
    			last_use[28] = new Date().getTime()
    			Bot.say('/me 600 = Cornrow picture reveal. 700 = Hatless stream. 800 = Helicopter dick on camera for 45 seconds. 900 = Side can come over Shadow\'s house. 1000 = More streams, as 1000 subs would be enough income to go back to full-time streaming KirikaSmile');
    			Bot.say('/me *Note: Some goals subject to change')
    		}
    		break;

		case "!height":
			if (canSend(30, last_use[28])){
				last_use[28] = new Date().getTime()
				fs.readFile('height.json', 'utf8', (err, data)=>{
				temp = JSON.parse(data)
				Bot.say('Shadow is '+temp.feet+'\''+temp.inches+'" KirikaSmile')
	
				temp.cm = (temp.cm + 2.54)
				if (temp.inches == 11){
					temp.feet = (temp.feet + 1)
					temp.inches = 0
				}else{
					temp.inches = (temp.inches + 1)
				}
	
				fs.writeFile('height.json', JSON.stringify(temp), (err)=>{
					if (err) throw err;
					})		
				})
			}
			break;

    	case "o/":
    		if(chatter.username === 'shadowbeatz'){
    			Bot.say('thanks for coming cool cats beatzAllie')
                boi = 0
                hero = 0
    		}
    		break;	
    	}

        if (chatter.message == '!weeblist') {
            if (canSend(30, last_use[23])){
             last_use[23] = new Date().getTime()
             Bot.say('@'+chatter.display_name+' Here is someone else\'s animelist that coincidentally has all of the anime that Shadow has watched as well. Sort by score and anything 8 and above is what he recommends beatzHauu http://myanimelist.net/animelist/KyonIwasawa')
            }
        }

        if (chatter.message == '!alt') {
            if (canSend(30, last_use[23])){
             last_use[23] = new Date().getTime()
             Bot.say('@'+chatter.display_name+' Shadow had issues with his graphics card causing his game to crash over the past few days. This caused his main account to accrue afk penalties so I\'m letting him use my account until it all gets sorted out KirikaSmile')
            }
        }

        if (chatter.message.includes('anime ')  && (chatter.message.includes('recommend')) || (chatter.message.includes('anime?')  && (chatter.message.includes('recommend')))) {
            if (canSend(30, last_use[29])){
             last_use[29] = new Date().getTime()
             Bot.say('@'+chatter.display_name+' Here is someone else\'s animelist that coincidentally has all of the anime that Shadow has watched as well. Sort by score and anything 8 and above is what he recommends beatzHauu http://myanimelist.net/animelist/KyonIwasawa')
            }
        }

        if (chatter.message.includes('!weeblist')) {
           wl = chatter.message.split(" ")
           if (wl[0] == '!weeblist' && wl[1] != undefined) {
                if (wl[1].substring(0,1) == '@') {
                   Bot.say(''+wl[1]+' Here is someone else\'s animelist that coincidentally has all of the anime that Shadow has watched as well. Sort by score and anything 8 and above is what he recommends beatzHauu http://myanimelist.net/animelist/KyonIwasawa')  
                }else{
                   Bot.say('@'+wl[1]+' Here is someone else\'s animelist that coincidentally has all of the anime that Shadow has watched as well. Sort by score and anything 8 and above is what he recommends beatzHauu http://myanimelist.net/animelist/KyonIwasawa') 
                }  
           }
        }

        if(chatter.username === 'yogurt_boi'){
            if (hero === 1 && boi === 0) {
                Bot.say('OH SHIT YOGURT FIGHT!!!! beatzMeat beatzMeat beatzMeat')
                boi = 1
            }else{
                if (boi === 0){
                    boi = 1
                }
            }
        }

        if(chatter.username === 'yogurthero212'){
            if (hero === 0 && boi === 1) {
                Bot.say('OH SHIT YOGURT FIGHT!!!! beatzMeat beatzMeat beatzMeat')
                hero = 1
            }else{
                if (hero === 0){
                    hero = 1
                }
            }
        }

        if (chatter.username === 'fuyumi_sama'){
            if (chatter.message.includes('can you please shut up?')){
                setTimeout(() => { Bot.say('fuyumi D:') }, 3000)
                }
        }        
          

    if (chatter.message.includes('pack')  && chatter.message.includes('mod') && chatter.display_name != 'Nightbot'){
			if (canSend(30, last_use[24])){
    			last_use[24] = new Date().getTime()
    			Bot.say('@'+chatter.display_name+' The modpack is a 1.16.5 modpack called "Create: Above and Beyond" KirikaSmile https://www.curseforge.com/minecraft/modpacks/create-above-and-beyond')
		  	}
		  }  
  });

	Bot.on('subscription', event => {
        if (event.msg_param_cumulative_months == 69){
            Bot.say("@"+event.display_name+" Nice beatzWICKED")
        }else{
    		if (event.msg_param_sub_plan == '1000' && event.msg_id == 'sub'){
    			Bot.say("@"+event.display_name+" thank you for the sub! Welcome to the Church of Anime KirikaSmile")
    		}

    		if (event.msg_param_sub_plan == '2000' && event.msg_id == 'sub'){
    			Bot.say("@"+event.display_name+" thank you for the tier 2 sub! So generous! Welcome KirikaSmile")
    		}

    		if (event.msg_param_sub_plan == '3000' && event.msg_id == 'sub'){
    			Bot.say("@"+event.display_name+" sugoi bank account monkaS thank you for the tier 3! Welcome to the Church of Anime KirikaSmile")
    		}

    		if (event.msg_param_sub_plan == 'Prime' && event.msg_id == 'sub'){
    			Bot.say("@"+event.display_name+" Thanks for using your Twitch Prime sub here. Welcome to the Church of Anime KirikaSmile")
    		}

    		if (event.msg_param_sub_plan == '1000' && event.msg_id == 'resub'){
    			if (event.login == 'sidearms4reason'){
    				Bot.say("Siiiidearrrrmmmmmmsssss thanks for the "+event.msg_param_cumulative_months+" months good to fuckin see yo ass thanks for fuckin chillin with me thanks for the support welcome back holy shit thanks for the fuckin "+event.msg_param_cumulative_months+" montharoooos")
    			}else{
    			Bot.say("@"+event.display_name+" thank you for the "+event.msg_param_cumulative_months+" month resub! The Church of Anime appreciates your continued support KirikaSmile")
    			}
    		}

    		if (event.msg_param_sub_plan == '2000' && event.msg_id == 'resub'){
    			Bot.say("@"+event.display_name+" thank you for the "+event.msg_param_cumulative_months+" month resub! And at Tier 2! Thank you for being so generous KirikaSmile")
    		}

    		if (event.msg_param_sub_plan == '3000' && event.msg_id == 'resub'){
    			Bot.say("@"+event.display_name+" sugoi bank account monkaS thank you for the tier 3! Thank you for the "+event.msg_param_cumulative_months+" month resub! Welcome to the Church of Anime KirikaSmile")
    		}

    		if (event.msg_param_sub_plan == 'Prime' && event.msg_id == 'resub'){
    			Bot.say("@"+event.display_name+" Thanks for using your Twitch Prime sub here. Welcome to the Church of Anime KirikaSmile")
    		}

    		/*if(event.msg_id == 'subgift'){
    			Bot.say("@"+event.display_name+" thank you for the sub gift and spreading the word of the Church KirikaSmile")
    		}

    		if(event.msg_id == 'submysterygift'){
    			amount = parseInt(event.system_msg.split)
    			subgifter = {}
    			if(subgifter[event.display_name] == undefined){
      			subgifter[event.display_name] = msg_param_mass_gift_count
    				}else{
    					subgifter[event.display_name] = 
    				}
    			Bot.say("@"+event.display_name+" thank you for gifting "+msg_param_mass_gift_count+" subs to those in need KirikaSmile")
    		}*/
        }
    		console.log(event)
    	});
})  	
 Bot.on('error', err => {
  console.log(err)
})