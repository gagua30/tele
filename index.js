const TelegramApi = require('node-telegram-bot-api');

const token = '5183507113:AAH999_dk-pCS4aML9umIkpfdK2TXQC_RDI'; // БОТ 3/0 ТЕСТОВЫЙ

const bot = new TelegramApi(token, {
	polling: true
});
const mysql = require('mysql');


bot.on('message', msg => {
    const userId = msg.from.id; //ПОЛУЧАЕМ 
    const text = msg.text;
    const chatId = msg.chat.id;
    const nameTelegram = msg.from.username;
    let data = new Date();
    
    startSql(userId, text, chatId, nameTelegram, data);
})

function startSql(userId, text, chatId, nameTelegram, data){
    let adminName = '';
    let adminId = '';
    let k = '';
    let phone = '';
    let info = '';
    let statusUser = '';
    

    const conn = mysql.createConnection({
        host: "195.133.147.101",
        port: "3306",
        user: "ika30rus",
        database: "telega_db",
        password: "565884Iamlgend!"
    })
    

    const query = 'SELECT * FROM `adminUser` WHERE adminUser=?'; //поиск SQL юзера
    conn.query(query, [userId], function(err, result, field){
        result.forEach(function(row) {
            adminName = row.adminName;
            adminId = row.adminUser;
          })
    
    if( userId == adminId && text.length == 11 ){
        
        function searchEda(){          //Подключение к Яндекс Еде
            const query = 'SELECT * FROM eda WHERE phone=?';
            conn.query(query, [text], function(err, result, field) {
                if (JSON.stringify(result[0]) !== undefined) { 
                        result.forEach(function(row) {
                let nameUserEda = row.name;
                let emailUserEda = row.email; 
                let phoneUserEda = row.phone;
                let adresUserEda = row.adres;
                let geoUserEda = row.geo;
                let commitUserEda = row.commit; 
                
                bot.sendMessage(chatId, 'Яндекс еда по номеру: ' + phoneUserEda  + '\n' + 'Имя: ' + nameUserEda + '\n' + 'Емаил: ' +  emailUserEda + '\n' + 'Адрес: ' + adresUserEda + '\n' + 'Геолокация заказа: ' + geoUserEda + '\n' + 'Комментарий к заказу: ' +commitUserEda  );

                })
                }else{
                bot.sendMessage(chatId, 'Данные в Яндекс Еде не найдены');

                };
                
          })
        }

        function searchWaldberis(){          //Подключение к Валдберис
            const query = 'SELECT * FROM walberis WHERE phone=?';
            conn.query(query, [text], function(err, result, field) {
                if (JSON.stringify(result[0]) !== undefined) { 
                        result.forEach(function(row) {
                let nameUserWaldberis = row.name;
                let emailUserWaldberis = row.mail; 
                let phoneUserWaldberis= row.phone;
                let adresUserWaldberis = row.adres;
                                
                bot.sendMessage(chatId, 'Waldberis  по номеру: ' + phoneUserWaldberis  + '\n' + 'Данные: ' + nameUserWaldberis + '\n' + 'Емаил: ' +  emailUserWaldberis + '\n' + 'Адрес: ' + adresUserWaldberis);

                })
                }else{
                bot.sendMessage(chatId, 'Данные по базе Waldberis не найдены');

                };
                
          })
        } 

        function searchUla(){          //Подключение к Юла
            const query = 'SELECT * FROM ula_astra WHERE phone=?';
            conn.query(query, [text], function(err, result, field) {
                if (JSON.stringify(result[0]) !== undefined) { 
                        result.forEach(function(row) {
                let nameUserWaldberis = row.name;
                let phoneUserWaldberis= row.phone;
                                               
                bot.sendMessage(chatId, 'База Юла-объявления  по номеру: ' + phoneUserWaldberis  + '\n' + 'Данные: ' + nameUserWaldberis);

                })
                }else{
                bot.sendMessage(chatId, 'Данные по базе Юла объявления не найдены');

                };
                
          })
        } 

        let resQwest = "";
        console.log('Проверку  прошел');
        bot.sendMessage(chatId, 'Приветствую Вас ' + adminName );
        const query = 'SELECT * FROM `telega_2` WHERE telephone=?';
		conn.query(query, [text], function(err, result, field) {
            searchEda();
            searchWaldberis();
            searchUla(); 
            
            if (JSON.stringify(result[0]) !== undefined) { 
                    result.forEach(function(row) {
						phone = row.telephone;
                        info = row.info;
						let adres = row.adres;
						let zapros = row.zapros;
						let month = row.month;
                        statusUser = row.status;
						let b = ` ${adres} в ${month} ${zapros} раз`;
						k += b + '\n';
				    })
                    bot.sendMessage(chatId, 'Абонент ' + phone + ' заходил на ресурсы:' + '\n' + k + '\n' + 'имеющееся информация: ' + info + '\n' + 'Роль: ' + statusUser + '\n');
                    resQwest = true;
            }else{
                    bot.sendMessage(chatId,  'Абонент ' + phone +  ' по хостингам не обнаружен' + '\n');
                    resQwest = false;
            };
            let postData = {
                data: `${data}`,
                nameTelegram: `${nameTelegram}`, 
                idTelegram: `${userId}`, 
                adminName: `${adminName}`, 
                text: `${text}`,
                result: `${resQwest}`};
            conn.query('INSERT INTO `logBot` SET ?', [postData], function(err, result) { //ЛОГИРУЕМ ПОЛЬЗОВАТЕЛЕЙ
                console.log('The solution is: ', result);
                console.log(postData);
              });
			/* bot.sendMessage(chatId, 'Абонент ' + phone + ' заходил на ресурсы:' + '\n' + k + '\n' + 'имеющееся информация: ' + info ); */
	    })
        
    }else if(userId == adminId&&text == '/info'){
        bot.sendMessage(chatId, 'База версия 1.07 содержит:' + '\n' + '79 тысяч аккаунтинга'  + '\n' + 'Яндекс Еда 44 тысячи номеров'  + '\n' + 'Валдберис 2,5 тысячи номеров' + '\n' + 'Юла 2 тысячи номеров' );
    }else if(text.length != 11){
        bot.sendMessage(chatId, 'Приветствую Вас ' + adminName + '\n'+ ' Скорее Всего вы ввели неправильную команду'+'\n'+ 'Введите запрос в формате 7999******' );
        
    }else{
        console.log('Проверку не прошел');
        bot.sendMessage(chatId, " Если вы видете это сообщение, то значит у Вас нет доступа." +'\n'+ "Обратитесь к администратору для предоставления прав.");

        let postData = {
            data: `${data}`,
            nameTelegram: `${nameTelegram}`, 
            idTelegram: `${userId}`, 
            text: `${text}`,
            };
        conn.query('INSERT INTO `logUser` SET ?', [postData], function(err, result) { //ЛОГИРУЕМ ПОЛЬЗОВАТЕЛЕЙ
            console.log('The solution is: ', result);
            console.log(postData);
          });
    }

})

}