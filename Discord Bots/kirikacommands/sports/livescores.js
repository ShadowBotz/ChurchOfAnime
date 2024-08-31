const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('livescores')
        .setDescription('Displays the live scores for a certain league')
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

        const guild = interaction.member.guild;
        const ID = interaction.user.id

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

        var d = new Date();
        var time = (d.getHours()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ':' + (d.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })) + ':' + (d.getSeconds()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ' - '
        console.log(`${time} ${username(ID)} used /livescores`)

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

        async function getLiveScores(sport, league) {
            try {
                const req = await fetch('http://site.api.espn.com/apis/site/v2/sports/' + sport + '/' + league + '/scoreboard', {
                    method: 'get',
                    headers: {},
                    redirect: 'follow'
                });
                //sends the request
                espn = await req.json()                   //formats the raw request into JSON

                if (espn.events[0] != undefined) {
                    livegames = []
                    livegames.push(espn.leagues[0].logos[0].href)

                    for (i = 0; i < espn.events.length; i++) {

                        if (espn.events[i].competitions[0].status.type.state === 'in') {
                            livegames.push([espn.events[i].competitions[0].competitors[1].team.displayName + " ", espn.events[i].competitions[0].competitors[1].score + " - ", espn.events[i].competitions[0].competitors[0].team.displayName + " ", espn.events[i].competitions[0].competitors[0].score + " (", espn.events[i].competitions[0].status.type.shortDetail + ")"])
                        }
                    }

                    return (livegames)
                } else {
                    return Promise.reject('getLiveScores() Kirika Promise Error')
                }
            } catch (err) {
                return interaction.reply('Hang on. ESPN is being a baka <:beatzBaka:1167640027652698312> Try again in a second'),
                    console.log(err)
            }
        }

        getLiveScores(SPORT, LEAGUE).then(a => {
            logo = livegames.shift()

            if (livegames.length < 1) {
                livegames.push('No Games Currently Taking Place')
            }

            const scoresEmbed = new EmbedBuilder()
                .setColor(8446019)
                .setAuthor({ name: LEAGUE.toUpperCase() + ' Scoreboard', iconURL: '' + logo, url: 'https://www.' + LEAGUE + '.com' })
                .addFields(
                    { name: '===================================', value: '' + livegames.join('\n\n').replaceAll(',', '') }
                )

            return interaction.reply({ embeds: [scoresEmbed] })
        })

        //})

    },
};