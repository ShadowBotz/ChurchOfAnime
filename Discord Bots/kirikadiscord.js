// Import packages/set variables (constants)
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS], partials: ["CHANNEL"] });
const schedule = require('node-schedule');
const fetch = require('node-fetch');
const fs = require('fs');
var oauth = require('./oauth.js')

//Each discord bot has a unique token
client.login(oauth.KirikaID);

//channels = {
			//'#stream-notifications': '607817203588268062',
            //'#general': '172065393525915648',
            //'#dank-memes': '172252229145853953',
            //'#music': '505350390624026649',
            //'#music-bot': '241315605268004864',
            //'#sports': '299346622985273344',
            //'#animals': '303289203372982272',
            //'#art': '312022293297627137',
            //'#homework': '413796637316743180',
            //'#dildos_dingeon': '505656174130102274',
            //'#super-secret-room': '585895101755293716',
            //'#test': '607815006633066496',
            //'#ventriloquism': '608509082835484702',
            //'#oyashiro-samas_shrine': '175925024098746369',
            //'#angel_mort': '365676420497801217',
            //'#watanagashi_festival': '509889368119312407',
            //'#irie_clinic': '362329489251893248',
            //'#gaming': '291006182968000512',
            //'#destiny': '360855930696368128',
            //'#gunfus': '444416499994591232',
            //'#gacha': '431717257303949313',
            //'#pokemans': '399132363386519562',
            //'#streams': '385978335425069056',
            //'#politics': '604406416589062154',
            //'#wall': '350128099154984961',
            //'#mexico': '350128528781606913',
            //'#wall_mexico_built': '399136880861642753',
            //'#normie_talk': '399136595929726976',
            //'#room_1_text': '367206706406490112',
            //'#room_2_text': '367206982781894667',
            //}

