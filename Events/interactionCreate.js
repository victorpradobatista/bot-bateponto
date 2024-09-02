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
        if(interaction.customId == 'buttonStop') {
            const d = connect()
            const querySelect1 = `SELECT * FROM bateponto WHERE id = '${interaction.user.id}'`
            const queryUpdate3 = `UPDATE bateponto SET tempoinc = 0`
            d.query(querySelect1, function(err, result) {
                if(err) throw err;
                if(result == false) {
                    interaction.reply({content: `Seu ponto não está iniciado!`, ephemeral: true})
                } else if(result[0].btinit == 'true') {
                    const tempoAgora = new Date().getTime()
                    const tempoConta = result[0].tempoinc
                    const total = (parseInt(tempoAgora) - tempoConta)
                    const total2 = parseInt(result[0].tempototal) + parseInt(total)
                    console.log('Total: ' + total2)
                    const queryUpdate4 = `UPDATE bateponto SET tempototal = '${total2}'`
                    const queryUpdate5 = `UPDATE bateponto SET btinit = 'false'`
                    d.query(queryUpdate4)
                    d.query(queryUpdate3)
                    d.query(queryUpdate5)
                    console.log(total)
                    interaction.reply({content:`Ponto finalizado, total: ${formatMilliseconds(total)}`, ephemeral: true})
                } else {
                    interaction.reply({content: `Seu ponto não está iniciado!`, ephemeral: true})
                }
        
            })
            
        }
        if(interaction.customId == 'buttonVerify') {
            const d = connect()
            const querySelect1 = `SELECT * FROM bateponto WHERE id = '${interaction.user.id}'`
            d.query(querySelect1, function(err, result) {
                if(result == false) {
                    interaction.reply({content:`Inicie seu ponto antes!`, ephemeral: true})
                }  else if(result[0].btinit == false) {
                    interaction.reply({content:`Inicie seu ponto antes!`, ephemeral: true})
                }  else {
                    const tempoAgora = new Date().getTime()
                    const tempoConta = result[0].tempoinc
                    const total = (parseInt(tempoAgora) - tempoConta)
                    interaction.reply({content: `O tempo de seu bate-ponto atual é **${formatMilliseconds(total)}**`, ephemeral: true})
                }
            })
        }
        if(interaction.customId == 'buttonInit') {
            const d = connect()
            const querySelect = `SELECT * FROM bateponto WHERE id = '${interaction.user.id}'`
            
            d.query(querySelect, function(err, result) {
                if (err) throw err;
                if(result == false) {
                    interaction.reply({content: `Conta criada!`, ephemeral: true})
                    const queryInsert = `INSERT INTO bateponto (id, tempo, entrou, tempototal, tempoinc, btinit) VALUES ('${interaction.user.id}', '0', 'N/A', 'N/A', 'N/A', 'false')`
                    d.query(queryInsert)
                } else if(result[0].btinit == 'false'){
                    const currentTime = new Date().getTime()
                    const queryUpdate = `UPDATE bateponto SET tempoinc = '${currentTime}'`
                    const queryUpdate2 = `UPDATE bateponto SET btinit = 'true'`
                    
                    d.query(queryUpdate)
                    d.query(queryUpdate2)
                    interaction.reply({content:'Bate-ponto iniciado!', ephemeral: true})
                } else {
                    interaction.reply({content:'Bate-ponto já iniciado!', ephemeral: true})
                }
            })
        }

        if (interaction.customId == 'listTrue') {
            const d = connect();
            const querySelectTrue = `SELECT * FROM bateponto WHERE btinit = 'true'`;
        
            d.query(querySelectTrue, function(err, results) {
                if (err) throw err;
                
                if (results.length === 0) {
                    const embed = new EmbedBuilder()
                        .setColor('#2B2D31') // Amarelo para aviso
                        .setTitle('Nenhum Registro Encontrado')
                        .setDescription('Nenhum registro com bate-ponto iniciado foi encontrado.');
        
                    interaction.reply({ embeds: [embed], ephemeral: true });
                } else {
                    // Construa a descrição com os registros
                    let description = 'Registros com bate-ponto iniciado:\n';
                    results.forEach(record => {
                        const tempoAgora = new Date().getTime()
                        const format = tempoAgora - record.tempoinc
                        description += `ID: <@${record.id}>\nTempo Inicial: **${formatMilliseconds(format)}**\n\n`;
                    });
        
                    const embed = new EmbedBuilder()
                        .setColor('#2B2D31') // Azul para informações
                        .setTitle('Registros de Bate-Ponto')
                        .setDescription(description);
        
                    interaction.reply({ embeds: [embed], ephemeral: true });
                }
            })
        }
    });


}