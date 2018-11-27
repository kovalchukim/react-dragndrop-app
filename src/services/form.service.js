import axios from 'axios/index';

const validateReturnData = response => {
    if (response.status === 200 && response.data) {
        return response.data;
    }
};

const basePOST = (url, data, headers = '') => {
    return axios
        .post(url, data, headers)
        .then(validateReturnData)
        .catch(error => {
            throw error;
        });
};

export const uploadImage = data =>
        basePOST(`https://api.imgur.com/3/image`, data,
            {
                headers: {
                    'content-type': 'multipart/form-data',
                    'Authorization': 'Bearer ed13ff40bae7674f6134c9b59a763463aabe6ad5'
                }
            })

export const sendForm = data =>
        basePOST(`https://virtserver.swaggerhub.com/vitalyvolkov/store-simple/1.0.0/products`, data,
            {
                headers: {
                    'content-type': 'application/json',
                }
            })
