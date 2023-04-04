const LIMIT = process.env.SQL_LIMIT

const ProprietarioGetAll = ({ offset = 0 }) => `SELECT coalesce(prop.dataatual, prop.datainclusao) AS dataatual,
prop.cgccpf,
prop.nome,
prop.liberado,
prop.bloqueadoadm
FROM proprietario prop 
WHERE prop.codproprietario = (select prop2.codproprietario from proprietario prop2 where prop.cgccpf = prop2.cgccpf order by coalesce(prop2.dataatual, prop2.datainclusao) desc limit 1)
ORDER BY coalesce(prop.dataatual, prop.datainclusao) ASC
LIMIT ${LIMIT} OFFSET ${offset};`

const ProprietarioSetData = (data) => `SELECT coalesce(prop.dataatual, prop.datainclusao) AS dataatual,
prop.cgccpf,
prop.nome,
prop.liberado,
prop.bloqueadoadm
FROM proprietario prop 
WHERE coalesce(prop.dataatual, prop.datainclusao) >= '${data}' 
AND prop.codproprietario = (select prop2.codproprietario from proprietario prop2 where prop.cgccpf = prop2.cgccpf order by coalesce(prop2.dataatual, prop2.datainclusao) desc limit 1)
ORDER BY coalesce(prop.dataatual, prop.datainclusao) ASC;`


module.exports = { ProprietarioGetAll, ProprietarioSetData }