const HttpConstants = require('../supports/http.constants')
const ServicesConstants = require('../supports/services.constants')
const ServicesResponseDto = require('../dtos/ServicesResponseDto')
const ServicesRequestDto = require('../dtos/ServicesRequestDto')
const Service = require('../services/LabelShipping')
const Validation = require('../validation')
const MultiCarrierShippingDbDao = require('../daos/MultiCarrierShippingDbDao')
const { status_label } = require('../supports/services.constants')
const { v4: uuidv4 } = require('uuid');


const createLabelShipping = async (event) => {
    try {
        const request = new ServicesRequestDto(event)
        const error = await Validation.validateRequestCreateLabelShipping(request)
        const codeLabel = uuidv4()
        if (error) {
            return new ServicesResponseDto(HttpConstants.errorRequestResponse, error)
        }
        const orders = request.body.payload.data
        const parameters = {
            status: status_label.pending,
            codeLabel,
            data : JSON.stringify(orders)
        }
        const result = await MultiCarrierShippingDbDao.saveMasterLabelShipping(parameters)
        const response = await Service.createLabelShipping(result.identifier,orders)
        return new ServicesResponseDto(HttpConstants.succefullResponse, response)
    } catch (error) {
        console.log(error)
        return new ServicesResponseDto(HttpConstants.errorRequestResponse,ServicesConstants.message.messageErrorServer)
    }
   
}

const getStatusLabelShipping = async (event) =>{
    const request = new ServicesRequestDto(event)
    const response = await Service.getStatusLabelShipping(request.pathParameters.id_solicitud)
    return new ServicesResponseDto(HttpConstants.succefullResponse,response)
}

const dowloadZipLabelShipping = async (event)=>{
    const request = new ServicesRequestDto(event)
    const response = await Service.getUrlLabelShipping(request.pathParameters.id_solicitud)
    return new ServicesResponseDto(HttpConstants.succefullResponseBase64,response)
}

module.exports = {
    createLabelShipping,
    getStatusLabelShipping,
    dowloadZipLabelShipping
}  