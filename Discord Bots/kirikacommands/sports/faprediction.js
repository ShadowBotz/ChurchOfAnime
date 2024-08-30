const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('faprediction')
		.setDescription('Kirika will tell you where she thinks a player will sign')
        .addStringOption(option =>
            option.setName('league')
                .setDescription('The league that the player plays in')
                .setRequired(true)
                .addChoices(
					{ name: 'MLB', value: 'MLB' },
					{ name: 'NBA', value: 'NBA' },
					{ name: 'NFL', value: 'NFL' },
                    { name: 'NHL', value: 'NHL' },
                    { name: 'WNBA', value: 'WNBA' },
				))
        .addStringOption(option =>
            option.setName('player')
                .setDescription('The player to predict for')
                .setRequired(true)
                ),
        
	async execute(interaction) {

        let LEAGUE = interaction.options.getString('league');
        let PLAYER = interaction.options.getString('player');

        const randomNumber = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
    
        fs.readFile('sports.json', 'utf8', (err, data) => {
            sports = JSON.parse(data)

            let TeamsEntries = Object.entries(sports[LEAGUE])
        
            let randomTeam = TeamsEntries[randomNumber(0, (TeamsEntries.length - 1))][0]

            return interaction.reply(`My sources say that ${PLAYER} is going to go to the ${randomTeam} <:KirikaSmile:608201680374464532>`)

        }) 
	},
};