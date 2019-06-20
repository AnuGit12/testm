import Axios from "axios";

export const Api = {
    setTableData: (payload) => {
        return Axios.post('/table-data-save',payload)
        
    },
    setSliderData: (payload) => {
        return Axios.post('/save-slider',payload)
        
    },
    setOtherData: (payload) => {
        return Axios.post('/save-other-data',payload)
        
    }
}