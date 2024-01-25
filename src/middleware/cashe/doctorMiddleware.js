const client = require('../../startup/client')

function doctor(req, res, next) {
    client.get('doctorAll', (err, data) => {
        // console.log(data)
        if(err) throw err;
        if(data !== null){
            res.send(data)
        } 
    })
}
function inspection(req, res, next) {
    client.get('inspectionAll', (err, data) => {
        // console.log(data)
        if(err) throw err;
        if(data !== null){
            res.send({
                error: 'false',
                error_code: 201,
                message: 'malumot chiqdi',
                data: data
            })
        } 
    })
}

module.exports = {
    doctor,
    inspection
}