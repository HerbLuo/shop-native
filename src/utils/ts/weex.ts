/**
 * @author Ghosted
 * @date 2017/3/30.
 */

declare namespace weex {

    interface requireModule {
        (name: string): any
    }

    interface weexStatic {
        requireModule: requireModule
        config: {
            platform: string
        }
    }

    interface ModalConfig {
        message: string
        duration: number
    }
    interface modal {
        toast(config: ModalConfig): void
    }
}

declare let weex: weex.weexStatic;
declare let modal: modal;

// declare module 'weex' {
//     export = weex
// }
