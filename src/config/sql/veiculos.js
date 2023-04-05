const LIMIT = process.env.SQL_LIMIT

const VeiculosGetAll = () => `SELECT coalesce(veic.dataatual, veic.datainclusao) AS dataatual,
veic.placa,
veic.liberado,
veic.bloqueadoadm
FROM veiculo veic 
WHERE veic.codveiculo = (select veic2.codveiculo from veiculo veic2 where veic.placa = veic2.placa order by coalesce(veic2.dataatual, veic2.datainclusao) desc limit 1 )
ORDER BY coalesce(veic.dataatual, veic.datainclusao) ASC
LIMIT {LIMIT} OFFSET {offset};`


const VeiculosSetData = (data) => `SELECT coalesce(veic.dataatual, veic.datainclusao) AS dataatual,
veic.placa,
veic.liberado,
veic.bloqueadoadm 
FROM veiculo veic
WHERE coalesce(veic.dataatual, veic.datainclusao) >= '${data}' 
AND veic.codveiculo = (select veic2.codveiculo from veiculo veic2 where veic.placa = veic2.placa order by coalesce(veic2.dataatual, veic2.datainclusao) desc limit 1 )
ORDER BY coalesce(veic.dataatual, veic.datainclusao) ASC;`

module.exports = { VeiculosSetData, VeiculosGetAll }