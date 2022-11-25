const TelegramBot = require("node-telegram-bot-api");
const {gameOptions, againOptions} = require('./options')

// const telegramApi  = require(node-TelegramBot)

const tokren = '5594015621:AAFCXdV1fTS52_XQ4WX26N3JnB4FaAqe3j0';

const bot = new TelegramBot(tokren, {polling: true});

const chats = {};

const startGame = async(chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9')
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}

const start = async () => {
bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Получить информацию о поьзователе'},
    {command: '/game', description: 'Начать игру'},
])

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === '/start') {
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/345/7c2/3457c236-4b9c-3e7c-aa95-939ffbd6781a/5.webp')
        return bot.sendMessage(chatId, `Добро пожаловать в телеграмм бот`)
    }

    if (text === '/info') {
        return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
    }

    if (text === '/game') {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')
})

bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
    if (data ===  '/again') {
        return startGame(chatId);
    }
    if (data === chats[chatId]) {
        return await  bot.sendMessage(chatId, `Ты отгадал цифру цифру ${chats[chatId]}`, againOptions)
    } else {
        return await  bot.sendMessage(chatId, `Ты не отгадал цифру ${chats[chatId]}`, againOptions)
    }
})
}

start();