// include the Discord library
const Discord = require("discord.js");
// include "filesystem"
const fs = require("fs");
// make a new Discord Client, basiclly a user
const client = new Discord.Client();

// our JSON file for storing User Data
let users = JSON.parse(fs.readFileSync('users.json', 'utf8'));

// when the Bot logs in
client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
});

// when a message is sent
client.on('message', msg => {
    let format = msg.content.toLowerCase(); // make all the text lowercase, allows for non-case-sensitive commands
    if(!msg.author.bot) { // make sure a bot didn't message us
        if (format.includes('time bot') || format.includes('timebot')) { // if you reference the Time Bot
            let date = new Date(); // get the date
            let cmd = format.split(' '); // split the whole line of text into seperate words

            if(cmd[0] === "time" && cmd[1] === "bot") { // "time bot"
                if(cmd[2] === "add") { // "time bot add USERNAME NUMBER"
                    // add the user
                    addUser(msg.guild, cmd[3], parseInt(cmd[4]));
                    msg.reply(`Added ${cmd[3]}`);
                } else if(cmd[2] === "remove") { // "time bot remove USERNAME"
                    // remove the user
                    removeUser(msg.guild, cmd[3]);
                    msg.reply(`Removed ${cmd[3]}`);
                } else { // "time bot ..."
                    // send a message back with the times of everyone
                    let times = returnTimes(msg.guild, date);
                    if(times) {
                        msg.reply(times.join('\n'));
                    } else {
                        msg.reply('There are no users entered, please use time bot add USERNAME TIMEDIFFERENCE, or timebot add USERNAME TIMEDIFFERENCE');
                    }
                }
            } else if(cmd[0] === "timebot") { // "timebot"
                if(cmd[1] === "add") { // "timebot add USERNAME NUMBER"
                    // add the user
                    addUser(msg.guild, cmd[2], parseInt(cmd[3]));
                    msg.reply(`Added ${cmd[2]}`);
                } else if(cmd[1] === "remove") { // "timebot remove USERNAME"
                    // remove the user
                    removeUser(msg.guild, cmd[2]);
                    msg.reply(`Removed ${cmd[2]}`);
                } else { // "timebot ..."
                    // send a message back with the times of everyone
                    let times = returnTimes(msg.guild, date);
                    if(times) {
                        msg.reply(times.join('\n'));
                    } else {
                        msg.reply('There are no users entered, please use time bot add USERNAME TIMEDIFFERENCE, or timebot add USERNAME TIMEDIFFERENCE');
                    }
                }
            }
        }
    }
});

function addUser(guild, username, timediff) {
    users[guild][username] = timediff;
    fs.writeFileSync('users.json', JSON.stringify(users));
}

function removeUser(guild, username) {
    users[guild][username] = null;
    fs.writeFileSync('users.json', JSON.stringify(users));
}

function returnTimes(guild, date) {
    let keys;
    if(users) {
        keys = Object.keys(users[guild]);
    }
    else {
        return;
    }
    let temp = [
        `Times for Users in ${guild}:`
    ];
    keys.forEach(function(key) {
        if(users[guild][key] !== null) temp.push( `${key}: ${date.getHours() + users[guild][key]}:${date.getMinutes()}` );
    });
    return temp;
}

// the token for my bot
client.login('MjU0MjI2ODkzNjI3MzI2NDY1.CyL_AA.zsC8DSmr12BQFxD3NVcunDj1T0k');