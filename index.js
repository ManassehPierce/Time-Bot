const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();

let guilds = require('./users.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
    if(!guilds) {
        guilds = {};
    }
});

client.on('message', msg => {
    // check if the message came from a bot, no loops!
    if(!msg.author.bot) {
        // check if the message contains "time bot" or "timebot"
        var formatted = msg.content.split(' ');
        if(formatted[0].toLowerCase() === "time" && formatted[1].toLowerCase() === "bot") {
            formatted.reverse();
            formatted.pop();
            formatted.reverse();
            formatted[0] = "timebot";
        }

        if(formatted[0] === "timebot") {
            // now we can check for commands
            if(formatted[1] === "help") {
                msg.reply(help());
            } else if(formatted[1] === "add") {
                // do add
                formatted[2] = formatted[2].replace(formatted[2][0], formatted[2][0].toUpperCase());
                add(msg.guild, formatted[2], parseInt(formatted[3]));
                msg.reply(`Added ${formatted[2]} with a UTC difference of ${formatted[3]}`);
            } else if(formatted[1] === "remove") {
                // do remove
                formatted[2] = formatted[2].replace(formatted[2][0], formatted[2][0].toUpperCase());
                remove(msg.guild, formatted[2]);
                msg.reply(`Removed ${formatted[2]}`);
            } else {
                msg.reply('Times are:\n' + get(msg.guild));
            }
        }
    }
});

function updateGuilds() {
    client.guilds.array().forEach((guild) => {
        if(!guilds[guild.id]) {
            guilds[guild.id] = {};
        }
    });
}

function get(guild) {
    updateGuilds();
    let group = guilds[guild.id];
    let date = new Date();
    let hour = date.getUTCHours();
    let keys = Object.keys(group);
    let temp = [];
    keys.forEach((k) => {
        var val = group[k]; // -6
        if(val !== null) {
            var tHour = hour + val;
            if(tHour >= 24) {
                tHour -= 24;
            } else if(tHour < 0) {
                tHour = 24 + tHour;
            }
            temp.push(`${k}: ${tHour}:${date.getUTCMinutes()}`);
        }
    });
    return temp.join('\n');
}

function add(guild, username, utcdiff) {
    updateGuilds();
    guilds[guild.id][username] = utcdiff;
    fs.writeFileSync('users.json', JSON.stringify(guilds));
}

function remove(guild, username) {
    updateGuilds();
    if(guilds[guild.id][username]) {
        guilds[guild.id][username] = null;
    }
    fs.writeFileSync('users.json', JSON.stringify(guilds));
}

function help() {
    return '\n        To activate time bot, type \'time bot\' or \'timebot\'\n\
        To display help, type \'timebot help\'\n\
        To add users to the time bot list, type \'timebot add Username TimeDifferenceFromUTC\'\n\
        To edit a users time difference, just \"add\" them again\n\
        To remove a user from the time bot list, type \'timebot remove Username\'';
}

client.login(require('./token.json').token);