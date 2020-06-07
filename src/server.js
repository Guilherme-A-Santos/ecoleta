// Para iniciar um servidor, precisamos primeiro usar o npm init -y


// Iniciar o servidor
const express = require("express")
const server = express()

// Pegar o banco de dados
const db = require("./database/db.js")


// configurar pasta publica
server.use(express.static("public"))

//habilitar o uso do req.body
server.use(express.urlencoded({extended: true}))

// utilizando template engine - npm install nunjucks (Deixa o html dinamico)
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})




// configurar caminhos da aplicação
// Página inicial
// req: Requesição
// res: Resposta

server.get("/", (req, res) => {
    return res.render("index.html", { title: "um titulo"})
})


server.get("/create-point", (req, res) => {

    // req.query: Query de string da nossa URL


    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

    // console.log(req.body)
    const query = `
            INSERT INTO places (
                image,
                name,
                address,
                address2,
                state,
                city,
                items
            ) VALUES (?, ?, ?, ?, ?, ?, ?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            return res.render("create-point.html", { saved: false })
            // return res.send("Erro!")
            // return res.render("create-point.html", { saved: false})
        }

        // console.log("cadastrado com sucesso")
        // console.log(this)
        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values, afterInsertData)

})


server.get("/search", (req, res) => {

    const search = req.query.search

    if (search == "") {
        //Pesquisa vazia
        return res.render("search-results.html", {total: 0})
    }


    // Pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        if (err) {
            return console.log(err)
        }

        const total = rows.length

        //mostrar a página do html com os dados do banco de dados
        return res.render("search-results.html", { places: rows, total})
    })


})




// Ligar o servidor - npm start
server.listen(3000)
