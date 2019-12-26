// Import packages/set variables (constants)
const Discord = require('discord.js');
const client = new Discord.Client();
const schedule = require('node-schedule');
const fs = require('fs');

//Each discord bot has a unique token
client.login('NjA3ODI0MzA1MTE5ODIxODU1.XUfPVQ.ROSFvhtBdIWd5vqamg-1_5iKYgI');

// Creates an event listener for bot ready-state
client.on('ready', () => {
	console.log('bot running')
});

// Creates an event listener for messages
client.on('message', message => {
    if (message.channel.type === 'text' && message.member != 'null') {
      if (message.content === '!alertsoff') {
        message.member.removeRole('607809003665489930')
        .then(message.channel.send('K bye.'))
          .then(console.log('role removed'))
          .catch(console.error);
      }

      if (message.channel.name === 'ventriloquism' && message.author.username === 'ShadowBeatz') {
      	yeet = message.content.split(" ")
      	poundDel = yeet[1].substring(2, yeet[1].length-1)
      	if (yeet[0] === 'fuyumi') {
      		client.channels.get(poundDel).send(yeet.slice(2).join(' '))
			//console.log(yeet[1].substr(0,i)+yeet[1].substr(i+1))
        	
      	}
      }

      if (message.content === '!weeblist') {
      	message.channel.send('"kyoniwasawa" <:pepeLaugh:619388817236951070> https://myanimelist.net/animelist/KyonIwasawa')
      }


      sup = message.content.toLowerCase()
      if (sup.includes('hi') || sup.includes('hey') || sup.includes('greetings') || sup.includes('ohayo') || sup.includes('konbanwa')) {
      	if (sup === 'hi fuyumi' || sup === 'hey fuyumi' || sup === 'greetings fuyumi' || sup === 'ohayo fuyumi' || sup === 'konbanwa fuyumi') {
      		message.channel.send('Hello <@'+message.member.id+'>')
      	}
      }

      if (message.content.includes('!bd')) {
      	if (message.content.substring(0,3) === '!bd') {
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
						if (message.content.toLowerCase() === '!bd feb 29') {
      						message.channel.send('You were not born on February 29th you damn liar.')
      						}	
					}else{
						message.channel.send('Your birthday is already logged idiot. Ask Shadow to fix it if you messed it up.')
						temp=0
					}
    			})
			}
      	}
      		
      	
      }	  

    }else{
        console.log(message)
    }
});

// Gets Fuyumi to remind the special snowflake it ain't their birthday anymore

client.on('guildMemberUpdate', (oldMember, newMember) => {
	if (oldMember._roles.includes('379807620141154314') && !newMember._roles.includes('379807620141154314'))
		client.channels.get('172252229145853953').send(('Sorry, party\'s over <@'+newMember.user.id+'>'))
});

// Gets Fuyumi to take away the Birthday Weeb role at the end of the day

schedule.scheduleJob('58 59 23 * * *', function(){
	fs.readFile('birthdays.json', 'utf8', (err, data)=>{
	birthday = JSON.parse(data)	
	function twoNumbs(Input){
	return Input > 9 ? Input.toString()  : "0"+Input.toString()
	}

	date = new Date
	date = twoNumbs(date.getMonth()) + twoNumbs(date.getDate())
	if (birthday[date] != undefined){
    	for (i=0; i<birthday[date].ID.length; i++){
         	client.guilds.get('172065393525915648').members.get(birthday[date].ID[i]).removeRole('379807620141154314')}
        //birthday[date].Posted = "0"
        //fs.writeFile('birthdays.json', JSON.stringify(birthday), (err)=>{
         	//if (err) throw err;
         	//else console.log('Role removed')
        //})
}
})
});