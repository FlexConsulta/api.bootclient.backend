const LIMIT = process.env.SQL_LIMIT

const ViagemSetData = ({ offset = 0, data }) => `SELECT c.data,
coalesce(c.dataatual, c.datadigitacao) AS dataatual,
c.numero,
c.cancelado,
coalesce(mot.dataatual, mot.datainclusao) AS dataatualmot,
mot.cpf AS cpfmot,
mot.nome AS nomemot,
mot.liberado AS liberadomot,
mot.bloqueadoadm AS bloqueadoadmmot,
mot.celular AS celularmot,
mot.fone AS fonemot,
coalesce(prop.dataatual, prop.datainclusao) AS dataatualprop,
prop.cgccpf AS cgccpf,
prop.nome AS nomeprop,
prop.liberado AS liberadoprop,
prop.bloqueadoadm AS bloqueadoadmprop,
coalesce(veic.dataatual, veic.datainclusao) AS dataatualveic,
veic.placa AS cavalo,
veic.liberado AS liberadoveic,
veic.bloqueadoadm AS bloqueadoadmveic,
veic.placacarreta AS carreta1,
veic.placacarreta2 AS carreta2,
veic.placacarreta3 AS carreta3,
veic.placacarreta4 AS carreta4,
merc.descricao AS mercadoria,
cid.nome AS nomecidadeorigem,
cid.uf AS ufcidadeorigem,
cidd.nome AS nomecidadedestino,
cidd.uf AS ufcidadedestino
FROM conhecimento c
INNER JOIN motorista mot ON (c.codmotorista = mot.codmotorista)
INNER JOIN veiculo veic ON (c.codveiculo = veic.codveiculo)
INNER JOIN proprietario prop ON (c.codproprietario = prop.codproprietario)
INNER JOIN mercadoria merc ON (c.codmercadoria = merc.codmercadoria)
LEFT OUTER JOIN cidade cid ON (c.codcidadeorigem = cid.codcidade)
LEFT OUTER JOIN cidade cidd ON (c.codcidadedestino = cidd.codcidade)
WHERE c.data >= '${data}' AND c.data <= now() AT TIME ZONE 'AST'
AND c.tipocte IN ('0','1','2','B','D')
ORDER BY c.data ASC
OFFSET ${offset} LIMIT ${LIMIT};`


const ViagemSetDataFiltred = ({ offset = 0, data }) => `SELECT c.data,
coalesce(c.dataatual, c.datadigitacao) AS dataatual,
c.numero,
c.cancelado,
coalesce(mot.dataatual, mot.datainclusao) AS dataatualmot,
mot.cpf AS cpfmot,
mot.nome AS nomemot,
mot.liberado AS liberadomot,
mot.bloqueadoadm AS bloqueadoadmmot,
mot.obsbloq AS obsbloqmot,
mot.celular AS celularmot,
mot.fone AS fonemot,
coalesce(prop.dataatual, prop.datainclusao) AS dataatualprop,
prop.cgccpf AS cgccpf,
prop.nome AS nomeprop,
prop.liberado AS liberadoprop,
prop.bloqueadoadm AS bloqueadoadmprop,
prop.obsbloq AS obsbloqprop,
coalesce(veic.dataatual, veic.datainclusao) AS dataatualveic,
veic.placa AS cavalo,
veic.liberado AS liberadoveic,
veic.bloqueadoadm AS bloqueadoadmveic,
veic.obsbloq AS obsbloqveic,
veic.placacarreta AS carreta1,
veic.placacarreta2 AS carreta2,
veic.placacarreta3 AS carreta3,
veic.placacarreta4 AS carreta4,
merc.descricao AS mercadoria,
cid.nome AS nomecidadeorigem,
cid.uf AS ufcidadeorigem,
cidd.nome AS nomecidadedestino,
cidd.uf AS ufcidadedestino
FROM conhecimento c
INNER JOIN motorista mot ON (c.codmotorista = mot.codmotorista)
INNER JOIN veiculo veic ON (c.codveiculo = veic.codveiculo)
INNER JOIN proprietario prop ON (c.codproprietario = prop.codproprietario)
INNER JOIN mercadoria merc ON (c.codmercadoria = merc.codmercadoria)
LEFT OUTER JOIN cidade cid ON (c.codcidadeorigem = cid.codcidade)
LEFT OUTER JOIN cidade cidd ON (c.codcidadedestino = cidd.codcidade)
WHERE coalesce(c.dataatual, c.datadigitacao) >= '${data}'
AND c.data >= now() AT TIME ZONE 'AST' - INTERVAL '7 day' AND c.data <= now() AT TIME ZONE 'AST'
AND c.tipocte IN ('0','1','2','B','D')
ORDER BY coalesce(c.dataatual, c.datadigitacao) ASC
OFFSET ${offset} LIMIT ${LIMIT};`

module.exports = { ViagemSetData, ViagemSetDataFiltred }