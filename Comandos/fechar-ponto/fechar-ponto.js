const Discord = require("discord.js");
const mysql = require('mysql');
const config = require('../../config.json');

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
    if (years > 0) result += `${years} anos`;
    if (months > 0) result += `${result.length > 0 ? ', ' : ''}${months} meses`;
    if (days > 0) result += `${result.length > 0 ? ', ' : ''}${days} dias`;
    if (hours > 0) result += `${result.length > 0 ? ', ' : ''}${hours} horas`;
    if (minutes > 0) result += `${result.length > 0 ? ', ' : ''}${minutes} minutos`;
    if (seconds > 0) result += `${result.length > 0 ? ', ' : ''}${seconds} segundos`;
    if (ms <= 999) result += `0 segundos.`;

    return result;
}

module.exports = {
    name: "fechar-ponto",
    description: "Fecha o ponto de um usuário específico",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'user',
            description: 'Selecione um usuário para fechar o seu ponto de bate-ponto.',
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        const d = connect();
        const user = interaction.options.getUser('user').id;

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.KickMembers)) {
            return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
        }

        const querySelect = `SELECT * FROM bateponto WHERE id = '${user}'`;
        const queryUpdateTempoinc = `UPDATE bateponto SET tempoinc = 0 WHERE id = '${user}'`;
        const queryUpdateTempototal = `UPDATE bateponto SET tempototal = ? WHERE id = '${user}'`;
        const queryUpdateBtinit = `UPDATE bateponto SET btinit = 'false' WHERE id = '${user}'`;
        const queryUpdateMensagemid = `UPDATE bateponto SET mensagemid = 'N/A' WHERE id = '${user}'`;
        const queryLogs = `SELECT * FROM logs WHERE tipo = 'bate-ponto'`

        d.query(querySelect, (err, result) => {
            if (err) {
                console.error(err);
                return interaction.reply({ content: 'Houve um erro ao acessar a base de dados.', ephemeral: true });
            }

            if (result.length === 0) {
                return interaction.reply({ content: 'Não há ponto iniciado para este usuário.', ephemeral: true });
            }

            const ponto = result[0];
            if (ponto.btinit === 'true') {
                const tempoAgora = new Date().getTime();
                const tempoConta = ponto.tempoinc;
                const total = tempoAgora - tempoConta;
                const total2 = parseInt(ponto.tempototal) + total;

                d.query(queryUpdateTempototal, [total2], (err) => {
                    if (err) {
                        console.error(err);
                        return interaction.reply({ content: 'Houve um erro ao atualizar o total de tempo.', ephemeral: true });
                    }

                    d.query(queryUpdateTempoinc);
                    d.query(queryUpdateBtinit);
                    d.query(queryUpdateMensagemid);

                    interaction.reply({ content: `Ponto finalizado para <@${user}>, total: ${formatMilliseconds(total)}`, ephemeral: true });

                    // Atualizar cargos e log
                    const selectLogs = [
                        `SELECT * FROM logs WHERE tipo = 'cargo_em_servico'`,
                        `SELECT * FROM logs WHERE tipo = 'cargo_fora_servico'`,
                        `SELECT * FROM logs WHERE tipo = 'bate-ponto'`
                    ];

                    Promise.all(selectLogs.map(query => new Promise((resolve, reject) => {
                        d.query(query, (err, results) => {
                            if (err) return reject(err);
                            resolve(results);
                        });
                    })))
                    .then(([cargoEmServicoResults, cargoForaDeServicoResults, batePontoResults]) => {
                        const cargoEmServico = interaction.guild.roles.cache.get(cargoEmServicoResults[0].id);
                        const cargoForaDeServico = interaction.guild.roles.cache.get(cargoForaDeServicoResults[0].id);

                        const membro = interaction.guild.members.cache.get(user);
                        membro.roles.add(cargoForaDeServico).then(() => {
                            membro.roles.remove(cargoEmServico);
                        });

                        const now = new Date();
                        const formattedTime = now.toTimeString().split(' ')[0];

                        const embedTeste = new Discord.EmbedBuilder()
                            .setTitle(`📤 Sistema de controle de serviço (Ponto finalizado por Administrador ${interaction.user.username})`)
                            .setDescription(`**<:emojipessoabranco:1142035599105216512> | Usuário:**\n> <@${user}> / ${interaction.guild.members.cache.get(user).user.username}#${interaction.guild.members.cache.get(user).user.discriminator} \n\n**<a:data:1142034461928718337> | Iniciou o ponto:** \n> ${ponto.horarioformatado} \n\n**📤 | Finalizou o ponto:**\n> ${formattedTime}\n\n**⏰ | Tempo de Expediente:**\n> ${formatMilliseconds(total)}`)
                            .setColor('#DD2E44')
                            .setThumbnail(interaction.guild.members.cache.get(user).user.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' }))
                            .setFooter({ iconURL: interaction.guild.iconURL({ dynamic: true }), text: (`${interaction.guild.name} - Todos os direitos reservados.`) });
                        d.query(queryLogs, function(err, resultLOGS) {
                        client.channels.fetch(resultLOGS[0].id)
                            .then(channel => {
                                channel.messages.fetch(ponto.mensagemid)
                                    .then(message => {
                                        message.edit({ embeds: [embedTeste] });
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
                    .catch(error => {
                        console.error('Erro ao buscar logs:', error);
                    });
                });
            } else {
                interaction.reply({ content: 'O ponto deste usuário não está iniciado!', ephemeral: true });
            }
        });
    }
};
