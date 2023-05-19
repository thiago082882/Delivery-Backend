const mercadoPago = require('mercadopago');
const Order = require('../models/order');
const User = require('../models/user');
const OrderHasProduct = require('../models/order_has_products');
const pushNotificationController = require('../controllers/pushNotificationController');




mercadoPago.configure({
    sandbox: true,
    access_token: 'TEST-5210485235887136-050216-f23083f3018994e0e2c8cc518a650343-348750320'
});

module.exports = {

    async createPayment(req, res, next) {

        let payment = req.body;

        console.log('Dados enviados', payment);

        const payment_data = {
            transaction_amount: payment.transaction_amount,
            token: payment.token,
            description: payment.description,
            installments: payment.installments,
            payment_method_id: payment.payment_method_id,
            issuer_id: payment.issuer_id,
            payer: {
              email: payment.payer.email,
            }
        };

        const data = await mercadoPago.payment.create(payment_data).catch((err) => {
            console.log('Error:', err);
            return res.status(501).json({
                message: `Error ao criar o pagamento: ${err}`,
                success: false,
                error: err 
            });
        })

        if(data){
            const tokens =await User.getAdminsNotificationsTokens();

            let tokensString = []

            tokens.forEach(t => {
                tokensString.push(t.notification_token)
            })

            console.log('TOKENS', tokensString);
            
            pushNotificationController.sendNotificationToMultipleDevices(tokensString, {
                title: 'COMPRA REALIZADA',
                body: 'Um cliente fez uma compra',
                id_notification: '1'                
            });
        /*    pushNotificationController.sendNotification('cZkwVHQqTCqOFbkLmi5jkm:APA91bFBdaZo4UzvnwC_wUYw9scB8JKgmYBucs3NSl8sjG18G4a_236hv-ffhVDav2CEcYDdIosqAlTYtW6hl-ON0N3_KadFcp-pNc08XWmw8bgBEflcUaD1QRQzxupm2HUE5mJQ-eEj',{
                title: 'Compra Realizada',
                body: 'Um cliente realizou uma compra',
                id_notification: '1'
            });*/
           

        let order = payment.order;
        order.status = 'PAGO'
        const orderData = await Order.create(order);

        
        //Percorrer todos produtos agregados a cada ordem
        for(const product of order.products ){

            await OrderHasProduct.create(orderData.id,product.id,product.quantity);

        }

        console.log('Resposta de mercado pago',data.response)
            return res.status(201).json({
                message:`O Pagamento se realizou corretamente`,
                success:true,
                data: data.response
                
            })
        }else{
            return res.status(501).json({
                message: `Error ao colocar dado`,
                success: false
                
            });
        }
    }

    }

  