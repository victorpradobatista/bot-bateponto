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

function formatMilliseconds(ms) {
    const years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
    const remainingMs = ms % (1000 * 60 * 60 * 24 * 365);
    const months = Math.floor(remainingMs / (1000 * 60 * 60 * 24 * 30));
    const remainingMs2 = remainingMs % (1000 * 60 * 60 * 24 * 30);
    const days = Math.floor(remainingMs2 / (1000 * 60 * 60 * 24));
    const remainingMs3 = remainingMs2 % (1000 * 60 * 60 * 24);
    const hours = Math.floor(remainingMs3 / (1000 * 60 * 60));
    const remainingMs4 = remainingMs3 % (1000 * 60 * 60);
    const minutes = Math.floor(remainingMs4 / (1000 * 60));
    const seconds = Math.floor((remainingMs4 % (1000 * 60)) / 1000);

    let result = '';
    if (years > 0) {
        result += `${years} anos`;
      }
    if (months > 0) {
        result += `${result.length > 0 ? ', ' : ''}${months} meses`;
    }
    if (days > 0) {
      result += `${result.length > 0 ? ', ' : ''}${days} dias`;
    }
    if (hours > 0) {
      result += `${result.length > 0 ? ', ' : ''}${hours} horas`;
    }
    if (minutes > 0) {
        result += `${result.length > 0 ? ', ' : ''}${minutes} minutos`;
      }
    if (seconds > 0) {
      result += `${result.length > 0 ? ', ' : ''}${seconds} segundos`;
    }
    if (ms <= 999) {
        result += `0 segundos.`
    }
  
    return result;
  }

module.exports = {
    name: "ver-horas",
    description: "Ver hora de usuario especifico",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
          name: 'user',
          description: 'Selecione um usuário pra ver o seu tempo de bate-ponto.',
          type: Discord.ApplicationCommandOptionType.User,
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
            const user = interaction.options.getUser('user')
            d.query(`SELECT * FROM bateponto WHERE id = "${user.id}"`, function(err, result) {
                const embed = new EmbedBuilder() 
                .setTitle(`Horas do usuario ${user.username}`)
                .setDescription(`${formatMilliseconds(result[0].tempototal)}`)
                .setColor(config.color)
                interaction.reply({embeds: [embed], ephemeral: true})
            })

        }
    }
}