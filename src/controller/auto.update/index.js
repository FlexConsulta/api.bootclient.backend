const cron = require("node-cron");
const { simpleGit, CleanOptions } = require("simple-git")

const options = {
    baseDir: process.cwd(),
    binary: "git",
    maxConcurrentProcesses: 6,
    trimmed: false,
};

const repo = simpleGit(process.env.GIT_PATH, options).clean(
    CleanOptions.FORCE
);
// const repo = simpleGit("https://github.com/anaelj/autoupdate", options).clean(
//     CleanOptions.FORCE
// );

const intervaloAtualizacao = "*/2 * * * *"; // atualiza a cada 5 minutos

 const AutoComplete = cron.schedule(intervaloAtualizacao, () => {
    console.log("Verificando atualizações...");
    repo.pull((err, atualizacao) => {
        if (atualizacao && atualizacao.summary.changes) {
            console.log(`Atualizado!`);
        } else {
            console.log("Nenhuma atualização disponível.");
        }
    });
});

module.exports = AutoComplete