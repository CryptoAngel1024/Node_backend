const Role = {}


Role.get = async (req, res) => {
    const roles = {
        1: "Vendite",
        2: "Comitato",
        3: "Gestione Clienti",
        4: "Gestione Contratti",
        5: "Vendite Pro",
        6: "Capo Comitato",
        7: "Gestione Vendite",
        8: "Tesoreria"
    }
    try {
        res.json(roles)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}
module.exports = Role