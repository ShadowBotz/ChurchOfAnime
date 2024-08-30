const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the monthly Wordle leaderboard.')
        .addStringOption(option =>
            option.setName('stat')
                .setDescription('The leaderboard to display.')
                .setRequired(true)
                .addChoices(
                    { name: 'Score', value: 'score' },
                    { name: 'Guesses', value: 'guesses' },
                )),
    async execute(interaction) {
        const guild = interaction.member.guild;
        const stat = interaction.options.getString('stat');

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
            leaderboard = []
            let WordleEntries = Object.entries(wordle)

            const leaderboardEmbed = new EmbedBuilder()
                .setColor(2173288)
                .setAuthor({ name: 'Church of Anime Wordle Leaderboard', iconURL: 'https://static.wikia.nocookie.net/logopedia/images/4/45/Wordle_2022_Icon.png/revision/latest?cb=20220514191523', url: 'https://www.nytimes.com/games/wordle/index.html' })

            if (stat === 'score') {
                for (let i = 0; i < WordleEntries.length; i++) {
                    if (WordleEntries[i][1].GAMES > 0) {
                        if (WordleEntries[i][1].GAMES === 1) {
                            leaderboard.push([Math.round((WordleEntries[i][1].SCORE / WordleEntries[i][1].GAMES + Number.EPSILON) * 1000) / 1000, WordleEntries[i][0], WordleEntries[i][1].GAMES+ ' game)'])
                        } else {
                            leaderboard.push([Math.round((WordleEntries[i][1].SCORE / WordleEntries[i][1].GAMES + Number.EPSILON) * 1000) / 1000, WordleEntries[i][0], WordleEntries[i][1].GAMES + ' games)'])
                        }
                    }
                }

                leaderboardEmbed.setDescription('*Score Leaders*')
            }

            if (stat === 'guesses') {
                for (let i = 0; i < WordleEntries.length; i++) {
                    if (WordleEntries[i][1].GAMES > 0) {
                        if (WordleEntries[i][1].GAMES === 1) {
                            leaderboard.push([Math.round((WordleEntries[i][1].GUESSES / WordleEntries[i][1].GAMES + Number.EPSILON) * 1000) / 1000, WordleEntries[i][0], WordleEntries[i][1].GAMES+ ' game)'])
                        } else {
                            leaderboard.push([Math.round((WordleEntries[i][1].GUESSES / WordleEntries[i][1].GAMES + Number.EPSILON) * 1000) / 1000, WordleEntries[i][0], WordleEntries[i][1].GAMES+ ' games)'])
                        }
                    }
                }

                leaderboardEmbed.setDescription('*Guess Leaders*')
            }

            leaderboard = leaderboard.sort((firstItem, secondItem) => firstItem[0] - secondItem[0])

            

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
        })
    },
};