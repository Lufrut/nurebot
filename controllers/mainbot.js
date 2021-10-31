const {General} = require('../models/general')
const CUM_MOD = 10;
const MAX_COUNT_OF_GET_SLAVES = 3;
const SLAVES_LOSS_RATE = 0.8;
class General_activities{
    async user_create(user_id,chat_id,username){
        const general = await General.findOne({
            where:{
                user_id: user_id,
                chat_id: chat_id,
            }})
        if(general===null){
            const general_row  = {
                user_id: user_id,
                chat_id: chat_id,
                amount: 0,
                play_today: false,
                username: username,
                slaves: 0,
                got_slaves_today: false,
            }
            await General.create(general_row)
            return 'Welcome to the club buddy'
        } else {
            return 'Вы уже зарегестрированны'
        }
    }
    async get_slaves(user_id,chat_id){
        const general = await General.findOne({
            where:{
                user_id: user_id,
                chat_id: chat_id,
            }})
        if(general===null){

            return 'Вы еще не зарегестрированны'
        } else if(general.got_slaves_today) {
            return 'Вы уже получали slaves сегодня'
        }else {
            const value = Math.round(Math.random()*MAX_COUNT_OF_GET_SLAVES)*Math.round(Math.random()*(-SLAVES_LOSS_RATE))
            general.slaves+= value
            await General.update(
                {
                    slaves:general.slaves,
                    got_slaves_today:true
                },
                {where: {id:general.id}
                })
            return `Вы успешно захватили: ${value} fucking slaves \nВсего у вас :${general.slaves} slaves`
        }
    }
    async get_user_info(user_id,chat_id){
        const general = await General.findOne({
            where:{
                user_id: user_id,
                chat_id: chat_id,
            }})
        if(general===null){

            return 'Вы еще не зарегестрированны'
        } else {
           return `Вы всего выпили: ${general.amount}ml of cum`
        }
    }
    async play_in_game(user_id,chat_id){
        const general = await General.findOne({
            where:{
                user_id: user_id,
                chat_id: chat_id,
            }})
        if(general===null){

            return 'Вы еще не зарегестрированны'
        } else if(general.play_today) {
            return 'Вы уже пили сегодня cum'
        }else {
            let amount=0;
            for (let i=0;i<=general.slaves;i++){
                amount+= Math.round(Math.random()*CUM_MOD)
            }
            general.amount+= amount
            await General.update(
                 {
                     amount:general.amount,
                     play_today:true
                 },
                {where: {id:general.id}
                })
            return `Вы успешно выпили: ${amount}ml of cum.\nВсего выпито:${general.amount}ml of cum`
        }
    }
    async get_top10_cum(chat_id){
        const general = await General.findAll({where:{
            chat_id:chat_id,
            },order:
                [['amount','DESC']]
            })
        let i = 0;
        let out = 'Топ игроков чата\n';
        for(let value of general){
            if(i<10){
                out+=`${i}. ${value.username}: ${value.amount}ml of cum\n`;
                i++
            } else {
                break
            }
        }
        return out
    }
    async get_top10_world_cum(){
        const general = await General.findAll({
            order:
                [['amount','DESC']]
        })
        let i = 0;
        let out = 'Топ игроков мира\n';
        for(let value of general){
            if(i<10){
                out+=`${i}. ${value.username}: ${value.amount}ml of cum\n`;
                i++
            } else {
                break
            }
        }
        return out
    }
    async get_top10_slaves(chat_id){
        const general = await General.findAll({where:{
                chat_id:chat_id,
            },order:
                [['slaves','DESC']]
        })
        let i = 0;
        let out = 'Топ игроков чата\n';
        for(let value of general){
            if(i<10){
                out+=`${i}. ${value.username}: ${value.slaves} slaves\n`;
                i++
            } else {
                break
            }
        }
        return out
    }
    async get_top10_world_slaves(){
        const general = await General.findAll({
            order:
                [['slaves','DESC']]
        })
        let i = 0;
        let out = 'Топ игроков мира\n';
        for(let value of general){
            if(i<10){
                out+=`${i}. ${value.username}: ${value.slaves} slaves\n`;
                i++
            } else {
                break
            }
        }
        return out
    }
    async refresh_game(){
        await General.update({play_today:false,got_slaves_today:false},{
            where:{
                play_today:true,
                got_slaves_today:true,
            }
        })
    }
}
module.exports = new General_activities()