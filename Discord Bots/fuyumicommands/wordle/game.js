const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('game')
		.setDescription('Displays the specified game.')
        .addIntegerOption(option =>
            option.setName('gamenumber')
                .setDescription('The game number you want to search for.')
                .setRequired(true)),
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

        fs.readFile('pastgames.json', 'utf8', (err, data) => {
            wordle = JSON.parse(data)
            games = []
            gamenumber = interaction.options.getInteger('gamenumber')

            if (wordle[gamenumber] != undefined) {
                games = wordle[gamenumber]

                const gamesEmbed = new EmbedBuilder()
                    .setColor(2173288)
                    .setAuthor({ name: 'Game #' + gamenumber, iconURL: 'https://static.wikia.nocookie.net/logopedia/images/4/45/Wordle_2022_Icon.png/revision/latest?cb=20220514191523', url: 'https://www.nytimes.com/games/wordle/index.html' })

                for (let i = 0; i < wordle[gamenumber].length; i++) {
                    gamesEmbed.addFields({ name: username(wordle[gamenumber][i][0]), value: wordle[gamenumber][i][1], inline: true })
                }

                return interaction.reply({ embeds: [gamesEmbed] })
            } else {
                return interaction.reply( { content: 'I don\'t have data on Game #'+gamenumber+'. I only started keeping track on Game #872 so anything prior to that you\'re going to have to search for yourself.', ephemeral: true })
            }
        })
	},
};
