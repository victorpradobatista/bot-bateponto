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
    name: "ranking",
    description: "Exibe o ranking de usuários por tempo de bate-ponto",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        const d = connect();

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.KickMembers)) {
            return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
        }

        d.query(`SELECT * FROM bateponto ORDER BY tempototal DESC`, function (err, results) {
            if (err) {
                console.error(err);
                return interaction.reply({ content: 'Houve um erro ao acessar a base de dados.', ephemeral: true });
            }

            const embed = new Discord.EmbedBuilder()
                .setTitle('Ranking de Usuários por Tempo de Bate-Ponto')
                .setColor(config.color)
                .setDescription('Aqui está o ranking dos usuários com o maior tempo registrado.');

            results.forEach((row, index) => {
                const userId = row.id;
                const userTime = formatMilliseconds(row.tempototal);
                embed.addFields({ name: `Top ${index + 1}`, value: `<@${userId}> Tempo Total: ${userTime}`, inline: false });
            });

            interaction.reply({ embeds: [embed] });
        });
    }
};
