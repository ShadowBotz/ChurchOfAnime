const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Add your birthday to get the birthday weeb role.')
        .addStringOption(option =>
            option.setName('month')
                .setDescription('Birth month')
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
                ))
        .addIntegerOption(option =>
            option.setName('day')
                .setDescription('Day of the month (1-31)')
                .setRequired(true))
    ,

    async execute(interaction) {
        const AID = interaction.user.id
        const guild = interaction.member.guild;
        var day = interaction.options.getInteger('day');
        var month = interaction.options.getString('month');

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
        console.log(`${time} ${username(AID)} used /birthday`)


        // if (message.author.username === 'ShadowBeatz') {
        //     fs.readFile('birthdays.json', 'utf8', (err, data) => {
        //         cake = message.content.split(" ")
        //         birthday = JSON.parse(data)


        //         if (birthday[month] === undefined) {
        //             birthday[month] = { "ID": cake[2].match(/([0-9])+/g) }
        //             fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
        //                 if (err) throw err;
        //             })
        //         } else {
        //             birthday[cake[1]].ID.push(cake[2].match(/([0-9])+/g))
        //             fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
        //                 if (err) throw err;
        //             })
        //         }
        //     })
        // }

        fs.readFile('birthdays.json', 'utf8', (err, data) => {
            birthday = JSON.parse(data)

            temp = 0
            Object.keys(birthday).forEach(function (key) {
                if (birthday[key].ID.includes(AID)) {
                    temp = temp + 1
                }
            })

            if (temp == 0) {
                if (day != undefined) {
                    console.log(month, day)

                    function twoNumbs(Input) {
                        return Input.toString().length > 1 ? Input.toString() : "0" + Input.toString()
                    }

                    if (month === 'January') {
                        month = '00'
                    } else if (month === 'February') {
                        month = '01'
                    } else if (month === 'March') {
                        month = '02'
                    } else if (month === 'April') {
                        month = '03'
                    } else if (month === 'May') {
                        month = '04'
                    } else if (month === 'June') {
                        month = '05'
                    } else if (month === 'July') {
                        month = '06'
                    } else if (month === 'August') {
                        month = '07'
                    } else if (month === 'September') {
                        month = '08'
                    } else if (month === 'October') {
                        month = '09'
                    } else if (month === 'November') {
                        month = '10'
                    } else if (month === 'December') {
                        month = '11'
                    } else {
                        month = 'undefined'
                    }

                    bday = month + twoNumbs(day)

                    if (month === 'undefined') {
                        message.channel.send('I\'m sorry, you\'re going to have to help me out here. I was shot in the head after all <:KirikaSmile:608201680374464532> Try formatting your birthday with the first 3 letters of the month, then two digits for the day. Like "Jun 09"')
                    } else if (["00", "02", "04", "06", "07", "09", "11"].includes(month)) {
                        if (day < "32") {
                            if (birthday[bday] === undefined) {
                                birthday[bday] = { "ID": [AID] }
                                setTimeout(() => {
                                    fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
                                        if (err) throw err;
                                    })
                                }, 2000)
                            } else {
                                birthday[bday].ID.push(AID)
                                setTimeout(() => {
                                    fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
                                        if (err) throw err;
                                    })
                                }, 2000)
                            }
                            return interaction.reply('Got it <:KirikaSmile:608201680374464532>')
                        } else {
                            return interaction.reply(`Funny joke but please enter a day that actually exists. You won\'t get the pretty gold name otherwise ${month} ${day} <:KirikaSmile:608201680374464532>`)
                        }
                    } else if (["03", "05", "08", "10"].includes(month)) {
                        if (day < "31") {
                            if (birthday[bday] === undefined) {
                                birthday[bday] = { "ID": [AID] }
                                setTimeout(() => {
                                    fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
                                        if (err) throw err;
                                    })
                                }, 2000)
                            } else {
                                birthday[bday].ID.push(AID)
                                setTimeout(() => {
                                    fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
                                        if (err) throw err;
                                    })
                                }, 2000)
                            }
                            return interaction.reply('Got it <:KirikaSmile:608201680374464532>')
                        } else {
                            return interaction.reply(`Funny joke but please enter a day that actually exists. You won\'t get the pretty gold name otherwise <:KirikaSmile:608201680374464532> ${month} ${day}`)
                        }
                    } else if (month === "01") {
                        if (day < "29") {
                            if (birthday[bday] === undefined) {
                                birthday[bday] = { "ID": [AID] }
                                setTimeout(() => {
                                    fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
                                        if (err) throw err;
                                    })
                                }, 2000)
                            } else {
                                birthday[bday].ID.push(AID)
                                setTimeout(() => {
                                    fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
                                        if (err) throw err;
                                    })
                                }, 2000)
                            }
                            return interaction.reply('Got it <:KirikaSmile:608201680374464532>')
                        } else if (day == "29") {
                            if (birthday[bday] === undefined) {
                                birthday[bday] = { "ID": [AID] }
                                setTimeout(() => {
                                    fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
                                        if (err) throw err;
                                    })
                                }, 2000)
                            } else {
                                birthday[bday].ID.push(AID)
                                setTimeout(() => {
                                    fs.writeFile('birthdays.json', JSON.stringify(birthday), (err) => {
                                        if (err) throw err;
                                    })
                                }, 2000)
                            }
                            return interaction.reply('Oh wow. A leap year baby! <:KirikaSmile:608201680374464532>')
                        } else {
                            return interaction.reply(`${month} ${day} Funny joke but please enter a day that actually exists. You won\'t get the pretty gold name otherwise <:KirikaSmile:608201680374464532>`)
                        }
                    }
                } else {
                    return interaction.reply('spacebars help <:KirikaSmile:608201680374464532> Just like this: !bd Apr 20')
                }

            } else {
                return interaction.reply('Oh! It seems your birthday is already logged <:KirikaSmile:608201680374464532> If you made a mistake ping ShadowBeatz and he can fix it for you, but if not you\'re all good!')
                temp = 0
            }

        })



    },
};