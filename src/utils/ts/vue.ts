/**
 * @author Ghosted
 * @date 2017/3/31.
 */
import {AxiosInstance, AxiosStatic} from 'axios'

declare namespace vuejs {

    interface log {
        info: Function
    }

    interface VueStatic {
        axios: AxiosInstance
        axios: AxiosStatic
        log: log
    }
}