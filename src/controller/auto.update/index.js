const cron = require("node-cron");
const { simpleGit, CleanOptions } = require("simple-git")

const options = {
    baseDir: process.cwd(),
    binary: "git",
    maxConcurrentProcesses: 6,
    trimmed: false,
};

const repo = simpleGit(process.env.GIT_PATH, options).clean(CleanOptions.FORCE);
const intervaloAtualizacao = "*/10 * * * * *";

const AutoComplete = cron.schedule(intervaloAtualizacao, () => {
    console.log("Verificando atualizações...");
    repo.pull((err, atualizacao) => {
        if (err) {
            console.log(err);
            return;
        }
        if (atualizacao && atualizacao.summary.changes) {
            console.log(`Atualizado!`);
        } else {
            console.log("Nenhuma atualização disponível.");
        }
    });
});

module.exports = AutoComplete