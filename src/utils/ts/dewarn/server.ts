/**
 * @author HerbLuo
 * @date 2017/8/26.
 */
/**
 * 主要用于模拟服务端拉取的数据
 */
declare namespace serverdata {

  interface app {
    updateTimestamp: number,
    appEntranceVersion: string,
    appCityVersion: string
  }

  interface item {
    id: number,
    enabled: boolean,
    modifyTime: number,
    version: string,
    name: string,
    price: number,
    description: string,
    picLinksJson: string|Array<string>,
    itemSellingInfo: {
      itemId: number,
      quantity: number,
      sales: number,
      commentNum: number,
      score: number,
      inOrdering: number
    },
    detailDivId: number,
    shop: {
      id: number,
      enabled: boolean,
      name: string,
      sellerId: number
    }
  }

  interface auth {
    access_token: string,
    tokem_type: string,
    refresh_token: string,
    expires_in: number,
    scope: string
  }

  interface address {
    id: number
    enabled: boolean
    address: string
    postCode: string
    receiverName: string
    phone: string
    userId: number
    areDefault: boolean
  }

  interface poi {
    adCode: string;
    adName: string;
    businessArea: string;
    cityCode: string;
    cityName: string;
    direction: string;
    distance: number;
    email: string;
    enter: {
      latitude: number;
      longitude: number;
    };
    indoorData: {
      floor: number;
      floorName: string;
      poiId: string;
    };
    indoorMap: boolean;
    latLonPoint: {
      latitude: number;
      longitude: number;
    };
    parkingType: string;
    photos: [{
      title: string;
      url: string;
    }];
    poiExtension: {
      mRating: string;
      opentime: string;
    };
    poiId: string;
    postcode: string;
    provinceCode: string;
    provinceName: string;
    shopID: string;
    snippet: string;
    subPois: any[];
    tel: string;
    title: string;
    typeCode: string;
    typeDes: string;
    website: string;
  }

  interface describe {
    id: number
    describeJsonArray: string
  }

}