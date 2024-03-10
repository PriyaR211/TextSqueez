const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "/public")));

// post request body decoding
app.use(express.urlencoded({ extended: true }));

const port = 8080;

app.listen(port, () => {
    console.log("App is started at port 8080...");
});

app.get("/", (req, res) => {
    res.render("frontend.ejs");
})

app.get("/dashbord", (req, res) => {
    res.render("dashbord.ejs");
})

let SummarizerManager = require("node-summarizer").SummarizerManager;
app.post("/compress", (req, res) => {
    console.log(req.body);
    let { content, compress_level } = req.body;
    console.log("compression value:", compress_level);
    console.log("length of content: ", content.length);
    let count = 0;
    for (let i = 0; i < content.length; i++) {
        if (content.charAt(i) == '.') {
            count++;
            console.log("total sentences using loop: ", count);
        }
    }

    if (count < 5 && compress_level == 0) {
        count = 2;
    } else if (count < 5 && compress_level == 1) {
        count = 4;
    }

    let para = content;
    if (compress_level == 0) {
        console.log("Zero/low compress level applied");
        comprLevel = Math.floor(count / 2);
    } else {
        console.log("high compress level applied");
        comprLevel = Math.floor(count / 4);
    }
    console.log("level :", comprLevel);
    let Summarizer = new SummarizerManager(para, comprLevel);
    let summary = Summarizer.getSummaryByFrequency().summary;
    let sentiment = Summarizer.getSentiment();
    console.log("sentiment value : ", sentiment);

    res.render("output.ejs", { summary, content, sentiment });
})

