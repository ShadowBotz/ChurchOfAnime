// Import packages/set variables (constants)
const Discord = require('discord.js');
const client = new Discord.Client();

// Creates an event listener for bot ready-state
client.on('ready', () => {
	console.log('bot running')
});

// Creates an event listener for messages
client.on('message', message => {
  if (message.content === '!alerts') {
    message.member.addRole('RoleIDHere')
    .then(message.channel.send('You have been added to the alerts list :)'))
  	.then(console.log('role added'))
  	.catch(console.error);
  }
});

//Each discord bot has a unique token
client.login('YourTokenHere');