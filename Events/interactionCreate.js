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
            const queryUpdate3 = `UPDATE bateponto SET tempoinc = 0 WHERE id = '${interaction.user.id}'`
            d.query(`SELECT * FROM bateponto WHERE id = '${interaction.user.id}'`, function(errConfig, resultConfig){
            d.query(`SELECT * FROM cargos WHERE cargoEmServico = '${resultConfig[0].cargo}'`, function(errCargos, resultCargos){
            d.query(`SELECT * FROM vrp_permissions WHERE user_id = '${resultConfig[0].idIngame}'`, function(err, resultIngame) {
            d.query(querySelect1, function(err, result) {
                if(err) throw err;
                if(result == false) {
                    const embedError2 = new EmbedBuilder()
                    .setColor('#313338')
                    .setDescription(`<a:negado:1142675449751814275> Você ainda não se encontra de serviço, ou seja, não poderá terminar o seu expediente.`)
                    
                    interaction.reply({embeds: [embedError2], ephemeral: true})
                } else if(result[0].btinit == 'true') {
                    const tempoAgora = new Date().getTime()
                    const tempoConta = result[0].tempoinc
                    const total = (parseInt(tempoAgora) - tempoConta)
                    const total2 = parseInt(result[0].tempototal) + parseInt(total)
                    console.log('Total: ' + total)
                    const queryUpdate4 = `UPDATE bateponto SET tempototal = '${total2}' WHERE id = '${interaction.user.id}'`
                    const queryUpdate5 = `UPDATE bateponto SET btinit = 'false' WHERE id = '${interaction.user.id}'`
                    const queryUpdate10 = `UPDATE bateponto SET mensagemid = 'N/A' WHERE id = '${interaction.user.id}'`
                    d.query(queryUpdate4)
                    d.query(queryUpdate3)
                    d.query(queryUpdate5)
                    console.log(total)  

                    const date = new Date();

                    const months = [
                      "janeiro", "fevereiro", "março", "abril", "maio", "junho",
                      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
                    ];
                    
                    const day = date.getDate();
                    const month = months[date.getMonth()];
                    const hours = date.getHours().toString().padStart(2, '0'); // Adiciona zero à esquerda se necessário
                    const minutes = date.getMinutes().toString().padStart(2, '0'); // Adiciona zero à esquerda se necessário
                    
                    const timeString = `${day} de ${month} às ${hours}:${minutes}`;

                    const embedFinalizou = new EmbedBuilder().setColor('#313338').setDescription(`:bolinhavermelha:  O seu expediente  acaba de **TERMINOU**.\n\n:data: **Fim de expediente:** ${timeString} \n\n:relogio~3: **Tempo total deste expediente:** ${formatMilliseconds(total)}`)
                    interaction.reply({embeds:[embedFinalizou], ephemeral: true})
                    const selectLog = `SELECT * FROM logs WHERE tipo = 'cargo_em_servico'`
                    const selectLog2 = `SELECT * FROM logs WHERE tipo = 'cargo_fora_servico'`
                    const selectPrinc = `SELECT * FROM logs WHERE tipo = 'bate-ponto'`
                    d.query(selectLog2, function(err, result2) {
                    d.query(selectLog, function(err, result3) {
                    d.query(selectPrinc, function(err, result) {
                        const selectLog2 = `SELECT * FROM bateponto WHERE id = '${interaction.user.id}'`
                        if(err) throw err;  
                        d.query(selectLog2, function(errLog, resultLog) {
                            
                        // const tempoAgora = new Date().getTime()
                        // const tempoConta = resultLog[0].tempoinc
                        // const total = (tempoAgora - parseInt(tempoConta))
                        // console.log('Total Final: ' + total)
                        const membro = interaction.guild.members.cache.get(interaction.user.id)
                        const CargoEmServico = interaction.guild.roles.cache.get(result3[0].id)
                        const CargoForaDeServico = interaction.guild.roles.cache.get(result2[0].id)
                        membro.roles.add(CargoForaDeServico).then(() => {
                            membro.roles.remove(CargoEmServico)
                        })

                        if(resultIngame[0].permiss) {
                            d.query(`SELECT * FROM cargos WHERE CargoServico = '${resultIngame[0].permiss}'`, function(err, resultDisc){
                                if(resultDisc == false) {
                                    const embedErr = new EmbedBuilder()
                                    .setColor(config.color)
                                    .setDescription('O seu cargo não existe in-game')
                                    interaction.user.send({embeds:[embedErr]})
                                } else {
                                    d.query(`UPDATE vrp_permissions SET permiss = '${resultDisc[0].CargoForaServico}' WHERE user_id = '${resultConfig[0].idIngame}'`)
                                    console.log('Executado com sucesso!')
                                }
                            }) 
                        }
                        const date = new Date();

                        const months = [
                          "janeiro", "fevereiro", "março", "abril", "maio", "junho",
                          "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
                        ];
                        
                        const day = date.getDate();
                        const month = months[date.getMonth()];
                        const hours = date.getHours().toString().padStart(2, '0'); // Adiciona zero à esquerda se necessário
                        const minutes = date.getMinutes().toString().padStart(2, '0'); // Adiciona zero à esquerda se necessário
                        
                        const timeString = `${day} de ${month} às ${hours}:${minutes}`;

                            const embedTeste = new EmbedBuilder()
                            .setTitle(`📤 Sistema de controle de serviço`)
                            .setDescription(`**<:emojipessoabranco:1142035599105216512> | Usuário:**\n> <@${interaction.user.id}> / ${interaction.user.username}#${interaction.user.discriminator} \n\n**<a:data:1142034461928718337> | Iniciou o ponto:** \n> ${resultLog[0].horarioformatado} \n\n**📤 | Finalizou o ponto:**\n> ${timeString}\n\n**⏰ | Tempo de Expediente:**\n> ${formatMilliseconds(total)}`)
                            .setColor('#DD2E44')
                            .setThumbnail(interaction.user.displayAvatarURL({ dinamyc: true, size: 2048, format: 'png' }))
                            .setFooter({ iconURL: interaction.guild.iconURL({ dynamic: true }), text: (`${interaction.guild.name} - Todos os direitos reservados.`) })

                            client.channels.fetch(result[0].id)
                            .then(channel => {
                                    channel.messages.fetch(resultLog[0].mensagemid)
                                        .then(message => {
                                            message.edit({embeds:[embedTeste]})
                                        })
                                        .catch(error => {
                                            console.error('Erro ao buscar a mensagem:', error);
                                        });

                            })
                            .catch(error => {
                                console.error('Erro ao buscar o canal:', error);
                            });
                        })
                    })
                })
            })
                } else {
                    const embedError2 = new EmbedBuilder()
                    .setColor('#313338')
                    .setDescription(`<a:negado:1142675449751814275> Você ainda não se encontra de serviço, ou seja, não poderá terminar o seu expediente.`)
                    
                    interaction.reply({embeds: [embedError2], ephemeral: true})
                }
        
            })
        })
    })
            
})
        }
        if(interaction.customId == 'buttonVerify') {
            const d = connect()
            const querySelect1 = `SELECT * FROM bateponto WHERE id = '${interaction.user.id}'`
            d.query(querySelect1, function(err, result) {
                if(result == false) {
                    interaction.reply({content:`Inicie seu ponto antes!`, ephemeral: true})
                }  else if(result[0].btinit == 'false') {
                    interaction.reply({content:`Inicie seu ponto antes!`, ephemeral: true})
                }  else if(result[0].btinit == 'true'){
                    const tempoAgora = new Date().getTime()
                    const tempoConta = result[0].tempoinc
                    const total = (parseInt(tempoAgora) - parseInt(tempoConta))
                    interaction.reply({content: `O tempo de seu bate-ponto atual é **${formatMilliseconds(total)}**`, ephemeral: true})
                }
            })
        }
        if(interaction.customId == 'buttonInit') {
            const d = connect()
            const selectLog = `SELECT * FROM logs WHERE tipo = 'cargo_em_servico'`
            const selectLog2 = `SELECT * FROM logs WHERE tipo = 'cargo_fora_servico'`
            d.query(`SELECT * FROM bateponto WHERE id = '${interaction.user.id}'`, function(errConfig, resultConfig){
            d.query(`SELECT * FROM cargos WHERE cargoEmServico = '${resultConfig[0].cargo}'`, function(errCargos, resultCargos){
            d.query(selectLog2, function(err, result2) {
            d.query(selectLog, function(err, result3) {
                

            const querySelect = `SELECT * FROM bateponto WHERE id = '${interaction.user.id}'`

            d.query(querySelect, function(err, result) {
                if (err) throw err;
                if(result == false) {
                    interaction.reply({content: `Conta criada!`, ephemeral: true})
                    const queryInsert = `INSERT INTO bateponto (id, tempo, entrou, tempototal, tempoinc, btinit, mensagemid, horarioformatado, cargo, idIngame) VALUES ('${interaction.user.id}', '0', 'N/A', '0', 'N/A', 'false', 'N/A', '0', 'N/A', 'N/A')`
                    d.query(queryInsert)
                } else if(result[0].btinit == 'false' && result[0].cargo != 'N/A'){
                    const d = connect()
                    const currentTime = new Date().getTime()
                    const queryUpdate = `UPDATE bateponto SET tempoinc = '${currentTime}' WHERE id = '${interaction.user.id}'`
                    const queryUpdate2 = `UPDATE bateponto SET btinit = 'true' WHERE id = '${interaction.user.id}'`
                    
                    d.query(queryUpdate)
                    d.query(queryUpdate2)
                    d.query(`SELECT * FROM vrp_permissions WHERE user_id = '${resultConfig[0].idIngame}'`, function(err, resultIngame) {

                    const date = new Date();

                    const months = [
                    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
                    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
                    ];

                
                    const day = date.getDate();
                    const month = months[date.getMonth()];
                    const hours = date.getHours().toString().padStart(2, '0'); 
                    const minutes = date.getMinutes().toString().padStart(2, '0'); 

                    const timeString = `${day} de ${month} às ${hours}:${minutes}`;


                    const embedE = new EmbedBuilder().setColor('#313338').setDescription(`:snt_ping:  O seu expediente acaba de **INICIAR**.\n\n:data: **Início de expediente:** ${timeString}`)

                    interaction.reply({embeds:[embedE], ephemeral: true})
                    const membro = interaction.guild.members.cache.get(interaction.user.id)

                    const CargoEmServico = interaction.guild.roles.cache.get(result3[0].id)
                    const CargoForaDeServico = interaction.guild.roles.cache.get(result2[0].id)

                    membro.roles.add(CargoEmServico).then(() => {
                        membro.roles.remove(CargoForaDeServico)
                    })
                    console.log('Cargo Adicionado')

                    if(resultIngame[0].permiss) {
                        d.query(`SELECT * FROM cargos WHERE CargoForaServico = '${resultIngame[0].permiss}'`, function(err, resultDisc){
                            console.log(resultDisc)
                            if(resultDisc == false) {
                                const embedErr = new EmbedBuilder()
                                .setColor(config.color)
                                .setDescription('O seu cargo não existe in-game')
                                interaction.user.send({embeds:[embedErr]})
                            } else {
                                d.query(`UPDATE vrp_permissions SET permiss = '${resultDisc[0].CargoServico}' WHERE user_id = '${resultConfig[0].idIngame}'`)
                                console.log('Executado com sucesso!')
                            }
                        }) 
                    }
                    
                    d.query(`SELECT * FROM logs WHERE tipo = 'bate-ponto'`, function(err, resultLog) {
                        if(err) throw err;
                        const channelLog = interaction.guild.channels.cache.get(resultLog[0].id)
                        const date = new Date();

                        const months = [
                          "janeiro", "fevereiro", "março", "abril", "maio", "junho",
                          "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
                        ];
                        
                        const day = date.getDate();
                        const month = months[date.getMonth()];
                        const hours = date.getHours().toString().padStart(2, '0'); // Adiciona zero à esquerda se necessário
                        const minutes = date.getMinutes().toString().padStart(2, '0'); // Adiciona zero à esquerda se necessário
                        
                        const timeString = `${day} de ${month} às ${hours}:${minutes}`;

                        const updateTime = `UPDATE bateponto SET horarioformatado = '${timeString}' WHERE id = '${interaction.user.id}'`

                        d.query(updateTime)

                        const embedLog = new EmbedBuilder()
                        .setTitle(`📥 Sistema de controle de serviço`)
                        .setDescription(`**<:emojipessoabranco:1142035599105216512> | Usuário:**\n> <@${interaction.user.id}> / ${interaction.user.username}#${interaction.user.discriminator} \n\n**<a:data:1142034461928718337> | Iniciou o ponto:** \n> ${timeString} \n\n**📤 | Finalizou o ponto:**\n> <a:loading:1141775790518833263>\n\n**⏰ | Tempo de Expediente:**\n> <a:loading:1141775790518833263>`)
                        .setColor('#77B255')
                        .setThumbnail(interaction.user.displayAvatarURL({ dinamyc: true, size: 2048, format: 'png' }))
                        .setFooter({ iconURL: interaction.guild.iconURL({ dynamic: true }), text: (`${interaction.guild.name} - Todos os direitos reservados.`) })
                        //console.log('[LOG Enviada]')
                        channelLog.send({embeds:[embedLog]}).then((message) => {
                            d.query(`UPDATE bateponto SET mensagemid = '${message.id}' WHERE id = '${interaction.user.id}'`)
                        })
                    })
                })
                } else if(result[0].cargo == 'N/A') { 
                    interaction.reply({content:`Você não tem nenhum cargo setado, peça a um superior.`, ephemeral: true})
                } else {
                    const d = connect()

                    d.query(`SELECT * FROM bateponto WHERE id = '${interaction.user.id}'`, function(err, result) {
                    if(err) throw err;
                    const embedError = new EmbedBuilder()
                    .setColor('#313338')
                    .setDescription(`<a:negado:1142675449751814275> Você já se encontra de serviço, neste momento.\n\n<a:data:1142034461928718337> **Início de expediente:** ${result[0].horarioformatado}.`)

                    interaction.reply({embeds:[embedError], ephemeral: true})
                })
                }
            })
        })
    })
})
})
}


        if (interaction.customId == 'listTrue') {
            const d = connect();

            // Consultas para registros com bate-ponto iniciado (true) e fora de serviço (false)
            const querySelectTrue = `SELECT * FROM bateponto WHERE btinit = 'true'`;
            const querySelectFalse = `SELECT id, tempototal FROM bateponto WHERE btinit = 'false'`;
            
            // Função para formatar o tempo em milissegundos para uma string legível

            
            // Função para formatar a descrição dos registros
            function formatDescription(records, status, useTotal = false) {
                if (records.length === 0) {
                    return `Ninguém ${status}`;
                }
            
                let description = '';
                records.forEach(record => {
                    let displayTime;
                    if (useTotal) {
                        displayTime = formatMilliseconds(record.tempototal);
                    } else {
                        const tempoAgora = new Date().getTime();
                        const format = tempoAgora - record.tempoinc;
                        displayTime = formatMilliseconds(format);
                    }
                    description += `User: <@${record.id}>\n**Tempo:** ${displayTime}\n\n`;
                });
            
                return description || `**Ninguém ${status}**`;
            }
            
            // Executa ambas as consultas
            d.query(querySelectTrue, function(err, resultsTrue) {
                if (err) throw err;
            
                d.query(querySelectFalse, function(err, resultsFalse) {
                    if (err) throw err;
            
                    const embed = new EmbedBuilder()
                        .setColor('#313338')
                        .setTitle(':lab_tarf: LISTA DE REGISTROS DE BATE-PONTO')
                        .setDescription(`
                            :bolinhaverde: **EM SERVIÇO**:\n
                            ${formatDescription(resultsTrue, 'em serviço')}
                            
                            :bolinhavermelha: **FORA DE SERVIÇO**:\n
                            ${formatDescription(resultsFalse, 'fora de serviço', true)}
                        `);
            
                    interaction.reply({ embeds: [embed], ephemeral: true });
                });
            });
            
        }
    });


}