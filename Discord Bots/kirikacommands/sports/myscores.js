const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('myscores')
		.setDescription('Displays the scores of your favorite teams (add teams with /addteam).'),
	async execute(interaction) {
        const guild = interaction.member.guild;

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

            SPORT = undefined
            LEAGUE = undefined
            scores = []

            fs.readFile('sports.json', 'utf8', (err, data) => {
                sports = JSON.parse(data)
                id = interaction.user.id

                let LeaguesEntries = Object.entries(sports)
                userfandom = []

                for (let i = 0; i < LeaguesEntries.length; i++) {
                    let TeamsEntries = Object.entries(LeaguesEntries[i][1])
                    for (let j = 0; j < TeamsEntries.length; j++) {
                        let FansEntries = Object.entries(TeamsEntries[j][1])
                        if (FansEntries[0][1].includes(id)) {
                            userfandom.push(LeaguesEntries[i][0], TeamsEntries[j][0])
                        }
                    }
                }

                fetchDeez = []


                if (userfandom.length < 1) {
                    return interaction.reply({content: '<@' + id + '> You gotta tell me which teams you root for first before I can give you your scores <:KirikaSmile:608201680374464532>', ephemeral: true})
                } else {

                    for (k = 0; k < userfandom.length; k += 2) {

                        SPORT = undefined
                        LEAGUE = undefined

                        league = userfandom[k]
                        if (league.toLowerCase() === 'nfl') {
                            SPORT = 'football'
                            LEAGUE = 'nfl'
                        }
                        if (league.toLowerCase() === 'nhl') {
                            SPORT = 'hockey'
                            LEAGUE = 'nhl'
                        }
                        if (league.toLowerCase() === 'nba') {
                            SPORT = 'basketball'
                            LEAGUE = 'nba'
                        }
                        if (league.toLowerCase() === 'mlb') {
                            SPORT = 'baseball'
                            LEAGUE = 'mlb'
                        }
                        if (league.toLowerCase() === 'ncaaf') {
                            SPORT = 'football'
                            LEAGUE = 'college-football'
                        }
                        if (league.toLowerCase() === 'wnba') {
                            SPORT = 'basketball'
                            LEAGUE = 'wnba'
                        }

                        fetchDeez.push([SPORT, LEAGUE, userfandom[k + 1]])
                    }

                    async function getScores(fetchDeez) {
                        scores = []
                        // return new Promise(async function(resolve, reject){

                        for (l = 0; l < fetchDeez.length; l++) {
                            sport = fetchDeez[l][0]
                            league = fetchDeez[l][1]
                            team = fetchDeez[l][2]

                            const req = await fetch('http://site.api.espn.com/apis/site/v2/sports/' + sport + '/' + league + '/scoreboard', {
                                method: 'get',
                                headers: {},
                                redirect: 'follow'
                            });

                            format_resolved_request = await req.json()

                            for (i = 0; i < format_resolved_request.events.length; i++) {
                                if (format_resolved_request.events[i].name.includes(team)) {
                                    if ((new Date().getTime()) - (Date.parse(format_resolved_request.events[i].competitions[0].date)) < 86400000) {
                                        scores.push([format_resolved_request.events[i].competitions[0].competitors[1].team.displayName + " ", format_resolved_request.events[i].competitions[0].competitors[1].score + " - ", format_resolved_request.events[i].competitions[0].competitors[0].team.displayName + " ", format_resolved_request.events[i].competitions[0].competitors[0].score + " (", format_resolved_request.events[i].competitions[0].status.type.shortDetail + ")"])
                                    }          
                                }
                            }
                        }
                        
                        return (scores)
                    }
                    getScores(fetchDeez).then(a => {

                        if (a.length === 0) {
                            scores.push('Doesn\'t look like any of your teams played today. Nice day off <:KirikaSmile:608201680374464532>')
                        }
                        const scoresEmbed = new EmbedBuilder()
                            .setColor(8446019)
                            .setAuthor({ name: username(id) + '\'s Scoreboard', iconURL: '' + guild.members.cache.get(id).user.displayAvatarURL(), url: 'https://discord.gg/churchofanime' })
                            .addFields(
                                { name: '===================================', value: '' + scores.join('\n\n').replaceAll(',', '').replaceAll('Carolina Panthers', 'Most Trash Garbage Team In The Whole League').replaceAll('Philadelphia Eagles', 'Philadelphia Phuckbois').replaceAll('Washington Commanders', 'Washington Football Team').replaceAll('Anaheim Ducks', 'Anaheim Cucks') }
                            )

                        return interaction.reply({ embeds: [scoresEmbed] })
                    })
                }
            })
	},
};