// Подключили библиотеки
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const WebSocket = require('ws');

//Настройки APP
const app = express();
app.use(cors());
app.use(express.json());

//Объявление ключевый переменных
const port = 8081;
const hostname = '192.168.0.8';
const instance = axios.create({
    baseURL: 'https://api.jsonbin.io/v3',
    headers: {
        "X-Master-Key": '$2b$10$0vceS6AqOhM/tVwuYA46RergFW/kUOW5.Bu2T64qgbHFxHwx8SNG.',
    },
})


const server = new WebSocket.Server({ port: 8081 });

server.on('connection', (wsConnection) => {
    wsConnection.on('message', (message) => {
        console.log(`server received: ${message}`);
    });

    wsConnection.send('Hy, i am localhost:8081');
});





//Авторизация
app.put('/users', (req, res) => {
    instance.get('/b/' + '641edfdface6f33a22fadc2f').then((response) => {
        let users = response.data.record.users
        let result = users.find((el) => el.login === req.body.login && el.password === req.body.password)
        if(result === undefined) {
            throw new Error('Invalid login or password')
        } else {
            res.json({
                ...result,
                statusCode: 200
            })
        }
    }).catch((err) => {
        res.status(401).send({message: err.message});
    })
})









//Запуск сервера
// app.listen(port, hostname, () => {
//     console.log(`Started server ${hostname}:${port}`)
// })
