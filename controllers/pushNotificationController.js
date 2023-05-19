const https = require('https');




module.exports = {

    sendNotification(token, data) {
        
        const notification = JSON.stringify({
            'to': token,
            "data": {
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },
            'priority': 'high',
            'ttl': '4500s'
        });

        const options = {
            hostname: 'fcm.googleapis.com',
            path: '/fcm/send',
            method: 'POST',
            port: 443,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAAJXSWxG8:APA91bEtrgcWd7JWTRGQu6UfHAQYGczHoOrz78k5X-1H-zZaL5Vng4A-xN9r4O9skVB3uh3GRuEbclhz7fto7BpevSM2JUEQegsc477nPJ96eJOy8FLKmwe-ERMX84UT_0L608GA26My'
                
            }
        }

        const req = https.request(options, (res) => {
            console.log('Status code Notificattion', res.statusCode);
            res.on('data', (d) => {
                process.stdout.write(d)
            })
        })

        req.on('error', (error) => {
            console.error(error)
        })

        req.write(notification);
        req.end();

    },
sendNotificationToMultipleDevices(tokens, data) {
    
    const notification = JSON.stringify({
        'registration_ids': tokens,
        "data": {
            'title': data.title,
            'body': data.body,
            'id_notification': data.id_notification,
        },
        'priority': 'high',
        'ttl': '4500s'
    });

    const options = {
        hostname: 'fcm.googleapis.com',
        path: '/fcm/send',
        method: 'POST',
        port: 443,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AAAAJXSWxG8:APA91bEtrgcWd7JWTRGQu6UfHAQYGczHoOrz78k5X-1H-zZaL5Vng4A-xN9r4O9skVB3uh3GRuEbclhz7fto7BpevSM2JUEQegsc477nPJ96eJOy8FLKmwe-ERMX84UT_0L608GA26My'
        }
    }

    const req = https.request(options, (res) => {
        console.log('Status code Notificattion', res.statusCode);
        res.on('data', (d) => {
            process.stdout.write(d)
        })
    })

    req.on('error', (error) => {
        console.error(error)
    })

    req.write(notification);
    req.end();

}

}