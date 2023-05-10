const fs = require('fs')
const path = require('path')
const url = require('url')

const handleRouter = (req, res) => {
    if (req.url === '/') {
        res.statusCode = 200
        res.setHeader('Content-type', 'text/html')
        res.write('<h1>Hello Node</h1>')
        res.write('<ul>')
        res.write('<li><a href="http://localhost:8000/write-message">Write Message</a></li>')
        res.write('<li><a href="http://localhost:8000/read-message">Read Message</a></li>')
        res.write('</ul>')
        res.end()
    }

    if (req.url === '/write-message' && req.method === 'GET') {
        const writepagePath = path.join(__dirname, 'write.html')
        fs.readFile(writepagePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    //404 - page not found
                    res.statusCode = 404
                    res.setHeader('Content-Type', 'text/html') //MIME
                    res.write(`
                        <html>
                            <body>
                                <h1>Opps! Page not found!</h1>
                            </body>
                        </html>
                    `)
                    res.end()
                } else {
                    //500
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'text/html') //MIME
                    res.write(`
                        <html>
                            <body>
                                <h1>Opps! A Server Error has occurred</h1>
                            </body>
                        </html>
                    `)
                    res.end()
                }
            }else{
                //Success
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.end(content, 'utf8')
            }
        })
    }

    if (req.url === '/write-message' && req.method === 'POST') {
        const body = []

        req.on('data', (chunk) => {
            body.push(chunk) //build up 
        })

        req.on('end', () => {
            console.log(body);
            const parsedBody = decodeURIComponent(Buffer.concat(body).toString().replace(/\+/g, ' '))
            console.log(parsedBody);
            const message = parsedBody.split("=")[1]
            console.log(message);
            fs.writeFile('read.txt', message, (err) => {
                if(err) throw err
                res.statusCode = 302
                res.setHeader('Location', '/')
                return res.end()
            })
        })
    }

    if (req.url === '/read-message' && req.method === 'GET') {
        let readData = ''
        const readpagePath = path.join(__dirname, 'read.txt')
        fs.readFile(readpagePath , 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            readData = 'Content: ' + data
            
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html') 
            res.write(`
                <html>
                    <body>
                    <p>`
                    + readData +
                    `</p>
                    <a href="http://localhost:8000/">Home</a>
                    </body>
                </html>
            `)
            res.end()
         });
    }
}

module.exports = { handleRouter }