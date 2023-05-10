const http = require('http')
const route = require('./router')

const server = http.createServer()

server.on('request', (req, res) => {
    // console.log(req)
    route.handleRouter(req, res)
})

server.on('listening', () => {
    console.log('Server is listening...')
})

server.listen(8000)