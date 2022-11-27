const TelegramBot = require("node-telegram-bot-api");
const {gameOptions, againOptions} = require('./options');
const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');

const tokren = '5594015621:AAFCXdV1fTS52_XQ4WX26N3JnB4FaAqe3j0';

const bot = new TelegramBot(tokren, {polling: true});

const chats = {};
let words;
const variantAnswer = [];
let answer;

const startGame = async(chatId) => {

    variantAnswer.length = 0;
    answer = null;
    while (variantAnswer.length < 5) {
        const randomWords = Math.floor(Math.random() * words.length);
        if (!variantAnswer.includes(randomWords))
        variantAnswer.push(randomWords);
    }
    answer =  variantAnswer[Math.floor(Math.random() * variantAnswer.length)];
    chats[chatId] = answer;
    await bot.sendMessage(chatId, `Какой верный перевод слова "${words[answer][1]}"`)

    const gameWords = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: `${words[variantAnswer[1]][0]}`, callback_data: `${words[variantAnswer[1]][0]}`}],
                [{text: `${words[variantAnswer[2]][0]}`, callback_data: `${words[variantAnswer[2]][0]}`}],
                [{text: `${words[variantAnswer[3]][0]}`, callback_data: `${words[variantAnswer[3]][0]}`}],
                [{text: `${words[variantAnswer[4]][0]}`, callback_data: `${words[variantAnswer[4]][0]}`}],
            ]
        }),
    };
    await bot.sendMessage(chatId, 'Варианты ответа!', gameWords)
};


const start = async () => {
readXlsxFile(fs.createReadStream('./words.xlsx'))
    .then((rows) => {
        words = rows;
    })
    .catch((error) => {
        console.log(error);
    }) 
bot.setMyCommands([
    {command: '/start', description: 'Начать работу'},
    {command: '/game', description: 'Начать игру'},
])

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === '/start') {
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/345/7c2/3457c236-4b9c-3e7c-aa95-939ffbd6781a/5.webp')
        return bot.sendMessage(chatId, 'Привет! Для того чтобы достигать результатов нужно ставить реальные цели, цель этого бота помочь тебе изучить тысячу английских слов')
    };

    if (text === '/game') {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')
});

bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data ===  '/again') {
        return await startGame(chatId);
    } else {
        await bot.sendMessage(chatId, `Твой вариант ответа ${data}`)
    };
    if (words[chats[chatId]].includes(data)) {
        return await  bot.sendMessage(chatId, `Верно ${data} = ${words[chats[chatId]][1]}`, againOptions)
    } else {
        return await  bot.sendMessage(chatId, `Не верно, ${data} = ${words[chats[chatId]][1]}`, againOptions)
    };
});
};

start();