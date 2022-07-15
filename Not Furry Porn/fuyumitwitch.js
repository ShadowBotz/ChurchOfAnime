const TwitchBot = require('twitch-bot')
var oauth = require('./oauth.js');
const fetch = require('node-fetch');
const fs = require('fs')
const tts = require('say')

tts.getInstalledVoices((error, voices)=>{
    if(error){
       console.log("error:\n")
        console.log(error)
    }
    console.log("voices:\n")
    console.log(voices)
})
 
const Bot = new TwitchBot({
  username: 'fuyumi_sama',
  oauth: 'oauth:'+oauth.FuyumiAuth+'',
  channels: ['shadowbeatz']
});

function canSend(cd, lastUse){
	if ((new Date().getTime()-lastUse)>(cd*1000)){
		return true
	}else{
		return false
	}
}

online = 0

last_use = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

Bot.on('join', () => {
 
  Bot.on('message', chatter => {
  	chatmessage = chatter.message.trim().split(" ")
  	var num = Math.floor(Math.random() * 10000)
  	//const meme = chatter.message.split('').map(char => Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()).join('')

    switch (chatmessage[0]) {
    	case "!test":
    		if (chatter.username === 'shadowbeatz'){
    			if (canSend(30, last_use[0])){
    				last_use[0] = new Date().getTime()
    				Bot.say('yes?')
					online = 1
    			}
    		}
    		break;

    	case "!br":
    		if (canSend(30, last_use[1])){
    			last_use[1] = new Date().getTime()
    			Bot.say('He is not playing Battle Royale games. They\'re boring and stupid beatzDisgust')
    		}
    		break;

    	case "!destiny2":
    		if (canSend(30, last_use[2])){
    			last_use[2] = new Date().getTime()
    			Bot.say('it\'s good')
    		}
    		break;

    	case "!fuckyoulas":
    		if (canSend(30, last_use[3])){
    			last_use[3] = new Date().getTime()
    			Bot.say('r')
    		}
    		break;

    	case "!gameinfo":
    		if (canSend(30, last_use[4])){
    			last_use[4] = new Date().getTime()
    			Bot.say('http://www.google.com')
    		}
    		break;

			case "!hints":
    		if (canSend(30, last_use[5])){
    			last_use[5] = new Date().getTime()
    			Bot.say('	DON\'T *** SAY ANYTHING ABOUT THE GAME OR THE PUZZLES YOU *** JERKOFFS beatzDisgust')
    		}
    		break;

			case "!monitor":
    		if (canSend(30, last_use[6])){
    			last_use[6] = new Date().getTime()
    			Bot.say('His monitor is an ASUS VG248QE, shut the fuck up now')
    		}
    		break;

			case "!sub":
    		if (canSend(30, last_use[7])){
    			last_use[7] = new Date().getTime()
    			Bot.say('Fine. If you want to waste your money. https://www.twitch.tv/products/shadowbeatz/ticket beatzDisgust')
    		}
    		break;

			case "!thoughts":
    		if (canSend(30, last_use[8])){
    			last_use[8] = new Date().getTime()
    			Bot.say('Whatever it is your asking about, Shadow doesn\'t care. Baka.')
    		}
    		break;

			case "!worth":
    		if (canSend(30, last_use[9])){
    			last_use[9] = new Date().getTime()
    			Bot.say('Play it yourself, asshat beatzDisgust')
    		}
    		break;

			case "beatzSigh":
    		if (canSend(30, last_use[10])){
    			last_use[10] = new Date().getTime()
    			Bot.say('beatzSigh')
    		}
    		break;

			case "fu":
    		if (canSend(30, last_use[11])){
    			last_use[11] = new Date().getTime()
    			Bot.say('( ͡° ͜ʖ ͡°)╭∩╮')
    		}
    		break;

			case "jimmy":
    		if (canSend(30, last_use[12])){
    			last_use[12] = new Date().getTime()
    			Bot.say('Fuck Jimmy')
    		}
    		break;

			case "speedyRocket2":
    		if (canSend(30, last_use[13])){
    			last_use[13] = new Date().getTime()
    			Bot.say('You mean speedyRocket1 speedyRocket2')
    		}
    		break;

			case "o/":
    		if (chatter.username === 'shadowbeatz')
    			Bot.say('beatzLeave')
				online = 0
    		break;

    	case "banger":
    		if (canSend(30, last_use[16])){
    			last_use[16] = new Date().getTime()
    			Bot.say('FuyumiJam')
    		}
    		break;	

    	case "november":	
    		if (canSend(30, last_use[17])){
    			last_use[17] = new Date().getTime()
    			Bot.say(':no_entry: beatzMeat beatzBaka')
    		break;
    		}	

			}

		if (chatter.message.includes('sidearms')){
			if (canSend(30, last_use[15])){
    			last_use[15] = new Date().getTime()
    			Bot.say('beatzSigh')
		  	}
		  } 

		if (chatter.message.includes('snowyb7AAAAAHHHHHHHHHHAAAAA')){
			if (canSend(30, last_use[14])){
    			last_use[14] = new Date().getTime()
    			Bot.say('Please never bring that abomination into this chat ever again.')
		  	}
		  }      

		if (chatter.message.includes('flying59Wat')){
			if (canSend(30, last_use[18])){
    			last_use[14] = new Date().getTime()
    			Bot.say('Please never bring that abomination into this chat ever again.')
		  	}
		  }

  		if (chatter.username === 'profbasara'){
  			if (chatter.message.includes('live or')){
  				Bot.say('It\'s obviously a repeat @ProfBasara I don\'t know why you keep asking that')
				}
			}        

			if (chatter.username === 'kirika_sama'){
  			if (chatter.message === 'OH SHIT YOGURT FIGHT!!!! beatzMeat beatzMeat beatzMeat'){
  				Bot.say('TWO YOGURTS ENTER! ONE YOGURT LEAVES!')
				}
			}

			if (num == 69){
				Bot.say('@'+chatter.display_name+' can you please shut up?')
				setTimeout(() => { Bot.say('beatzSmug') }, 5000)
			}

			if (chatter.message.toLowerCase().includes('!followage')){
				Bot.say('@'+chatter.display_name+' Just click on your name and chat and you can see')
			}

		// if (chatter.username === 'harvey_')
		// 	Bot.say('shut up harvey') 				
  })
})  	

	Bot.on('subscription', event => {
		if (event.msg_param_cumulative_months == 69){
            Bot.say("@"+event.display_name+" Nice beatzWICKED")
    }else{
			if (event.msg_param_sub_plan == '1000' && event.msg_id == 'sub'){
				Bot.say("@"+event.display_name+" Ha. Weeb.")
			}
		}
	});



	ttsqueue = []
	currently_speaking = false

	async function mayne(name){
					currently_speaking = true
	 	 			await speaketh()
	 	 			console.log(name+'\'s message has been spoken.')
	 	 			if(ttsqueue.length !=0){
	 	 				mayne(name)
	 	 			}else{
	 	 				currently_speaking = false
	 	 			} 	 			
 	 		}

 	 function speaketh (){
 	 	return new Promise((resolve, reject) =>{
 			ttssay = ttsqueue.shift()
 	 		tts.speak(ttssay, 'IVONA 2 Brian OEM', 1.0, (err) =>{ //'Microsoft Haruka Desktop'
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
	if(online === 1){
 	 if (highlight.msg_id == 'highlighted-message' && !blacklist.includes("nigger")){
 	 		ttsqueue.push(highlight.message)
 	 	if(currently_speaking == false){
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