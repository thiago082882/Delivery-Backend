const Order= require('../models/order');
const OrderHasProduct= require('../models/order_has_products');
const User=require('../models/user');
const timeRelative = require('../utils/time_relative');
const pushNotificationController = require('./pushNotificationController')



module.exports = { 

    async findByStatus(req, res, next) {

        try {
            const status = req.params.status;
            let data = await Order.findByStatus(status);

           
            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })
            console.log(`Status ${JSON.stringify(data)}`);
            return res.status(201).json(data);
            
        } 
        catch (error) {
            console.log(`Error ${error}`);    
            return res.status(501).json({
                message: 'Ocorreu um erro ao tentar obter os pedidos por status',
                error: error,
                success: false
            })
        }

    },

    async findByClientAndStatus(req, res, next) {

        try {
            const id_client = req.params.id_client;
            const status = req.params.status;
            let data = await Order.findByClientAndStatus(id_client,status);

            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })

            console.log(`order:`,data);
            //console.log(`Status ${JSON.stringify(data)}`);
            return res.status(201).json(data);
            
        } 
        catch (error) {
            console.log(`Error ${error}`);    
            return res.status(501).json({
                message: 'Ocorreu um erro ao tentar obter os pedidos por status',
                error: error,
                success: false
            })
        }

    },

    
    async findByDeliveryAndStatus(req, res, next) {

        try {
            const id_delivery = req.params.id_delivery;
            const status = req.params.status;
            let data = await Order.findByDeliveryAndStatus(id_delivery,status);

            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })

            console.log(`order:`,data);
            //console.log(`Status ${JSON.stringify(data)}`);
            return res.status(201).json(data);
            
        } 
        catch (error) {
            console.log(`Error ${error}`);    
            return res.status(501).json({
                message: 'Ocorreu um erro ao tentar obter os pedidos por status',
                error: error,
                success: false
            })
        }

    },


    async create(req,res,next){

    try {
        
        let order = req.body;
        order.status = 'PAGO'
        const data = await Order.create(order);

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

        
        //Percorrer todos produtos agregados a cada ordem
        for(const product of order.products ){

            await OrderHasProduct.create(data.id,product.id,product.quantity);

        }

        return res.status(201).json({
            success: true,
            message: 'Ordem criado com sucesso',
            data: {
                'id' :  data.id
            }
    
        });

    } catch (error) {
    console.log(`Error ${error}`);
    return res.status(501).json({
        success: false,
        message: 'Erro ao criar a ordem',
        error: error

    });
        
    }

       },

       async updateToDispatched(req, res, next) {
        try {
            
            let order = req.body;
            order.status = 'DESPACHADO';
            await Order.update(order);

            const user = await User. getNotificationTokenById(order.id_delivery);
            await pushNotificationController.sendNotification(user.notification_token,{
                title: 'PEDIDO ATRIBUÍDO',
                body: 'Você recebeu um pedido',
                id_notification: '2'                
            });
            return res.status(201).json({
                success: true,
                message: 'O pedido foi atualizado com sucesso',
            });

        } 
        catch (error) {
            console.log(`Error ${error}`);    
            return res.status(501).json({
                success: false,
                message: 'Ocorreu um erro ao criar o pedido',
                error: error
            });
        }
    },
    async updateToOnTheWay(req, res, next) {
        try {
            
            let order = req.body;
            order.status = 'ENCAMINHADO';
            await Order.update(order);

            const user = await User. getNotificationTokenById(order.id_client);

            await pushNotificationController.sendNotification(user.notification_token,{
                title: 'SEU PEDIDO FOI ENCAMINHADO',
                body: 'Um Entregador está a caminho',
                id_notification: '3'                
            });

            
            return res.status(201).json({
                success: true,
                message: 'O pedido foi atualizado com sucesso',
            });

        } 
        catch (error) {
            console.log(`Error ${error}`);    
            return res.status(501).json({
                success: false,
                message: 'Ocorreu um erro ao criar o pedido',
                error: error
            });
        }
    },
    async updateToDelivered(req, res, next) {
        try {
            
            let order = req.body;
            order.status = 'ENTREGUE';
            await Order.update(order);
            
            return res.status(201).json({
                success: true,
                message: 'O pedido foi atualizado com sucesso',
            });

        } 
        catch (error) {
            console.log(`Error ${error}`);    
            return res.status(501).json({
                success: false,
                message: 'Ocorreu um erro ao criar o pedido',
                error: error
            });
        }
    },
    async updateLatLng(req, res, next) {
        try {
            
            let order = req.body;
            
            await Order.updateLatLng(order);
            
            return res.status(201).json({
                success: true,
                message: 'O pedido foi atualizado com sucesso',
            });

        } 
        catch (error) {
            console.log(`Error ${error}`);    
            return res.status(501).json({
                success: false,
                message: 'Ocorreu um erro ao criar o pedido',
                error: error
            });
        }
    }
    
    }