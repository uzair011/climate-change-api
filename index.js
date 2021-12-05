const PORT = 8000
const express = require("express")
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require("express")
const { addBack } = require("cheerio/lib/api/traversing")

const app = express()

const newsPapers = [
    {
        name: "theguardian",
        address: "https://www.theguardian.com/environment/climate-crisis",
        base: ""
    },
    {
        name: "bbc",
        address: "https://www.bbc.com/news/science-environment-56837908",
        base: "https://www.bbc.com"
    },
    {
        name: "nasa",
        address: "https://www.nasa.gov/subject/18032/climate-variability-and-change/",
        base: ""
    },
    {
        name: "nyctimes",
        address: "https://www.nytimes.com/section/climate",
        base: "https://www.nyctimes.com"
    },
    {
        name: "aljazeera",
        address: "https://www.aljazeera.com/climate-crisis",
        base: "https://www.aljazeera.com"
    },
    {
        name: "washingtonpost",
        address: "https://www.washingtonpost.com/climate-environment/?itid=nb_climate-and-environment",
        base: ""
        
    },
    {
        name: "thetimes",
        address: "https://www.thetimes.co.uk/environment/climate-change",
        base: ""
        
    },
    {
        name: "climatechangenews",
        address: "https://www.climatechangenews.com/",
        base: ""
        
    },
    {
        name: "cnn",
        address: "https://edition.cnn.com/specials/world/cnn-climate",
        base: "https://edition.cnn.com"
        
    },
    {
        name: "scmp",
        address: "https://www.scmp.com/topics/climate-change",
        base: "https://www.scmp.com"
        
    },
    {
        name: "carbonbrief",
        address: "https://www.carbonbrief.org/category/science/climate-modelling",
        base: ""
        
    },
    {
        name: "independent",
        address: "https://www.independent.co.uk/climate-change",
        base: "https://www.independent.co.uk"
        
    },
    {
        name: "sciencenews",
        address: "https://www.sciencenews.org/topic/climate",
        base: ""
        
    },
    {
        name: "google",
        address: "https://news.google.com/search?q=climate&hl=en-GB&gl=GB&ceid=GB%3Aen",
        base: "https://news.google.com"
        
    }
]
const articles = []

// to display all the news papers
newsPapers.forEach(newsPaper => {
    axios.get(newsPaper.address)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr("href")

                articles.push({
                    title,
                    url: newsPaper.base + url ,
                    source: newsPaper.name
                })
            })
        })
    })

    app.get("/", (req, res) => {
        res.json("welcome to my climate change API")
    })

    app.get("/news", (req, res) => {
        res.json(articles)
    })
//to display searched news papers
    app.get("/news/:newsPaperID", (req, res) => {
        const newsPaperID = req.params.newsPaperID
        const wantedNewsPaperAddress = newsPapers.filter(newspaper => newspaper.name == newsPaperID)[0].address
        const addressBase = newsPapers.filter(newsPaper => newsPaper.name == newsPaperID)[0].base

    axios.get(wantedNewsPaperAddress)
        .then (response => {

            const html = response.data
            const $ = cheerio.load(html)
            const wantedArticles = []

            $('a:contains("climate")', html).each(function (){
                const title = $(this).text()
                const url = $(this).attr("href")

                wantedArticles.push({
                    title,
                    url: addressBase + url,
                    source: newsPaperID
                })
            })
            res.json(wantedArticles)
        }).catch((err) => console.log(err))
    })

    app.listen(PORT, () => console.log(`server is running perfectly on port ${PORT}`))
