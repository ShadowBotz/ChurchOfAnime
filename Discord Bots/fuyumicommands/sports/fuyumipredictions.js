const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fuyumipredictions')
        .setDescription('See a list of Fuyumi\'s predictions')
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
        console.log(`${time} ${username(ID)} used /fuyumipredictions`)

        let LEAGUE = interaction.options.getString('league');

        fs.readFile('fuyumipredictions.json', 'utf8', (err, kdata) => {
            const fpred = JSON.parse(kdata)
            var team = undefined
            let predictions = []

            if (fpred.fuyumi.prediction[LEAGUE.toLowerCase()].length > 0) {
                for (i = 0; i < fpred.fuyumi.prediction[LEAGUE.toLowerCase()].length; i++) {
                    team = fpred.fuyumi.prediction[LEAGUE.toLowerCase()][i][0]
                    if (fpred.fuyumi.prediction[LEAGUE.toLowerCase()][i][5] >= fpred.fuyumi.prediction[LEAGUE.toLowerCase()][i][2]) {
                        predictions.push(`${fpred.fuyumi.prediction[LEAGUE.toLowerCase()][i][4]} ${fpred.fuyumi.prediction[LEAGUE.toLowerCase()][i][5]} - ${fpred.fuyumi.prediction[LEAGUE.toLowerCase()][i][1]} ${fpred.fuyumi.prediction[LEAGUE.toLowerCase()][i][2]}`)
                    } else {
                        predictions.push(`${fpred.fuyumi.prediction[LEAGUE.toLowerCase()][i][1]} ${fpred.fuyumi.prediction[LEAGUE.toLowerCase()][i][2]} - ${fpred.fuyumi.prediction[LEAGUE.toLowerCase()][i][4]} ${fpred.fuyumi.prediction[LEAGUE.toLowerCase()][i][5]}`)
                    }
                }
                const predictEmbed = new EmbedBuilder()
                    .setColor(2173288)
                    .setTitle(`Fuyumi's ${LEAGUE} Predictions <:FuyumiJam:624560349101817856>`)
                    .addFields(
                        { name: '===================================', value: '' + predictions.join('\n\n').replaceAll(',', '') }
                    )

                return interaction.reply({ embeds: [predictEmbed] })
            } else {
                return interaction.reply(`I haven't made ${LEAGUE} predictions recently. If you want my opinions you can do /prediction.`)
            }

        })
    },
};