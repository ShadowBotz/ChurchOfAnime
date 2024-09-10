const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kirikapredictions')
        .setDescription('See a list of Kirika\'s predictions')
        .addStringOption(option =>
            option.setName('league')
                .setDescription('The league to get the scores of')
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

        console.log(`${time} ${username(ID)} used /kirikapredictions ${LEAGUE}`)

        fs.readFile('kirikapredictions.json', 'utf8', (err, kdata) => {
            const kpred = JSON.parse(kdata)
            var team = undefined
            let predictions = []

            if (kpred.kirika.prediction[LEAGUE.toLowerCase()].length > 0) {
                for (i = 0; i < kpred.kirika.prediction[LEAGUE.toLowerCase()].length; i++) {
                    team = kpred.kirika.prediction[LEAGUE.toLowerCase()][i][0]
                    if (kpred.kirika.prediction[LEAGUE.toLowerCase()][i][5] >= kpred.kirika.prediction[LEAGUE.toLowerCase()][i][2]) {
                        predictions.push(`${kpred.kirika.prediction[LEAGUE.toLowerCase()][i][4]} ${kpred.kirika.prediction[LEAGUE.toLowerCase()][i][5]} - ${kpred.kirika.prediction[LEAGUE.toLowerCase()][i][1]} ${kpred.kirika.prediction[LEAGUE.toLowerCase()][i][2]}`)
                    } else {
                        predictions.push(`${kpred.kirika.prediction[LEAGUE.toLowerCase()][i][1]} ${kpred.kirika.prediction[LEAGUE.toLowerCase()][i][2]} - ${kpred.kirika.prediction[LEAGUE.toLowerCase()][i][4]} ${kpred.kirika.prediction[LEAGUE.toLowerCase()][i][5]}`)
                    }
                }
                const predictEmbed = new EmbedBuilder()
                    .setColor(8446019)
                    .setTitle(`Kirika's ${LEAGUE} Predictions <:KirikaSmile:608201680374464532>`)
                    .addFields(
                        { name: '===================================', value: '' + predictions.join('\n\n').replaceAll(',', '') }
                    )

                return interaction.reply({ embeds: [predictEmbed] })
            } else {
                return interaction.reply(`Oops! I\'ve been slackin\' <:KirikaSmile:608201680374464532> Don\'t have any ${LEAGUE} predictions right now, but if you do /prediction for a team I'll tell you what I think ^_^ b`)
            }

        })
    },
};