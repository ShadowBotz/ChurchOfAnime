const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { EmbedBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Displays your Wordle statistics.')
        .addUserOption(option =>
            option.setName('username')
                .setDescription('Name of the person whose stats you\'d like to see (leave blank to check your own)')
                ),
	async execute(interaction) {
        const guild = interaction.member.guild;
        const id = interaction.user.id
        const searchid = interaction.options.getUser('username');

        function username(Input) {
            if (guild.members.cache.get(Input) != undefined) {
                if (guild.members.cache.get(Input).nickname != null) {
                    return guild.members.cache.get(Input).nickname
                } else {
                    return guild.members.cache.get(Input).user.globalName
                }
            } else {
                return ("a mystery person")
            }
        }

        fs.readFile('wordlescores.json', 'utf8', (err, data) => {
            wordle = JSON.parse(data)

            if (searchid === null){
                if (wordle[id] === undefined){
                    interaction.reply('<@'+id+'> You never gave me any of your scores so you don\'t have any stats.')
                }else{
                    const wordleStatsEmbed = new EmbedBuilder()
                    .setColor(2173288)
                    .setTitle(username(id) +' Wordle Stats')
                    .setThumbnail(guild.members.cache.get(id).user.displayAvatarURL())
                    .addFields(
                        { name: '\u200B', value: 'Monthly Average Score: ' + Math.round((wordle[id].SCORE / wordle[id].GAMES + Number.EPSILON) * 1000) / 1000 + '\nMonthly Average Guesses: ' + Math.round((wordle[id].GUESSES / wordle[id].GAMES + Number.EPSILON) * 1000) / 1000 + '\nMonthly Total Score: ' + wordle[id].SCORE + '\nMonthly Games: ' + wordle[id].GAMES + '\n===================================\nBest Score: ' + wordle[id].bestSCORE + '\nCareer Games: ' + wordle[id].careerGAMES + '\nCareer Average Guesses: ' + Math.round((wordle[id].careerGUESSES / wordle[id].careerGAMES + Number.EPSILON) * 1000) / 1000 + '\nCareer Games Failed: ' + wordle[id].careerFAILURES}
                    )
    
                    setTimeout(() => {return interaction.reply({ embeds: [wordleStatsEmbed] })},1000)
                } 
            } else {
                if (wordle[searchid.id] === undefined){
                    interaction.reply(username(searchid.id)+' never gave me their scores so they don\'t have any stats.')
                }else{
                    const wordleStatsEmbed = new EmbedBuilder()
                    .setColor(2173288)
                    .setTitle(username(searchid.id) +' Wordle Stats')
                    .setThumbnail(guild.members.cache.get(searchid.id).user.displayAvatarURL())
                    .addFields(
                        { name: '\u200B', value: 'Monthly Average Score: ' + Math.round((wordle[searchid.id].SCORE / wordle[searchid.id].GAMES + Number.EPSILON) * 1000) / 1000 + '\nMonthly Average Guesses: ' + Math.round((wordle[searchid.id].GUESSES / wordle[searchid.id].GAMES + Number.EPSILON) * 1000) / 1000 + '\nMonthly Total Score: ' + wordle[searchid.id].SCORE + '\nMonthly Games: ' + wordle[searchid.id].GAMES + '\n===================================\nBest Score: ' + wordle[searchid.id].bestSCORE + '\nCareer Games: ' + wordle[searchid.id].careerGAMES + '\nCareer Average Guesses: ' + Math.round((wordle[searchid.id].careerGUESSES / wordle[searchid.id].careerGAMES + Number.EPSILON) * 1000) / 1000 + '\nCareer Games Failed: ' + wordle[searchid.id].careerFAILURES}
                    )
    
                    setTimeout(() => {return interaction.reply({ embeds: [wordleStatsEmbed] })},1000)
                } 
            }
                      
        })
	},
};