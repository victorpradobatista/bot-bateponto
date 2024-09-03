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
    name: "configc",
    description: "Cargos do Bate-Ponto",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
          name: 'cargoemservico',
          description: 'Selecione um cargo para ser o cargo recebido após entrar em serviço.',
          type: Discord.ApplicationCommandOptionType.Role,
          required: true,
        }, 
        {
            name: 'cargoforadeservico',
            description: 'Selecione um cargo para ser o cargo recebido após sair de serviço.',
            type: Discord.ApplicationCommandOptionType.Role,
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
            const roleEmServico = interaction.options.getRole('cargoemservico')
            const roleForaServico = interaction.options.getRole('cargoforadeservico')
            d.query('SELECT * FROM logs WHERE tipo = "cargo_em_servico"', function(err, result) {
                if(err) throw err;
                if(result == false) {
                    d.query(`INSERT INTO logs (tipo, id) VALUES ("cargo_em_servico", "${roleEmServico.id}")`)
                    d.query(`INSERT INTO logs (tipo, id) VALUES ("cargo_fora_servico", "${roleForaServico.id}")`)
                    interaction.reply({content:`Cargos setados`, ephemeral: true})
                } else {
                    d.query(`UPDATE logs SET id = "${roleEmServico.id}" WHERE tipo = "cargo_em_servico"`)
                    d.query(`UPDATE logs SET id = "${roleForaServico.id}" WHERE tipo = "cargo_fora_servico"`)
                    interaction.reply({content:`Cargos setados`, ephemeral: true})
                }
            })

        }
    }
}