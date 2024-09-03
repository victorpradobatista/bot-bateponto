const Discord = require("discord.js")
const mysql = require('mysql')
const config = require('../../config.json')
const { TextInputStyle, ButtonBuilder, ButtonStyle, EmbedBuilder, TextInputBuilder, StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder, ModalBuilder } = require('discord.js')

function connect() {

    return mysql.createPool({
        host: `${config.ip}`, // IP da database. Se estiver em localhost deixe 127.0.0.1.
        user: `${config.user}`, // Usuario da database, padrao root.
        password: "", // Senha da database, padrao sem senha.
        database: `${config.databasename}`
    });
}

module.exports = {
    name: "reset_horas",
    description: "Resetar todas as horas",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        const d = connect()
        if(!interaction.member.permissions.has(Discord.PermissionFlagsBits.KickMembers)){
            interaction.reply({content:'Você não tem permissão', ephemeral: true})
        }
        if(interaction.member.permissions.has(Discord.PermissionFlagsBits.KickMembers)){
            const d = connect()
            d.query('UPDATE bateponto SET tempototal =  0')

            const success = new Discord.EmbedBuilder()
            .setDescription(`<:Ativo:1142030710253813780> **|** Canais **DEFINIDOS** com sucesso.`)
            .setColor('#48CC73')

            interaction.reply({embeds:[success]})
        }
    }
}