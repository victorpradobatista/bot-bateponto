const Discord = require('discord.js')
const config = require('../config.json')
const mysql = require('mysql')
const transcript = require('discord-html-transcripts')
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, PermissionFlagsBits } = require('discord.js');

function connect() {

    return mysql.createPool({
        host: `${config.ip}`, // IP da database. Se estiver em localhost deixe 127.0.0.1.
        user: `${config.user}`, // Usuario da database, padrao root.
        password: "", // Senha da database, padrao sem senha.
        database: `${config.databasename}` // Nome da database.
    });
}

module.exports = async (client, interaction) => { 
    client.on('guildMemberAdd', (member) => {
        const d = connect()
        d.query('SELECT * FROM logs WHERE tipo = "welcome"', function(err, result) {
            if(result == false) {

            } else {
            const channelWelcome = interaction.guild.channels.cache.get(result[0].id)
            
            const totalCount = member.guild.memberCount
            const embedWelcome = new EmbedBuilder()
            .setAuthor({ iconURL: member.user.displayAvatarURL(), name: `${member.user.username}#${member.user.discriminator}`})
            .setDescription(`<:emojipessoabranco:1142035599105216512> Seja bem vindo(a) <@${member.user.id}> ao servidor **${member.guild.name}!**\n\n<:pastaemoji:1142054122401574963> Atualmente estamos com **${totalCount}** membros no servidor!\n\n<a:setaanimada:1142049454032158760> Se estiver com alguma dúvida, basta abrir um ticket em <#871756472785174599> que nossa equipe te ajudará.`)
            .setThumbnail(member.user.displayAvatarURL({ dinamyc: true, size: 2048, format: 'png' }))
            .setColor('#313338')

            const entrada1 = new dc.ActionRowBuilder()
            .addComponents(
              new dc.ButtonBuilder()
                .setLabel("Abrir Ticket")
                .setURL('https://discord.com/channels/871755688135757824/871756472785174599')
                .setStyle("Link"),
              new dc.ButtonBuilder()
                .setLabel("Avaliações")
                .setStyle("Link")
                .setURL('https://discord.com/channels/871755688135757824/871756221970018306'))

            channelWelcome.send({embeds: [embedWelcome], components:[entrada1]})
        }
        })
    })
}