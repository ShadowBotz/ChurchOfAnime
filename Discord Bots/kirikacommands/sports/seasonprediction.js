const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seasonprediction')
        .setDescription('Kirika will tell you how well a team will do in the upcoming season')
        .addStringOption(option =>
            option.setName('league')
                .setDescription('The league that the team plays in')
                .setRequired(true)
                .addChoices(
                    { name: 'MLB', value: 'MLB' },
                    { name: 'NBA', value: 'NBA' },
                    { name: 'NFL', value: 'NFL' },
                    { name: 'NHL', value: 'NHL' },
                    { name: 'WNBA', value: 'WNBA' },
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
        let LEAGUE = interaction.options.getString('league');
        let TEAM = interaction.options.getString('team');

        console.log(`${time} ${username(ID)} used /seasonprediction ${LEAGUE}`)

        const randomNumber = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1) + min)
        }

        function randomRecord(games) {
            let wins = randomNumber(0, games)
            let losses = (games - wins)
            return (`${wins}-${losses}`)
        }
        fs.readFile('switches.json', 'utf8', (err, swtch) => {
            swtch = JSON.parse(swtch)
            if (swtch.predictions[LEAGUE] === false) {
                fs.readFile('sports.json', 'utf8', (err, data) => {
                    sports = JSON.parse(data)
                    let divisions = []
                    let LeaguesEntries = Object.entries(sports[LEAGUE])

                    for (let i = 0; i < LeaguesEntries.length; i++) {

                        if (divisions[LeaguesEntries[i][1].division] === undefined) {
                            divisions[LeaguesEntries[i][1].division] = [`${LeaguesEntries[i][0]}:\n <:KirikaSmile:608201680374464532> ${LeaguesEntries[i][1].kirikaPrediction} - <:FuyumiJam:624560349101817856> ${LeaguesEntries[i][1].fuyumiPrediction}`]
                        } else {
                            divisions[LeaguesEntries[i][1].division].push(`${LeaguesEntries[i][0]}:\n <:KirikaSmile:608201680374464532> ${LeaguesEntries[i][1].kirikaPrediction} - <:FuyumiJam:624560349101817856> ${LeaguesEntries[i][1].fuyumiPrediction}`)
                        }
                    }

                    let DivisionsEntries = Object.entries(divisions)

                    const predictionEmbed = new EmbedBuilder()
                        .setColor(8446019)
                        .setTitle(`Church of Anime Official ${LEAGUE} Season Predictions`)
                        .setThumbnail('https://a.espncdn.com/i/teamlogos/leagues/500/' + LEAGUE + '.png')

                    for (let i = 0; i < DivisionsEntries.length; i++) {
                        predictionEmbed.addFields({ name: DivisionsEntries[i][0], value: DivisionsEntries[i][1].join('\n').replaceAll(',', ''), inline: false })
                    }

                    return interaction.reply({ embeds: [predictionEmbed] })
                })
            } else {
                swtch.predictions[LEAGUE] = false
                fs.writeFile('switches.json', JSON.stringify(swtch), (err) => {
                        if (err) throw err;
                    })
                    
                fs.readFile('sports.json', 'utf8', (err, data) => {
                    sports = JSON.parse(data)
                    let divisions = []


                    let LeaguesEntries = Object.entries(sports[LEAGUE])

                    if (LEAGUE === 'NFL') {
                        SPORT = 'football'
                        games = 17
                        var variant = 3
                    }
                    if (LEAGUE === 'NHL') {
                        SPORT = 'hockey'
                        games = 82
                        var variant = 5
                    }
                    if (LEAGUE === 'NBA') {
                        SPORT = 'basketball'
                        games = 82
                        var variant = 5
                    }
                    if (LEAGUE === 'MLB') {
                        SPORT = 'baseball'
                        games = 162
                        var variant = 15
                    }
                    if (LEAGUE === 'WNBA') {
                        SPORT = 'basketball'
                        games = 82
                        var variant = 5
                    }

                    for (let i = 0; i < LeaguesEntries.length; i++) {

                        if (+LeaguesEntries[i][1].lastRecord.split('-')[0] < variant) {
                            var variant = (LeaguesEntries[i][1].lastRecord.split('-')[0])
                        }

                        if (+LeaguesEntries[i][1].lastRecord.split('-')[1] < variant) {
                            var variant = (LeaguesEntries[i][1].lastRecord.split('-')[1])
                        }

                        var p = randomNumber(-variant, variant)

                        LeaguesEntries[i][1].kirikaPrediction = randomRecord(games)
                        LeaguesEntries[i][1].fuyumiPrediction = (+(LeaguesEntries[i][1].lastRecord.split('-')[0]) + p) + '-' + (+(LeaguesEntries[i][1].lastRecord.split('-')[1]) - p)

                        if (divisions[LeaguesEntries[i][1].division] === undefined) {
                            divisions[LeaguesEntries[i][1].division] = [`${LeaguesEntries[i][0]}:\n <:KirikaSmile:608201680374464532> ${LeaguesEntries[i][1].kirikaPrediction} - <:FuyumiJam:624560349101817856> ${LeaguesEntries[i][1].fuyumiPrediction}`]
                        } else {
                            divisions[LeaguesEntries[i][1].division].push(`${LeaguesEntries[i][0]}:\n <:KirikaSmile:608201680374464532> ${LeaguesEntries[i][1].kirikaPrediction} - <:FuyumiJam:624560349101817856> ${LeaguesEntries[i][1].fuyumiPrediction}`)
                        }
                    }

                    let DivisionsEntries = Object.entries(divisions)

                    fs.writeFile('sports.json', JSON.stringify(sports), (err) => {
                        if (err) throw err;
                    })

                    const predictionEmbed = new EmbedBuilder()
                        .setColor(8446019)
                        .setTitle(`Church of Anime Official ${LEAGUE} Season Predictions`)
                        .setThumbnail('https://a.espncdn.com/i/teamlogos/leagues/500/' + LEAGUE + '.png')

                    for (let i = 0; i < DivisionsEntries.length; i++) {
                        predictionEmbed.addFields({ name: DivisionsEntries[i][0], value: DivisionsEntries[i][1].join('\n').replaceAll(',', ''), inline: false })
                    }

                    return interaction.reply({ embeds: [predictionEmbed] })

                })
            }
        })


    },
};