// Creates an event listener for bot ready-state
client.on('ready', () => {
	console.log('bot running')
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
          .then(console.log('alerts role added for '+message.author.username+''))
          .catch(console.error);
      }

      if (message.content === '!vtubeon' && message.author != undefined) {
       //console.log(client.guilds.cache.get('172065393525915648'))
       client.guilds.cache.get('172065393525915648').members.cache.get(message.author.id).roles.add('859218117833916437')
        .then(message.channel.send('Welcome to the official Church of Anime v-tuber ~~simp~~ fan club <:KirikaSmile:608201680374464532>'))
          .then(console.log('v-tube role added for '+message.author.username+''))
          .catch(console.error);
      }

      if (message.channel.id === '608509082835484702' && message.author.id === '124044415634243584') {
      	yeet = message.content.split(" ")
      	poundDel = yeet[1].substring(2, yeet[1].length-1)
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
        if(message.author.id !='607807501722845202') {
      	   if (sup.includes('kirika')) {
      		try{
            message.channel.send('Hi <@'+message.author.id+'> <:KirikaSmile:608201680374464532>')
          }
          catch(error){
            console.log(error)
            }
      	   }
          }

      }

	  if (message.channelId === '931407561792565280' && message.content.includes('6/6')) {
		message.channel.send('<@'+message.author.id+'> close one <:monkaW:717247350397075466>')
	  }

	  if (message.channel.name === 'general') {
		message.react('📦');
	  }

      if (message.content.includes('!bd')) {
      	if (message.content.substring(0,3) === '!bd') {
      		if (message.author.username === 'ShadowBeatz') {
      	   		fs.readFile('birthdays.json', 'utf8', (err, data)=>{
      	   		cake = message.content.split(" ")
      	    	birthday = JSON.parse(data)


      	    	if(birthday[cake[1]] === undefined){
      	     		birthday[cake[1]] = {"ID": cake[2].match(/([0-9])+/g)}
      	     		fs.writeFile('birthdays.json', JSON.stringify(birthday), (err)=>{
      	     		if (err) throw err;
      	     		})
      	       }else{birthday[cake[1]].ID.push(cake[2].match(/([0-9])+/g))
      	     		fs.writeFile('birthdays.json', JSON.stringify(birthday), (err)=>{
      	     			if (err) throw err;
      	     		})
      	     		}  	   
      	   		}) 
      		}

      		if (message.author.username != 'ShadowBeatz') {
      			fs.readFile('birthdays.json', 'utf8', (err, data)=>{
      			cake = message.content.split(" ")
      			birthday = JSON.parse(data)
      			AID = message.author.id

 
      			temp = 0
      			Object.keys(birthday).forEach(function(key){
    				if(birthday[key].ID.includes(AID)){
    					temp = temp + 1			
    				}
				})

					if(temp==0){
						if (cake[2] != undefined) {
							month = cake[1].toLowerCase()
							day = cake[2]					
							function twoNumbs(Input){
							return Input.toString().length > 1 ? Input.toString()  : "0"+Input.toString()
							}

							if (month === 'jan') {
								month = '00'					
							}else if (month === 'feb') {
								month = '01'
							}else if (month === 'mar') {
								month = '02'
							}else if (month === 'apr') {
								month = '03'
							}else if (month === 'may') {
								month = '04'
							}else if (month === 'jun') {
								month = '05'
							}else if (month === 'jul') {
								month = '06'
							}else if (month === 'aug') {
								month = '07'
							}else if (month === 'sep') {
								month = '08'
							}else if (month === 'oct') {
								month = '09'
							}else if (month === 'nov') {
								month = '10'
							}else if (month === 'dec') {
								month = '11'
							}else{
								month = 'undefined'
							}
					
							bday = month+twoNumbs(day)
						
								if (month === 'undefined'){
									message.channel.send('I\'m sorry, you\'re going to have to help me out here. I was shot in the head after all <:KirikaSmile:608201680374464532> Try formatting your birthday with the first 3 letters of the month, then two digits for the day. Like "Jun 09"')
								}else if (["00", "02", "04", "06", "07", "09", "11"].includes(month)){
									if (day < "32"){
										if(birthday[bday] === undefined){
      	     								birthday[bday] = {"ID": [AID]}
      	     								setTimeout(()=>{fs.writeFile('birthdays.json', JSON.stringify(birthday), (err)=>{
      	     								if (err) throw err;
      	     								})
                          }, 2000)
      	       							}else{birthday[bday].ID.push(AID)
      	     								setTimeout(()=>{fs.writeFile('birthdays.json', JSON.stringify(birthday), (err)=>{
                            if (err) throw err;
                            })
                          }, 2000)
      	     								}
										message.channel.send('Got it <:KirikaSmile:608201680374464532>')
									}else{
										message.channel.send('Funny joke but please enter a day that actually exists. You won\'t get the pretty gold name otherwise <:KirikaSmile:608201680374464532>')
									}
								}else if (["03", "05", "08", "10"].includes(month)){
									if (day < "31"){
										if(birthday[bday] === undefined){
      	     								birthday[bday] = {"ID": [AID]}
      	     								setTimeout(()=>{fs.writeFile('birthdays.json', JSON.stringify(birthday), (err)=>{
                            if (err) throw err;
                            })
                          }, 2000)
      	       							}else{birthday[bday].ID.push(AID)
      	     								setTimeout(()=>{fs.writeFile('birthdays.json', JSON.stringify(birthday), (err)=>{
                            if (err) throw err;
                            })
                          }, 2000)
      	     								}
										message.channel.send('Got it <:KirikaSmile:608201680374464532>')
									}else{
										message.channel.send('Funny joke but please enter a day that actually exists. You won\'t get the pretty gold name otherwise <:KirikaSmile:608201680374464532>')
									}	
								}else if (month === "01"){
									if (day < "29"){
										if(birthday[bday] === undefined){
      	     								birthday[bday] = {"ID": [AID]}
      	     								setTimeout(()=>{fs.writeFile('birthdays.json', JSON.stringify(birthday), (err)=>{
                            if (err) throw err;
                            })
                          }, 2000)
      	       							}else{birthday[bday].ID.push(AID)
      	     								setTimeout(()=>{fs.writeFile('birthdays.json', JSON.stringify(birthday), (err)=>{
                            if (err) throw err;
                            })
                          }, 2000)
      	     								}
										message.channel.send('Got it <:KirikaSmile:608201680374464532>')
									}else if (day === "29"){
										if(birthday[bday] === undefined){
      	     								birthday[bday] = {"ID": [AID]}
      	     								setTimeout(()=>{fs.writeFile('birthdays.json', JSON.stringify(birthday), (err)=>{
                            if (err) throw err;
                            })
                          }, 2000)
      	       							}else{birthday[bday].ID.push(AID)
      	     								setTimeout(()=>{fs.writeFile('birthdays.json', JSON.stringify(birthday), (err)=>{
                            if (err) throw err;
                            })
                          }, 2000)
      	     								}
										message.channel.send('Oh wow. A leap year baby! <:KirikaSmile:608201680374464532>')
									}else{
										message.channel.send('Funny joke but please enter a day that actually exists. You won\'t get the pretty gold name otherwise <:KirikaSmile:608201680374464532>')
									}
								}
						}else{
							message.channel.send('spacebars help <:KirikaSmile:608201680374464532> Just like this: !bd Apr 20')
							}
					
					}else{
						temp=0
				}
					
      			})
      		}
      	}	
      }

	  function TitleCase(Input){
		Input = Input.toLowerCase().split(" ");

		for (var i = 0; i < Input.length; i++){
			if (Input[i].length === 2){
				Input [i] = Input[i].toUpperCase();
			}else{
			Input[i] = Input[i].charAt(0).toUpperCase() + Input[i].slice(1);
			}
		}

		return Input.join(' ');
	  }

	  function username(Input){
		if (client.guilds.cache.get('172065393525915648').members.cache.get(Input) != undefined){
			if (client.guilds.cache.get('172065393525915648').members.cache.get(Input).nickname != null){
				return client.guilds.cache.get('172065393525915648').members.cache.get(Input).nickname	
			}else{
				return client.guilds.cache.get('172065393525915648').members.cache.get(Input).user.username
			}				
		}else{
			return ("a mystery person")
		}
	  }


	  if (splt[0] === "!addteam"){

		fs.readFile('sports.json', 'utf8', (err, data)=>{
			sports = JSON.parse(data)
			AID = message.author.id
			teamInput = splt.slice(2).join(' ')
			teamInputLength = teamInput.split(" ")
			team = TitleCase(teamInput)			
		
		if (sports[splt[1].toUpperCase()] === undefined){
			//sports[splt[1].toUpperCase()] = {[team]: [AID]}
			//fs.writeFile('sports.json', JSON.stringify(sports), (err)=>{
			//	if (err) throw err;
			//})
			message.channel.send('<@'+message.author.id+'> I\'m not familiar with that league <:beatzPosh:824832391792427011> Currently we\'re only keeping track of MLB, NFL, NHL, NBA, MLS, WNBA and XFL teams, with college sports hopefully coming soon <:KirikaSmile:608201680374464532> Sorry if you feel left out but ShadowBeatz is just a dumb American and can only do so much :flag_us:')
		}else{
			
		if (sports[splt[1].toUpperCase()][team] === undefined){
			if (splt[1].toUpperCase() === 'MLS'){
				message.channel.send('<@'+message.author.id+'> Is that a real team? <:beatzSusAF:549413960948908063> MLS teams are weird. Try spelling out the whole city name, abbreviating "Football Club/Soccer Club" to "FC/SC", or adding "FC/SC" to the name')
			}else{
				message.channel.send('<@'+message.author.id+'> That\'s not a real team <:beatzSusAF:549413960948908063> Are you sure you spelled it right?')
				console.log(sports[splt[1].toUpperCase()])
			}
			}else{ if (sports[splt[1].toUpperCase()][team].fans.find(element => element === AID) != undefined){
				message.channel.send('<@'+message.author.id+'> You already added that <:beatzSusAF:549413960948908063>')
			}else{
				chant = sports[splt[1].toUpperCase()][team].chant
			    modifier = sports[splt[1].toUpperCase()][team].modifier

				sports[splt[1].toUpperCase()][team].fans.push(AID)
				fs.writeFile('sports.json', JSON.stringify(sports), (err)=>{
					if (err) throw err;

					if (sports[splt[1].toUpperCase()][team].fans.length < 2){

						message.channel.send('<@'+message.author.id+'> A fan of ' +modifier+ '' +team+ ' huh? ' +chant+ '')

					}else{
						message.channel.send('<@'+message.author.id+'> Another fan of ' +modifier+ '' +team+ '! You\'re among friends here ' +chant+ '')
					}
					
			})}
		}		
		
				
			}}
			)}

	  if (splt[0] === 'yur'){
		fs.readFile('sports.json', 'utf8', (err, data)=>{

			sports = JSON.parse(data)

			console.log(sports.MLB['Boston Red Sox'])
	  	})
	}	

	  if (splt[0] === '!fans'){
		fs.readFile('sports.json', 'utf8', (err, data)=>{
			sports = JSON.parse(data)
			teamInput = splt.slice(1).join(' ')
			teamInputLength = teamInput.split(" ")
			team = TitleCase(teamInput)

			let LeaguesEntries = Object.entries(sports) 

			let outcome = undefined

			for (let i = 0; i < LeaguesEntries.length; i++){
 			  if(LeaguesEntries[i][1][team] != undefined){
  			    outcome = [LeaguesEntries[i][0], LeaguesEntries[i][1][team]]
 			  }
			}

			if (outcome === undefined){
				message.channel.send('What? <:beatzSusAF:549413960948908063> What team is that? Is that a typo?')
			}else{
			modifier = outcome[1].modifier
			chant = outcome[1].chant
			
			if (outcome[1].fans.length < 1){
				message.channel.send('Nobody likes ' +modifier+ '' +team+ ' <:beatzF:384222351186853891>')
			}else if (outcome[1].fans.length === 1){
				message.channel.send(''+username(outcome[1].fans[0])+' is the ' +team+ ' fan in this discord '+chant+'')
			}else if (outcome[1].fans.length > 1){				
				fan = []				

				for (let i = 0; i < outcome[1].fans.length; i++){
					fan.push(username(outcome[1].fans[i]))
				}

				last = fan.pop()
				
				message.channel.send(''+fan.join(', ')+ ' and ' +last+ ' are the ' +team+ ' fans in this discord '+chant+'')
			}
		}
		})
	  }

	  if (splt[0] === '!teams'){
		if (splt[1][1] != '@'){
			message.channel.send('You need to use "@" to tag the person who you want the teams of so I can look them up properly <:KirikaSmile:608201680374464532>')	
		}else{
		fs.readFile('sports.json', 'utf8', (err, data)=>{
			sports = JSON.parse(data)
			id = splt[1].slice(2, -1)

			let LeaguesEntries = Object.entries(sports)
			// let TeamsEntries = Object.entries(LeaguesEntries[0][1])
			// let FansEntries = Object.entries(TeamsEntries[0][1])
			userfandom = []

			for (let i = 0; i < LeaguesEntries.length; i++){
				let TeamsEntries = Object.entries(LeaguesEntries[i][1])				
				for (let j = 0; j < TeamsEntries.length; j++){
					let FansEntries = Object.entries(TeamsEntries[j][1])
					//console.log (FansEntries[0][1])
					if (FansEntries[0][1].includes(id)){
				   	userfandom.push(TeamsEntries[j][0])
						}
					}
			    }

			if (userfandom.length < 1){
				message.channel.send(''+username(id)+' hasn\'t told me who their favorite teams are yet <:beatzDespair:1019839939522859109> Maybe they don\'t like sports')
			}
			if (userfandom.length === 1){
				message.channel.send(''+username(id)+' is just a ' +userfandom[0]+ ' fan <:KirikaSmile:608201680374464532>')
			}
			if (userfandom.length > 1){

				last = userfandom.pop()
			
				message.channel.send(''+username(id)+' is a '+userfandom.join(', ')+ ' and ' +last+ ' fan <:KirikaSmile:608201680374464532>')
			}
			
			

		})
		}
	  }

	  if (splt[0] === '!scores'){
		//fs.readFile('sports.json', 'utf8', (err, data)=>{
			// sports = JSON.parse(data)

			// let LeaguesEntries = Object.entries(sports)
			// let outcome = undefined

			function getScores(sport, league){
				return new Promise(async function(resolve, reject){
				   const req = new fetch.Request('http://site.api.espn.com/apis/site/v2/sports/'+sport+'/'+league+'/scoreboard', {
					  method: 'get',
					  headers: {},
					  redirect: 'follow'
					  });
						  make_request = await fetch(req)                                                              //sends the request
						  format_resolved_request = await make_request.json()                   //formats the raw request into JSON
					  
					  if(format_resolved_request.events[0]!=undefined){                
						  games = []

						  for (i = 0; i < format_resolved_request.events.length; i++){
							games.push([format_resolved_request.events[i].competitions[0].competitors[0].team.displayName, format_resolved_request.events[i].competitions[0].competitors[0].winner])
							games.push([format_resolved_request.events[i].competitions[0].competitors[1].team.displayName, format_resolved_request.events[i].competitions[0].competitors[1].winner])
						  }

						  console.log(games)

						  resolve(games)												 				                                            
					  }else{
						  reject()
					  }
					  
					//   setTimeout(()=>{console.log(games, (err)=>{
					// 	if (err) throw err;
					// 	})
					//   }, 4000)
					  //message.channel.send(''+games.join(' - ')+'')       
			  })                                             
		  }
		  getScores(splt[1], splt[2])
		//})
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

    }else{
        //console.log(message)
    }
});

