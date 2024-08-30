const { arrayLengthRangeExclusive } = require('@sapphire/shapeshift');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addteam')
		.setDescription('Register your favorite teams with the Discord.')
        .addStringOption(option =>
            option.setName('league')
                .setDescription('The league of the team to add')
                .setRequired(true)
                .addChoices(
					{ name: 'MLB', value: 'MLB' },
					{ name: 'NBA', value: 'NBA' },
					{ name: 'NFL', value: 'NFL' },
                    { name: 'NHL', value: 'NHL' },
                    { name: 'WNBA', value: 'WNBA' },
				))
        .addStringOption(option =>
            option.setName('teamcity')
                .setDescription('The city of the team to add')
                .setRequired(true)
                )
        .addStringOption(option =>
            option.setName('teamname')
                .setDescription('The name of the team to add')
                .setRequired(true)
                ),
        
	async execute(interaction) {
        const guild = interaction.member.guild;
        const AID = interaction.user.id

        function TitleCase(Input) {
            Input = Input.toLowerCase().split(" ");
    
            for (var i = 0; i < Input.length; i++) {
                if (Input[i].length === 2) {
                    Input[i] = Input[i].toUpperCase();
                } else {
                    Input[i] = Input[i].charAt(0).toUpperCase() + Input[i].slice(1);
                }
            }
    
            return Input.join(' ');
        }


        fs.readFile('sports.json', 'utf8', (err, data) => {
            sports = JSON.parse(data)
            league = interaction.options.getString('league')
            teamcity = interaction.options.getString('teamcity')
            teamname = interaction.options.getString('teamname')
            teamInput = teamcity+' '+teamname
            team = TitleCase(teamInput)

            if (sports[league] === undefined) {
                return interaction.reply( { content: 'I\'m not familiar with that league <:beatzPosh:824832391792427011> Currently we\'re only keeping track of MLB, NFL, NHL, NBA, and WNBA teams, with college sports hopefully coming soon <:KirikaSmile:608201680374464532> Sorry if you feel left out but ShadowBeatz is just a dumb American and can only do so much :flag_us:', ephemeral: true })
            } else {

                if (sports[league][team] === undefined) {
                    return interaction.reply({ content: 'That\'s not a real team <:beatzSusAF:549413960948908063> Are you sure you spelled it right?', ephemeral: true})
                } else {
                    if (sports[league][team].fans.find(element => element === AID) != undefined) {
                        return interaction.reply({content:'You already added that <:beatzSusAF:549413960948908063>', ephemeral: true})
                    } else {
                        chant = sports[league][team].chant
                        modifier = sports[league][team].modifier

                        sports[league][team].fans.push(AID)
                        fs.writeFile('sports.json', JSON.stringify(sports), (err) => {
                            if (err) throw err;

                            if (sports[league][team].fans.length < 2) {

                                return interaction.reply('<@' + AID + '> A fan of ' + modifier + '' + team + ' huh? ' + chant + '')

                            } else {
                                return interaction.reply('<@' + AID + '> Another fan of ' + modifier + '' + team + '! You\'re among friends here ' + chant + '')
                            }

                        })
                    }
                }


            }
        }
        )
	},
};
