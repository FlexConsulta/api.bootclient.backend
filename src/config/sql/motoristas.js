const LIMIT = process.env.SQL_LIMIT

const MotoristaGetAll = (offset) => `SELECT mot.codmotorista, 
coalesce(mot.dataatual, mot.datainclusao) AS dataatual,
mot.cpf,
mot.liberado,
mot.nome,
mot.celular,
mot.fone,
mot.bloqueadoadm
FROM motorista mot 
WHERE mot.codmotorista = (select mot2.codmotorista from motorista mot2 where mot.cpf = mot2.cpf order by coalesce(mot2.dataatual, mot2.datainclusao) desc limit 1 )
ORDER BY coalesce(mot.dataatual, mot.datainclusao) ASC
LIMIT ${LIMIT} OFFSET ${offset};`


const MotoristaSetData = (data) => `SELECT mot.codmotorista, 
coalesce(mot.dataatual, mot.datainclusao) AS dataatual,
mot.cpf,
mot.liberado,
mot.nome,
mot.celular,
mot.fone,
mot.bloqueadoadm
FROM motorista mot 
WHERE coalesce(mot.dataatual, mot.datainclusao) >= '${data}' 
AND mot.codmotorista = (select mot2.codmotorista from motorista mot2 where mot.cpf = mot2.cpf order by coalesce(mot2.dataatual, mot2.datainclusao) desc limit 1 )
ORDER BY coalesce(mot.dataatual, mot.datainclusao) ASC;`

module.exports = { MotoristaGetAll, MotoristaSetData }