// Assigns the streamer role to anyone live on Twitch

client.on('presenceUpdate', (oldMember, newMember) => {
  if (newMember.userId === '124044415634243584'){
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
  currentlyStreaming = 0
	if (a != undefined) {
    newMember.activities.forEach((element, index) => {
      if (element.type === 'STREAMING') {
        currentlyStreaming += 1
      } 
    })
	}

	if (newMember.userId === '124044415634243584'){
		if (a === undefined && oldMember.activities[0] != undefined){
			if (oldMember.activities[0].type === 'STREAMING'){
				client.channels.cache.get('607817203588268062').send(('The stream is over, but if you missed it, you can watch the stream on the new VOD channel here (just give it an hour or two, depending on the length of the stream <:KirikaSmile:608201680374464532>) https://www.youtube.com/channel/UCkQBMVEYiDg3jqc2mcjlThA'))
			}
		}	
	}

    if(currentlyStreaming >= 1){
      client.guilds.cache.get('172065393525915648').members.cache.get(newMember.userId).roles.add('610621341984489472')
              if (newMember.userId === '124044415634243584') {
                 if (oldMember.activities[0] != undefined) {
                   if (oldMember.activities[0].type != 'STREAMING') {
                      client.channels.cache.get('607817203588268062').send(('<@&607809003665489930> Streaming some ' +a.state+ ' <:KirikaSmile:608201680374464532> "' +a.details+ '" http://www.twitch.tv/ShadowBeatz'))
                   }
                 }
              if (oldMember.activities[0] === undefined) {
                 client.channels.cache.get('607817203588268062').send(('<@&607809003665489930> Streaming some ' +a.state+ ' <:KirikaSmile:608201680374464532> "' +a.details+ '" http://www.twitch.tv/ShadowBeatz'))  
              }
              console.log(newMember.activities[0])
              }
    }else{
      if (client.guilds.cache.get('172065393525915648').members.cache.get(newMember.userId) != undefined) {
	  	  if (client.guilds.cache.get('172065393525915648').members.cache.get(newMember.userId)._roles.includes('610621341984489472')) {
              client.guilds.cache.get('172065393525915648').members.cache.get(newMember.userId).roles.remove('610621341984489472')
      }
    }else{
		console.log(newMember)
		 }
		} 


	if (a === undefined && oldMember != null) {
		if (oldMember.activities[0] != undefined) {
			if (oldMember.activities[0].type === 'STREAMING'){
				if (client.guilds.cache.get('172065393525915648').members.cache.get(newMember.userId) != undefined){
					client.guilds.cache.get('172065393525915648').members.cache.get(newMember.userId).roles.remove('610621341984489472')
				}
			}
		}
	}     	  
});

// Gets Kirika to say Happy Birthday

client.on('guildMemberUpdate', (oldMember, newMember) => {
	if (newMember._roles.includes('379807620141154314') && !oldMember._roles.includes('379807620141154314')) {
		client.channels.cache.get('172252229145853953').send(('Happy Birthday <@'+newMember.user.id+'> <:KirikaSmile:608201680374464532> :cake:'))	
  }

});

// Gets Kirika to say "good morning"

schedule.scheduleJob('2 0 8 * * *', function(){
	client.channels.cache.get('172252229145853953').send(('Good morning <:KirikaSmile:608201680374464532>'))
});

// Gets Kirika to give the Birthday Weeb role to whoever's birthday it is

schedule.scheduleJob('2 0 0 * * *', function(){
	fs.readFile('birthdays.json', 'utf8', (err, data)=>{
	birthday = JSON.parse(data)	
	function twoNumbs(Input){
	return Input > 9 ? Input.toString()  : "0"+Input.toString()
	}

	date = new Date
	date = twoNumbs(date.getMonth()) + twoNumbs(date.getDate())
		//console.log(client.fetchUser('214954544444997632'))
	if (birthday[date] != undefined){
    	for (i=0; i<birthday[date].ID.length; i++){
        guild = client.guilds.cache.get('172065393525915648')
         	if (guild.members.cache.get(birthday[date].ID[i]) != null && guild.members.cache.get(birthday[date].ID[i]) != undefined){
            client.guilds.cache.get('172065393525915648').members.cache.get(birthday[date].ID[i]).roles.add('379807620141154314')}
          }
        //birthday[date].Posted = "1"
        //fs.writeFile('birthdays.json', JSON.stringify(birthday), (err)=>{
         	//if (err) throw err;
         	//else console.log('Role added')
        //})
}
})
});

schedule.scheduleJob('10 0 0 10 10 *', function(){
   client.channels.cache.get('172252229145853953').send(('Happy Birthday <@171887129637552128>\'s daughter <:KirikaSmile:608201680374464532> :cake:'))
});

//Kirika assigns the tts role randomly at midnight

schedule.scheduleJob('0 1 0 * * *', function(){
   randomUser = client.guilds.cache.get('172065393525915648').members.cache.random();
   tts = randomUser.id;
   Weeb = client.guilds.cache.get('172065393525915648').members.cache.get(tts).user.username;
  
  if (tts != '607807501722845202' || tts != '607824305119821855') { //makes sure Kirika or Fuyumi can't be weeb of the day
      client.guilds.cache.get('172065393525915648').members.cache.get(tts).roles.add('762186129918394399');
      client.channels.cache.get('607815006633066496').send(''+Weeb+' (ID: '+tts+') is the weeb of the day <:KirikaSmile:608201680374464532>')
  }
});