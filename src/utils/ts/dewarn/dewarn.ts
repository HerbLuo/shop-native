/**
 * @author Ghosted
 * @date 2017/3/30.
 */

declare module namespace {

  interface console {
    info(str: any);
    log(str: any);
    error(str: any);
    oldError(str: any);
  }

  interface state {
    address: {
      addresses: Array<any>
    };
    app: {
      appDataInStorage: any, // 必有一个不为空
      appDataInServer: any, // 必有一个不为空
      appDataType: any,
      entrance: any
    };
    block: {
      ji_you_jia: {
        head: Array<any>,
        content: Array<any>
      },
      rush_buy: {
        content: Array<any>
      }
    };
    city: {
      provCityArea: any;
      streetss: any;
    };
    home: {
      refreshing: boolean
    };
    item: {
      // 当前浏览的item
      currentItemId: number,
      // 缓存的item
      items: any,
      // 缓存的item对应的id（顺序只和数据新旧有关）
      itemIds: Array<any>,
      // 商品详情
      itemDetails: {
        'item-id': {
          descirbes: string
        }
      }
    };
    user: {
      login: boolean,
      username: string,
      access_token: string
    };
  }

}
