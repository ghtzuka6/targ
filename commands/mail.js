const request = require('request');

exports.run = (client, message, args, ops) => {
    var password = args[1];
    if(!args[0]) return message.reply("Insert the username you want to use");
    if(!args[1]) {
        password = Math.random().toString(36).slice(-8);
    }
    var url = "https://pddimp.yandex.ru/api2/admin/email/add";
    var domain = "universemail.tk";
    request(url, {
        headers: {
            "PddToken": "QW6Y3OFLLAISUSVUP5JYOIXOF4XMY5S7JHQ5RXLKFR5NYBIE4XHA",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: `domain=${domain}&login=${args[0]}&password=${password}`,
    }, function(err, response, req, body) {
        if(err) {
            console.log(err);
            return message.reply("Can't create mail at the moment, try again later...");
        }
        mailparse = JSON.parse(response.body);
        console.log(response);
        await message.channel.messages.fetch({ limit: 1 }).then(messages => {
            message.channel.bulkDelete(messages)
        });
        if(mailparse.success == "ok") {
            message.reply("I'm sending you a private message with the new mailbox informations");
            message.author.send("**New mailbox details**\n__Website:__ http://mail.universemail.tk\n__Login:__ " + args[0] + "@universemail.tk\n__Password:__ " + password);
        }
        if(mailparse.success == "error") {
            if(mailparse.error == "passwd-tooshort") message.reply("Password is too short!");
            if(mailparse.error == "occupied") message.reply("Username is not available");
        }
    })
}