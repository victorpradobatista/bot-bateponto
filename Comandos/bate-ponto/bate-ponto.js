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
    name: "bate-ponto",
    description: "Painel de bate ponto",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
          name: 'canal',
          description: 'Selecione um canal de texto.',
          type: Discord.ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],

    run: async (client, interaction) => {
        const d = connect()
        if(!interaction.member.permissions.has(Discord.PermissionFlagsBits.KickMembers)){
            
        }
        if(interaction.member.permissions.has(Discord.PermissionFlagsBits.KickMembers)){

            const channel = interaction.options.getChannel('canal')

            const embed = new EmbedBuilder()
            .setTitle(`Painel bate-ponto`)
            .setDescription(`Teste bate-ponto`)
            .setColor("#2B2D31")
            const buttonInit = new ButtonBuilder()
            .setCustomId(`buttonInit`)
            .setEmoji(`🛎`)
            .setLabel(`iniciar`)
            .setStyle(ButtonStyle.Primary)
            const buttonStop = new ButtonBuilder()
            .setCustomId(`buttonStop`)
            .setEmoji(`❌`)
            .setLabel(`Parar`)
            .setStyle(ButtonStyle.Danger)
            const buttonVerify = new ButtonBuilder()
            .setCustomId(`buttonVerify`)
            .setEmoji(`👀`)
            .setLabel(`Verificar`)
            .setStyle(ButtonStyle.Secondary)
            const listTrue = new ButtonBuilder()
            .setCustomId(`listTrue`)
            .setEmoji(`🧾`)
            .setLabel(`Lista`)
            .setStyle(ButtonStyle.Secondary)


            const row = new ActionRowBuilder().addComponents(buttonInit).addComponents(buttonStop).addComponents(buttonVerify).addComponents(listTrue)

            channel.send({embeds: [embed], components: [row]})
            


            
        }
    }
}