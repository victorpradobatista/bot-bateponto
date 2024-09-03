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
    name: "set-log",
    description: "Setar log do bate-ponto",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
          name: 'canal',
          description: 'Selecione um canal de texto para logs.',
          type: Discord.ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],

    run: async (client, interaction) => {
        const d = connect()
        if(!interaction.member.permissions.has(Discord.PermissionFlagsBits.KickMembers)){
            interaction.reply({content:'Você não tem permissão', ephemeral: true})
        }
        if(interaction.member.permissions.has(Discord.PermissionFlagsBits.KickMembers)){
            const d = connect()
            const channel = interaction.options.getChannel('canal')
            const querySelect = `SELECT * FROM logs WHERE tipo = 'bate-ponto'`
            d.query(querySelect, function(err, result) {
                if(err) throw err;
                if(result == false) {
                    const queryInsert = `INSERT INTO logs (tipo, id) VALUES ('bate-ponto', '${channel.id}')`

                    const success = new Discord.EmbedBuilder()
                    .setDescription(`<:Ativo:1142030710253813780> **|** Canais **DEFINIDOS** com sucesso.`)
                    .setColor('#48CC73')
                    const definindo = new Discord.EmbedBuilder()
                    .setDescription(`<a:loading:1141775790518833263> **|** Agurante estamos definindo os canais...`)
                    .setColor('#77B255')
                

                    interaction.reply({ embeds: [success], ephemeral: true })
                    d.query(queryInsert)
                   

                } else {
                    const trade = new Discord.EmbedBuilder()
                    .setDescription(`<a:loading:1141775790518833263> **|** O canal de log foi **trocado** com sucesso.`)
                    .setColor(`${config.color}`)

                    const queryUpdate = `UPDATE logs SET id = '${channel.id}' WHERE tipo = 'bate-ponto'`
                    d.query(queryUpdate)
                    interaction.reply({embeds: [trade], ephemeral: true})
                }
            })

        }
    }
}