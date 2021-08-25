const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
const slugify = require("slugify");

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
//console.log('dataObj:', dataObj)
const slugs = dataObj.map((e) =>
  slugify(e.productName, {
    lower: true,
  })
);
//console.log('slugs:', slugs)
const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  //8/ console.log(' url.parse(req.url, true):', url.parse(req.url, true))
  //  console.log('query:', query)

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    // console.log("cardsHtml:", cardsHtml);
    const output1 = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output1);
  } else if (pathname === "/%60/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const product = dataObj.filter((e) => {
      return e.slugs == query.q;
    });

    const output2 = replaceTemplate(tempProduct, product[0]);
    res.end(output2);
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello World",
    });
    res.end("<h1>Page not found!</h1>");
  }

  //  console.log('req:', req)
});

server.listen(8100, "127.0.0.1", () => {
  console.log("Listening to request on port 8100");
});
