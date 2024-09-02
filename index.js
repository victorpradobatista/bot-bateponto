const Discord = require("discord.js")
const config = require("./config.json")
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildVoiceStates
    ]
});

module.exports = client

client.on('interactionCreate', (interaction) => {

    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd) return interaction.reply(`Error`);
        interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);
        cmd.run(client, interaction)
    }
})

client.on('ready', () => {
    console.log(`Olá! Bot Comunidade | ${client.user.username}!`)
    const activitiest = [
     {name:"f", status:'idle'},
     {name:"f", status:'idle'},
     {name:"f", status:'idle'}
    ]
    let i = 0
    setInterval(() => {
        if(i > 2) {
            i = 0
        } else {
        client.user.setPresence({ activities: [{ name: activitiest[i].name }], status: activitiest[i].status });
        i++
        // console.log(i)
    }
    }, 1000 * 60 * 1)
})

client.slashCommands = new Discord.Collection()
require('./handler/handler.js')(client)
require('./database/database.js')
require('./Events/interactionCreate.js')(client)

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception: " + err);
});
  
process.on("unhandledRejection", (reason, promise) => {
    console.log(promise, reason.message);
});

process.on("unhandledRejection", (reason, p) => {

  console.log(reason, p);
});

process.on("uncaughtException", (err, origin) => {
  console.log(err, origin);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(err, origin);
});

client.login(config.token)

