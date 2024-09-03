const Discord = require('discord.js')
const config = require('../config.json')
const mysql = require('mysql')
const transcript = require('discord-html-transcripts')
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, PermissionFlagsBits } = require('discord.js');

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

function connect() {

    return mysql.createPool({
        host: `${config.ip}`, // IP da database. Se estiver em localhost deixe 127.0.0.1.
        user: `${config.user}`, // Usuario da database, padrao root.
        password: "", // Senha da database, padrao sem senha.
        database: `${config.databasename}` // Nome da database.
    });
}

module.exports = async (client, interaction) => {
    client.on('interactionCreate', async interaction => {
      const d = connect()
      if (interaction.isStringSelectMenu()) {
        if (interaction.values[0] == "configlog") {
          const modal = new ModalBuilder()
            .setCustomId('modalConfigLog')
            .setTitle('Configurando logs...');
            const idQuestion = new TextInputBuilder()
            .setCustomId('idQuestion')
            .setLabel("Coloque o id do canal de logs")
            .setStyle(TextInputStyle.Short);
            const ActionRow = new ActionRowBuilder().addComponents(idQuestion)
            modal.addComponents(ActionRow);
            await interaction.showModal(modal);
        }
        if (interaction.values[0] == 'configroles') {
          const modal = new ModalBuilder()
          .setCustomId('modalConfigRoles')
          .setTitle('Configurando cargos...');
          const cargoEmServico = new TextInputBuilder()
          .setCustomId('cargoEmServico')
          .setLabel("Coloque o id do cargo em serviço")
          .setStyle(TextInputStyle.Short);
          const cargoForaDeServico = new TextInputBuilder()
          .setCustomId('cargoForaDeServico')
          .setLabel("Coloque o id do cargo fora de serviço")
          .setStyle(TextInputStyle.Short);

          const ActionRow = new ActionRowBuilder().addComponents(cargoEmServico)
          const ActionRow2 = new ActionRowBuilder().addComponents(cargoForaDeServico)
          
          modal.addComponents(ActionRow);
          modal.addComponents(ActionRow2)
          await interaction.showModal(modal);
        }
        if (interaction.values[0] == "remstaff") {
          const modal = new ModalBuilder()
            .setCustomId('modalRemStaff')
            .setTitle('Removendo staff!');
            const idDiscordRem = new TextInputBuilder()
            .setCustomId('idDiscordRem')
            .setLabel("Coloque o id ingame do staff")
            .setStyle(TextInputStyle.Short);

            const ActionRow = new ActionRowBuilder().addComponents(idDiscordRem)
            
            modal.addComponents(ActionRow);
            await interaction.showModal(modal);
        }
        if (interaction.values[0] == "addcargos") {
          const modal = new ModalBuilder()
            .setCustomId('modalAddCargos')
            .setTitle('Adicionando Cargos!');
            const emServico = new TextInputBuilder()
            .setCustomId('cargoEmServico')
            .setLabel("Cargo em serviço ex: Admin!")
            .setStyle(TextInputStyle.Short);
            const foraDeServico = new TextInputBuilder()
            .setCustomId('cargoForaDeServico')
            .setLabel("Cargo fora de serviço ex: AdminWait!")
            .setStyle(TextInputStyle.Short);

            const ActionRow = new ActionRowBuilder().addComponents(emServico)
            const ActionRow1 = new ActionRowBuilder().addComponents(foraDeServico)
            modal.addComponents(ActionRow);
            modal.addComponents(ActionRow1);
            await interaction.showModal(modal);
        }
        if (interaction.values[0] == "addstaff") {
          const modal = new ModalBuilder()
            .setCustomId('modalAddStaff')
            .setTitle('Adicionado staff!');
            const idIngame = new TextInputBuilder()
            .setCustomId('idIngame')
            .setLabel("Coloque o id ingame do staff")
            .setStyle(TextInputStyle.Short);
            const idDiscord = new TextInputBuilder()
            .setCustomId('idDiscord')
            .setLabel("Coloque o id do discord do staff")
            .setStyle(TextInputStyle.Short);
            const Cargo = new TextInputBuilder()
            .setCustomId('Cargo')
            .setLabel("Coloque o cargo ex: (Admin)")
            .setStyle(TextInputStyle.Short);

            const ActionRow = new ActionRowBuilder().addComponents(idIngame)
            const ActionRow1 = new ActionRowBuilder().addComponents(Cargo)
            const ActionRow2 = new ActionRowBuilder().addComponents(idDiscord)
            modal.addComponents(ActionRow);
            modal.addComponents(ActionRow1);
            modal.addComponents(ActionRow2);
            await interaction.showModal(modal);
        }
      }
      if(!interaction.isModalSubmit()) return;
      if(interaction.isModalSubmit()) {
        if(interaction.customId == 'modalConfigRoles') {
          let cargoEmServico = interaction.fields.getTextInputValue('cargoEmServico')
          let cargoForaDeServico = interaction.fields.getTextInputValue('cargoForaDeServico')

          d.query('SELECT * FROM logs WHERE tipo = "cargo_em_servico"', function(err, result) {
            if(err) throw err;
            if(result == false) {
                d.query(`INSERT INTO logs (tipo, id) VALUES ("cargo_em_servico", "${cargoEmServico}")`)
                d.query(`INSERT INTO logs (tipo, id) VALUES ("cargo_fora_servico", "${cargoForaDeServico}")`)
                const embedSucesso = new EmbedBuilder()
                .setDescription(`Cargos setados com sucesso! \n \n **Cargo em serviço:** <@&${cargoEmServico}> \n **Cargo em fora de serviço:** <@&${cargoForaDeServico}>`)
                .setColor(config.color)

                interaction.reply({embeds:[embedSucesso], ephemeral: true})
            } else {
                d.query(`UPDATE logs SET id = "${cargoEmServico}" WHERE tipo = "cargo_em_servico"`)
                d.query(`UPDATE logs SET id = "${cargoForaDeServico}" WHERE tipo = "cargo_fora_servico"`)

                const embedSucesso = new EmbedBuilder()
                .setDescription(`Cargos setados com sucesso! \n \n **Cargo em serviço:** <@&${cargoEmServico}> \n **Cargo em fora de serviço:** <@&${cargoForaDeServico}>`)
                .setColor(config.color)

                interaction.reply({embeds:[embedSucesso], ephemeral: true})
            }
          })
        }
        if(interaction.customId == 'modalAddCargos') {
          let emServico = interaction.fields.getTextInputValue('cargoEmServico')
          let foraDeServico = interaction.fields.getTextInputValue('cargoForaDeServico')

          const embedSucesso = new EmbedBuilder()
            .setDescription(`Cargos adicionados com sucesso! \n \n Cargo em serviço: **${emServico}** \n Cargo fora de serviço: **${foraDeServico}**`)
            .setColor(config.color)

          d.query(`INSERT INTO cargos (CargoServico, CargoForaServico) VALUES ('${emServico}', '${foraDeServico}')`)
          interaction.reply({embeds:[embedSucesso], ephemeral: true})
        }
        if(interaction.customId == 'modalRemStaff') {
          let idDiscordRem = interaction.fields.getTextInputValue('idDiscordRem')
          d.query(`SELECT * FROM bateponto WHERE id = '${idDiscordRem}'`, function(err, result) {
            if(err) throw err;
            if(result == false) {
              const embedError = new EmbedBuilder()
              .setDescription(`Esse staff não existe.`)
              .setColor(config.color)

              interaction.reply({embeds:[embedError], ephemeral: true})
            } else {
              const embedSucesso = new EmbedBuilder()
              .setDescription(`Staff removido com sucesso.`)
              .setColor(config.color)

              interaction.reply({embeds:[embedSucesso], ephemeral: true})
              d.query(`DELETE FROM bateponto WHERE id = ${idDiscordRem}`)
            }
          })
        }
        if(interaction.customId == 'modalAddStaff') {
          let idIngame = interaction.fields.getTextInputValue('idIngame')
          let idDiscord = interaction.fields.getTextInputValue('idDiscord')
          let Cargo = interaction.fields.getTextInputValue('Cargo')
          d.query(`SELECT * FROM bateponto WHERE id = '${idDiscord}'`, function(err, result) {
            if(err) throw err;
            if(result == false) {
              const queryInsert = `INSERT INTO bateponto (id, tempo, entrou, tempototal, tempoinc, btinit, mensagemid, horarioformatado, cargo, idIngame) VALUES ('${idDiscord}', '0', 'N/A', '0', 'N/A', 'false', 'N/A', '0', '${Cargo}', '${idIngame}')`
              d.query(queryInsert)
              const embedSucesso = new EmbedBuilder()
              .setDescription(`Staff adicionado com sucesso!`)
              .setColor(config.color)

              interaction.reply({embeds:[embedSucesso], ephemeral: true})
            } else {
              const queryUpdate1 = `UPDATE bateponto SET idIngame = '${idIngame}' WHERE id = '${idDiscord}'`
              const queryUpdate2 = `UPDATE bateponto SET cargo = '${Cargo}' WHERE id = '${idDiscord}'`
              d.query(queryUpdate1)
              d.query(queryUpdate2)
              const embedSucesso = new EmbedBuilder()
              .setDescription(`Staff adicionado com sucesso!`)
              .setColor(config.color)

              interaction.reply({embeds:[embedSucesso], ephemeral: true})
            }
          })
        }
        if(interaction.customId == 'modalConfigLog') {
          let id = interaction.fields.getTextInputValue('idQuestion')

          const d = connect()
          const querySelect = `SELECT * FROM logs WHERE tipo = 'bate-ponto'`
          d.query(querySelect, function(err, result) {
              if(err) throw err;
              if(result == false) {
                  const queryInsert = `INSERT INTO logs (tipo, id) VALUES ('bate-ponto', '${id}')`

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

                  const queryUpdate = `UPDATE logs SET id = '${id}' WHERE tipo = 'bate-ponto'`
                  d.query(queryUpdate)
                  interaction.reply({embeds: [trade], ephemeral: true})
              }
            })

        }
      }
    })
}