const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('pastleaderboard')
        .setDescription('Displays past leaderboards.')
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('The year to search through.')
                .setRequired(true)
                .addChoices(
                    { name: '2023', value: 2023 },
                    { name: '2024', value: 2024 }
                ))
        .addStringOption(option =>
            option.setName('month')
                .setDescription('The month for the specified year.')
                .setRequired(true)
                .addChoices(
                    { name: 'January', value: 'January' },
                    { name: 'February', value: 'February' },
                    { name: 'March', value: 'March' },
                    { name: 'April', value: 'April' },
                    { name: 'May', value: 'May' },
                    { name: 'June', value: 'June' },
                    { name: 'July', value: 'July' },
                    { name: 'August', value: 'August' },
                    { name: 'September', value: 'September' },
                    { name: 'October', value: 'October' },
                    { name: 'November', value: 'November' },
                    { name: 'December', value: 'December' }
                )),
    async execute(interaction) {
        const guild = interaction.member.guild;
        const year = interaction.options.getInteger('year');
        const month = interaction.options.getString('month');

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

        fs.readFile('leaderboardhistory.json', 'utf8', (err, data) => {
            wordle = JSON.parse(data)
            leaderboard = []
            let date = `${month} ${year}`

            if (wordle[date] != undefined) {
                let leaderboard = wordle[date].leaderboard
                const leaderboardEmbed = new EmbedBuilder()
                    .setColor(2173288)
                    .setAuthor({ name: `CoA Wordle Leaderboard for ${date}`, iconURL: 'https://static.wikia.nocookie.net/logopedia/images/4/45/Wordle_2022_Icon.png/revision/latest?cb=20220514191523', url: 'https://www.nytimes.com/games/wordle/index.html' })

                for (let i = 0; i < leaderboard.length; i++) {
                    if (i === 0) {
                        leaderboardEmbed.addFields({ name: '\u200B', value: `:first_place:: ${username(leaderboard[i][1])} --- ${leaderboard[i][0]} average *(${leaderboard[i][2]}*` })
                    } else if (i === 1) {
                        leaderboardEmbed.addFields({ name: '\u200B', value: `:second_place:: ${username(leaderboard[i][1])} --- ${leaderboard[i][0]} average *(${leaderboard[i][2]}*` })
                    } else if (i === 2) {
                        leaderboardEmbed.addFields({ name: '\u200B', value: `:third_place:: ${username(leaderboard[i][1])} --- ${leaderboard[i][0]} average *(${leaderboard[i][2]}*` })
                    } else if (i === (leaderboard.length - 1)) {
                        leaderboardEmbed.addFields({ name: '\u200B', value: `LAST <:OMEGALUL:854391735458988063>: ${username(leaderboard[i][1])} --- ${leaderboard[i][0]} average *(${leaderboard[i][2]}*` })
                    } else {
                        leaderboardEmbed.addFields({ name: '\u200B', value: (i + 1) + `th:  ${username(leaderboard[i][1])} --- ${leaderboard[i][0]} average *(${leaderboard[i][2]}*` })
                    }

                }
                // .addFields(
                //     { name: '\u200B', value: leaderboard.join('\n\n').replaceAll(',', '') }
                // )

                //console.log(leaderboard)

                return interaction.reply({ embeds: [leaderboardEmbed] })
            } else {
                return interaction.reply({ content: `I don't have data for ${date}. Only started keeping track in October 2023 so you either searched before that, or you searched for a future date in which case... I have questions.`, ephemeral: true })
            }
        })
    },
};