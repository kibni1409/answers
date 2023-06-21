// Подключили библиотеки
// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

//Настройки APP
// const app = express();
// app.use(cors());
// app.use(express.json());

//Объявление ключевый переменных
// const port = 8081;
// const hostname = '192.168.0.8';
// const instance = axios.create({
//     baseURL: 'https://api.jsonbin.io/v3',
//     headers: {
//         "X-Master-Key": '$2b$10$0vceS6AqOhM/tVwuYA46RergFW/kUOW5.Bu2T64qgbHFxHwx8SNG.',
//     },
// })
let clients = {}
let messages = []

// создаём новый websocket-сервер
const wss = new WebSocket.Server({
    port: 8081
});

//  отправляем клиентам, когда функция clientValidator возвращает true. this — это wss.
wss.broadcast = function(data, clientValidator = () => true) {
    this.clients.forEach(client => {
        if (clientValidator(client)) {
            client.send(data);
        }
    });
}

wss.on("connection", ws => {
    const id = uuidv4()
    clients[id] = ws
    wss.broadcast(JSON.stringify({id}), client => client === ws);


    // событие будет вызвано, когда клиент отправит сообщение
    ws.on('message', rawMessage => {
        const {name, message} = JSON.parse(rawMessage)
        //  отправляем сообщение всем, кроме автора
        messages.push({name, message})
        console.log(messages)
        wss.broadcast(JSON.stringify({messages}), client => client );
    });
});




//Авторизация
// app.put('/users', (req, res) => {
//     instance.get('/b/' + '641edfdface6f33a22fadc2f').then((response) => {
//         let users = response.data.record.users
//         let result = users.find((el) => el.login === req.body.login && el.password === req.body.password)
//         if(result === undefined) {
//             throw new Error('Invalid login or password')
//         } else {
//             res.json({
//                 ...result,
//                 statusCode: 200
//             })
//         }
//     }).catch((err) => {
//         res.status(401).send({message: err.message});
//     })
// })
//Запуск сервера
// app.listen(port, hostname, () => {
//     console.log(`Started server ${hostname}:${port}`)
// })
