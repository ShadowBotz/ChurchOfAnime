const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { wrap } = require('module');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dailywrap')
        .setDescription('Displays how well CoA\'s teams did yesterday'),
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
        LEAGUE = interaction.options.getString('league');
        SPORT = undefined

        console.log(`${time} ${username(ID)} used /dailywrap`)


        async function getWrapScores(sport, league) {

            try {
                const req = await fetch('http://site.api.espn.com/apis/site/v2/sports/' + sport + '/' + league + '/scoreboard', {
                    method: 'get',
                    headers: {},
                    redirect: 'follow'
                });

                //sends the request
                espn = await req.json()                   //formats the raw request into JSON

                fs.readFile('dailywrap.json', 'utf8', (err, data) => {
                    var wrap = JSON.parse(data)

                    if (espn.events[0] != undefined) {

                        winners = []
                        losers = []

                        for (i = 0; i < espn.events.length; i++) {
                            if ((new Date().getTime()) - (Date.parse(espn.events[i].competitions[0].date)) < 86400000) {
                            if (espn.events[i].competitions[0].competitors[0].winner != undefined) {
                                if (espn.events[i].competitions[0].competitors[0].winner === true) {
                                winners.push(espn.events[i].competitions[0].competitors[0].team.displayName.replaceAll('Athletics', 'Athletics Athletics').replaceAll('LA Clippers', 'Los Angeles Clippers'))
                                losers.push(espn.events[i].competitions[0].competitors[1].team.displayName.replaceAll('Athletics', 'Athletics Athletics').replaceAll('LA Clippers', 'Los Angeles Clippers'))
                            } else {
                                winners.push(espn.events[i].competitions[0].competitors[1].team.displayName.replaceAll('Athletics', 'Athletics Athletics').replaceAll('LA Clippers', 'Los Angeles Clippers'))
                                losers.push(espn.events[i].competitions[0].competitors[0].team.displayName.replaceAll('Athletics', 'Athletics Athletics').replaceAll('LA Clippers', 'Los Angeles Clippers'))
                            }
                        }}}

                        wrap[league.toUpperCase()] = {
                            Winners: winners,
                            Losers: losers
                        }

                        fs.writeFile('dailywrap.json', JSON.stringify(wrap), (err) => {
                            if (err) {
                                console.log(err)
                            }})

                    } else {
                        return Promise.reject('getWrapScores() Kirika Promise Error')
                    }
                })
            } catch (err) {
                return interaction.reply('Hang on. ESPN is being a baka <:beatzBaka:1167640027652698312> Try again in a second'),
                    console.log(err)
            }

        }
                    var wins = 0
                    var losses = 0
                    var truewins = 0
                    var truelosses = 0
           

                fs.readFile('dailywrap.json', 'utf8', (err, wdata) => {
                    var wrap1 = JSON.parse(wdata)
                    let daily = Object.entries(wrap1)

                    fs.readFile('sports.json', 'utf8', (err, data) => {
                        var sports1 = JSON.parse(data)
                    
                    //console.log(daily[0][0]) <------ Will give the league
                    //console.log(daily[0][1].Winners[0])
                    //console.log(sports1[daily[0][0]][daily[0][1].Winners[0]].name)
                    //console.log(sports1[daily[0][0]][daily[0][1].Winners[0]].fans)
                    

                    for (i = 0; i < daily.length; i++) {                       
                        if  (daily[i][1].Winners.length > 0) {
                        for (j = 0; j < daily[i][1].Winners.length; j++) {                                                     
                            if (sports1[daily[i][0]][daily[i][1].Winners[j]].fans.length > 0) {
                                wins++
                                truewins = truewins + +sports1[daily[i][0]][daily[i][1].Winners[j]].fans.length
                            }                            
                            if (sports1[daily[i][0]][daily[i][1].Losers[j]].fans.length > 0) {
                                losses++
                                truelosses = truelosses + +sports1[daily[i][0]][daily[i][1].Losers[j]].fans.length
                            }
                        }
                    }
                    }

                    // const wrapEmbed = new EmbedBuilder()
                    //     .setColor(8446019)
                    //     .setTitle(`Church of Anime Daily Wrap-Up for ${LEAGUE.toUpperCase()}`)
                    //     .addFields(
                    //         { name: 'Winners', value: '' + wrap[LEAGUE].Winners.join('\n').replaceAll(',', '') || 'No games finished yet today!' },
                    //         { name: 'Losers', value: '' + wrap[LEAGUE].Losers.join('\n').replaceAll(',', '') || 'No games finished yet today!' }
                    //     )
                    return interaction.reply(`Church of Anime went ${wins}-${losses} (${truewins}-${truelosses}) yesterday <:KirikaSmile:608201680374464532>`)
                })})

            

    },
};