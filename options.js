module.exports = {    
    againOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Играть снова', callback_data: '/again'}],
            ]
        }),
    }
}