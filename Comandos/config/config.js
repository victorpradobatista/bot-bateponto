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
    name: "config",
    description: "Configuração do bot.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        const d = connect()
        if(!interaction.member.permissions.has(Discord.PermissionFlagsBits.KickMembers)){
            interaction.reply({content:'Você não tem permissão', ephemeral: true})
        }
        if(interaction.member.permissions.has(Discord.PermissionFlagsBits.KickMembers)){
            const d = connect()

            const embedPainel = new EmbedBuilder()
            .setTitle(`Config | ${interaction.guild.name}`)
            .setDescription(`**Bem vindo ao painel de configuração!** \n # Aqui você pode configurar **todas** as funções do bot.`)
            .setColor(config.color)

        const select = new StringSelectMenuBuilder()
            .setCustomId('configselect')
            .setPlaceholder('Selecione a aba')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Logs Bate-Ponto')
                    .setEmoji('🧾')
                    .setDescription('Clique aqui para definir o id dos chats das logs.')
                    .setValue('configlog'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Cargos Bate-Ponto')
                    .setEmoji('👥')
                    .setDescription('Clique aqui para definir o cargo do bate-ponto')
                    .setValue('configroles'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Adicionar Staff')
                    .setEmoji('➕')
                    .setDescription('Clique aqui para adicionar um staff novo.')
                    .setValue('addstaff'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Remover Staff')
                    .setEmoji('❌')
                    .setDescription('Clique aqui para remover um staff')
                    .setValue('remstaff'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Adicionar Cargos In-game')
                    .setEmoji('👥')
                    .setDescription('Adicione cargos para ser rem/add ao bater-ponto')
                    .setValue('addcargos'),
            );
            const row = new ActionRowBuilder().addComponents(select)

            interaction.reply({embeds:[embedPainel], components:[row], ephemeral: true})

        }
    }
}