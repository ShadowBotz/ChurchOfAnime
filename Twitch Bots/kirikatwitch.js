const TwitchBot = require('twitch-bot');
var oauth = require('./oauth.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');
const WebSocket = require('ws');
const socket = new WebSocket('wss://eventsub.wss.twitch.tv/ws');//ws://localhost:8080/wswss://eventsub.wss.twitch.tv/ws

const Bot = new TwitchBot({
  username: 'kirika_sama',
  oauth: 'oauth:'+oauth.KirikaAuth+'',
  channels: ['shadowbeatz']
})

//asynchronous Function to return a promise containing the uptime from a username given as an arg.
function getUptime(username){
  return new Promise(async function(resolve, reject){
            //creates the request
			const make_request = await fetch('https://api.twitch.tv/helix/streams?user_login='+username+'', {
            method: 'get',
            headers: {
                'Client-Id': oauth.KirikaID,
				'Authorization': 'Bearer '+oauth.KirikaAuth+'',
                'Accept': 'application/vnd.twitchtv.v5+json'
                },
            redirect: 'follow'
            });
                //make_request = await fetch(req)                                                              //sends the request
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

socket.onopen = function(e) {
	console.log('Connection Successful')
};

socket.onmessage = function(event) {
	if (JSON.parse(event.data).metadata.message_type === 'session_welcome') {
		console.log(JSON.parse(event.data).payload.session.id)
		session_id = JSON.parse(event.data).payload.session.id

		fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
			method: 'post',
			headers: {
                'Client-Id': oauth.KirikaID,
				'Authorization': 'Bearer '+oauth.KirikaAccessToken,
                'Content-Type': 'application/json'
                },
			body: JSON.stringify({
				"type": "channel.channel_points_custom_reward_redemption.add",
				"version": "1",
				"condition": {
					"broadcaster_user_id": "24631624",
					"reward_id": "f3d09b55-bd99-4615-847f-f0c6c2525ae6"
				},
				"transport": {
					"method": "websocket",
					"session_id": session_id
				}
			})
		})
		.then(response => {
			console.log(response)
		}) 		
	}else{
		if (JSON.parse(event.data).metadata.message_type != 'session_keepalive') {
			(console.log(JSON.parse(event.data)//.payload.event.reward))
			))
		}
	}
	
}

socket.onclose = function(event) {
	console.log('Connection closed')
	console.log(event)
}

socket.onerror = function(error) {
	console.log('[error] '+error.data);
  };

boi = 0
hero = 0
online = 0
messagecount = 0
allie = 0

last_use = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

Bot.on('join', () => {
	console.log('Ready to go, Captain o7')
  //command list
  Bot.on('message', chatter => {
	messagecount = messagecount + 1

	if (messagecount > 50){
		if (canSend(1800, last_use[10])){
			last_use[10] = new Date().getTime()
			fs.readFile('kirikacommands.json', 'utf8', (err, data) => {
				quote = JSON.parse(data)
				max = quote.quotes.length
				num = Math.floor(Math.random() * max)

				Bot.say(quote.quotes[num])
				messagecount = 0
			})							
		}
	}
    // console.log(""+chatter.username+": " +chatter.message+ "")
	m = chatter.message[0]
  	chatmessage = chatter.message.trim().split(" ")
	if (chatter.username != 'kirika_sama' || chatter.username != 'fuyumi_sama' || chatter.username != 'nightbot'){
		fs.readFile('kirikacommands.json', 'utf8', (err, data) => {
			command = JSON.parse(data).commands

			if (chatmessage[0] == "!addcomk"){
				if (online === 1){
					if (chatter.username === 'shadowbeatz' || chatter.mod === 'true'){
						if (command[chatmessage[1]] === undefined){
							if (chatter.message.includes('\\')){
								Bot.say("nope KirikaSmile")
							}else{
								command[chatmessage[1]] = chatmessage.slice(2).join(" ")
								fs.writeFile('kirikacommands.json', JSON.stringify(command), (err)=>{
									if (err) throw err;
									else Bot.say('"'+chatmessage[1]+'" command created, Captain KirikaSmile 7')
									})
								}
						}else{
							Bot.say("That command already exists you goof KirikaSmile")
						}
								
					}
				}
				
			}else if (chatmessage[0] == "!editcomk"){
				if (online === 1){
					if (chatter.username === 'shadowbeatz' || chatter.mod === 'true'){
						if (command[chatmessage[1]] != undefined){
							if (chatter.message.includes('\\')){
								Bot.say("nope KirikaSmile")
							}else{
								command[chatmessage[1]] = chatmessage.slice(2).join(" ")
								fs.writeFile('kirikacommands.json', JSON.stringify(command), (err)=>{
									if (err) throw err;
									else Bot.say('"'+chatmessage[1]+'" command edited. I\'m such a good bot beatzWICKED')
									})
								}
						}else{
							Bot.say("You can\'t edit a command that doesn\'t exist silly KirikaSmile")
						}
					}
				}

			}else if (chatmessage[0] == "!delcomk"){
				if (online === 1){
					if (chatter.username === 'shadowbeatz' || chatter.mod === 'true'){
						if (command[chatmessage[1]] != undefined){
							delete command[chatmessage[1]]
							fs.writeFile('kirikacommands.json', JSON.stringify(command), (err)=>{
								if (err) throw err;
								else Bot.say('"'+chatmessage[1]+'" command has been deleted. You were a great command '+chatmessage[1]+' rest in peace peepoSad 7')
							})
						}else{
							Bot.say("That command was already gone before I did anything. I\'m so quick beatzHYPE")
						}
					}
				}
			}
			
			else if (command[chatmessage[0]] != undefined){
				if (canSend(10, last_use[0])){
					last_use[0] = new Date().getTime()
						Bot.say(command[chatmessage[0]])
									
				}	
			}
		})
	}

	  
    switch (chatmessage[0]) {

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

    		case "!start":
            if(chatter.username === 'shadowbeatz'){
    		  if (canSend(30, last_use[1])){
    		    last_use[1] = new Date().getTime()
    			Bot.say('hi :)')
                boi = 0
                hero = 0
				online = 1								
    		  }
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
				online = 0

				fs.readFile('kirikacommands.json', 'utf8', (err, data) => {
					command = JSON.parse(data)
					
					fs.writeFile('kirikacommands(backup).json', JSON.stringify(command), (err)=>{
						if (err) throw err;
						})
				})
    		}
    		break;	
    	}

        if (chatter.message == '!weeblist') {
            if (canSend(30, last_use[23])){
             last_use[23] = new Date().getTime()
             Bot.say('@'+chatter.display_name+' Here is someone else\'s animelist that coincidentally has all of the anime that Shadow has watched as well. Sort by score and anything 8 and above is what he recommends beatzHauu http://myanimelist.net/animelist/KyonIwasawa')
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
    			Bot.say('@'+chatter.display_name+' The modpack is called Vault Hunters KirikaSmile It\'s a 1.18.2 modpack mixes dungeon crawling and RPG mechanics and makes it minecrafty')
		  	}
		}
		
		if (allie != 0){
			if (!chatter.message.includes('PETTHEALLIE')){
				allie = 0
			}
		}

		if (chatter.message.includes('PETTHEALLIE')){
            allie = (allie + 1)
			if (allie === 3){
				Bot.say('PETTHEALLIE')
				allie = 0
			}               
        }

  });

	Bot.on('subscription', event => {
        if (event.msg_param_cumulative_months == 69){
            Bot.say("@"+event.display_name+" Nice beatzWICKED")
        }else{
    		if (event.msg_param_sub_plan == '1000' && event.msg_id == 'sub'){
    			Bot.say("@"+event.display_name+" Thank you for the sub! Welcome KirikaSmile The Church of Anime appreciates your support.")
    		}

    		if (event.msg_param_sub_plan == '2000' && event.msg_id == 'sub'){
    			Bot.say("@"+event.display_name+" thank you for the tier 2 sub! So generous! Welcome KirikaSmile")
    		}

    		if (event.msg_param_sub_plan == '3000' && event.msg_id == 'sub'){
    			Bot.say("@"+event.display_name+" sugoi bank account monkaS thank you for the tier 3! Welcome to the Church of Anime KirikaSmile")
    		}

    		if (event.msg_param_sub_plan == 'Prime' && event.msg_id == 'sub'){
    			Bot.say("@"+event.display_name+" Thank you for using your Prime sub here! Welcome KirikaSmile The Church of Anime appreciates your support.")
    		}

    		if (event.msg_param_sub_plan == '1000' && event.msg_id == 'resub'){
    			if (event.login == 'sidearms4reason'){
    				Bot.say("Siiiidearrrrmmmmmmsssss thanks for the "+event.msg_param_cumulative_months+" months good to fuckin see yo ass thanks for fuckin chillin with me thanks for the support welcome back holy shit thanks for the fuckin "+event.msg_param_cumulative_months+" montharoooos")
    			}else{
    			Bot.say("@"+event.display_name+" Thank you for the "+event.msg_param_cumulative_months+" month resub! The Church of Anime appreciates your continued support KirikaSmile")
    			}
    		}

    		if (event.msg_param_sub_plan == '2000' && event.msg_id == 'resub'){
    			Bot.say("@"+event.display_name+" Thank you for the "+event.msg_param_cumulative_months+" month resub! And at Tier 2! Thank you for being so generous KirikaSmile")
    		}

    		if (event.msg_param_sub_plan == '3000' && event.msg_id == 'resub'){
    			Bot.say("@"+event.display_name+" sugoi bank account monkaS thank you for the tier 3! Thank you for the "+event.msg_param_cumulative_months+" month resub! Welcome to the Church of Anime KirikaSmile")
    		}

    		if (event.msg_param_sub_plan == 'Prime' && event.msg_id == 'resub'){
    			Bot.say("@"+event.display_name+" Thank you for using your Prime sub here! Welcome back KirikaSmile Thank you for the "+event.msg_param_cumulative_months+" months of support to the Church of Anime.")
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