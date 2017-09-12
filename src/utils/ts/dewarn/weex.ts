/**
 * @author Ghosted
 * @date 2017/3/30.
 */

declare namespace dev {

  /**
   * Weex module
   */
  interface module {
    loadSuccess(): void

    onStop(call: Function): void

    registerOnTouchEvent(call: Function): void

    unRegisterOnTouchEvent(): void
  }

  interface amap {
    chooseLocation(call: Function): void
  }

  interface qrview {
    scanner(call: Function): void
  }

  interface requireModule {
    (name: string): any
  }

  interface weex {
    requireModule: requireModule
    config: {
      platform: string
    }
    env: {
      platform: string
    }
    platform: string
  }

  interface global {
    weex: weex
  }

}

declare namespace refresh {
  interface pullingdownInterface {
    dy: number;
    pullingDistance: number;
    viewHeight: number;
    type: "pullingdown";
  }
}

/* *********
 modal
 ********* */

declare namespace navigator {
  interface navigator {
    push(config: object, callback?: Function);
    pop(callback?: Function);
    setNavBarRightItem(param?: string, callback?: Function);
    clearNavBarRightItem(param?: string, callback?: Function);
    setNavBarLeftItem(param?: string, callback?: Function);
    clearNavBarLeftItem(param?: string, callback?: Function);
    setNavBarMoreItem(param?: string, callback?: Function);
    clearNavBarMoreItem(param?: string, callback?: Function);
    setNavBarTitle(param?: string, callback?: Function);
  }
}

declare namespace storage {
  interface Storage {
    setItem(key: string, value: string, callback: Function);

    getItem(key: string, callback: Function);

    removeItem(key: string, callback: Function);

    getAllKeys(callback: Function);
  }
}

declare namespace modal {
  interface ModalConfig {
    message: string
    duration: number
  }

  interface ConfirmConfig {
    message: string
    okTitle: string
    cancelTitle: string
  }

  interface modal {
    toast(config: ModalConfig): void

    confirm(config: ConfirmConfig): void
  }
}

declare namespace fetch {
  interface FetchOptions {
    method: string;
    url: string;
    headers?: object;
    type: 'json' | 'text' | 'jsonp';
    body?: string;
  }

  interface Response {
    status: number
    ok: boolean
    statusText: string
    data: object | string
    headers: object
  }

  interface FetchCallback {
    (Response): void
  }

  interface stream {
    fetch(options: FetchOptions, callback: FetchCallback)
  }
}
