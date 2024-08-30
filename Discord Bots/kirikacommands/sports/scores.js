const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('scores')
		.setDescription('Displays the daily scores for a certain league')
        .addStringOption(option =>
            option.setName('league')
                .setDescription('The league you want the scores for')
                .setRequired(true)
                .addChoices(
					{ name: 'MLB', value: 'mlb' },
					{ name: 'NBA', value: 'nba' },
                    { name: 'NCAAF', value: 'college-football' },
					{ name: 'NFL', value: 'nfl' },
                    { name: 'NHL', value: 'nhl' },
                    { name: 'WNBA', value: 'wnba' },
				)),
	async execute(interaction) {
    
        LEAGUE = interaction.options.getString('league');
        SPORT = undefined

            if (LEAGUE === 'nfl') {
                SPORT = 'football'
            }
            if (LEAGUE === 'nhl') {
                SPORT = 'hockey'
            }
            if (LEAGUE === 'nba') {
                SPORT = 'basketball'
            }
            if (LEAGUE === 'mlb') {
                SPORT = 'baseball'
            }
            if (LEAGUE === 'college-football') {
                SPORT = 'football'
            }
            if (LEAGUE === 'wnba') {
                SPORT = 'basketball'
            }

            async function getScores(sport, league) {
                
                    try {
                        const req = await fetch('http://site.api.espn.com/apis/site/v2/sports/' + sport + '/' + league + '/scoreboard', {
                            method: 'get',
                            headers: {},
                            redirect: 'follow'
                        });

                        //sends the request
                        espn = await req.json()                   //formats the raw request into JSON

                        if (espn.events[0] != undefined) {
                            games = []

                            games.push(espn.leagues[0].logos[0].href)

                            for (i = 0; i < espn.events.length; i++) {                               
                                if ((new Date().getTime()) - (Date.parse(espn.events[i].competitions[0].date)) < 86400000) {
                                    games.push([espn.events[i].competitions[0].competitors[1].team.shortDisplayName + " ", espn.events[i].competitions[0].competitors[1].score + " - ", espn.events[i].competitions[0].competitors[0].team.shortDisplayName + " ", espn.events[i].competitions[0].competitors[0].score + " (", espn.events[i].competitions[0].status.type.shortDetail + ")"])
                                } 
                            }

                            return (games)

                        } else {
                            return Promise.reject('getScores() Kirika Promise Error')
                        }                       
                    } catch (err) {
                        return interaction.reply('Hang on. ESPN is being a baka <:beatzBaka:1167640027652698312> Try again in a second'),
                        console.log(err)
                    }
                
            }

                getScores(SPORT, LEAGUE).then(a => {
                    logo = games.shift()

                    if (games.length < 1){
                        games.push('Doesn\'t look like there were any games today <:KirikaSmile:608201680374464532>')
                    }

                    
                        const scoresEmbed = new EmbedBuilder()
                            .setColor(8446019)
                            .setAuthor({ name: LEAGUE.toUpperCase() + ' Scoreboard', iconURL: '' + logo, url: 'https://www.' + LEAGUE + '.com' })
                            .addFields(
                                { name: '===================================', value: '' + games.join('\n\n').replaceAll(',', '') }
                            )

                        return interaction.reply({ embeds: [scoresEmbed] })
                    
                })
        
	},
};