/**
 * @author HerbLuo
 * @date 2017/7/21.
 */
interface HeadContent {
    id: number;
    type: number|string;
    img: string;
    text: string;
    timestramp?:number;
}

interface ContentContent {
    id: number;
    index: number;
    img: string;
    link: string;
    timestramp?:number;
}

interface Content<T> {
    content: T[];
}

interface Page {
    last: boolean;
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    sort: any;
    first: boolean;
    numberOfElements: number;
}

interface ServerData_ {
    head: Content<HeadContent> & Page;
    content: Content<ContentContent> & Page;
}

interface ZippedData_ {
    head: HeadContent[][];
    content: ContentContent[][];
}

interface GroupedContent<T> {
    [key: number]: T[]
}

interface GroupedData_ {
    head: GroupedContent<HeadContent>;
    content: GroupedContent<ContentContent>;
}

interface PackedData<T> {
    version: string;
    entity: T;
}

interface UnhandledUIData_ {
    head: HeadContent[];
    content: ContentContent[];
}

interface UIData_ {
    head: [HeadContent, HeadContent];
    content: [[ContentContent, ContentContent],[ContentContent, ContentContent]];
}

interface BlockData_ {
    id: number;
    name: string;
    title: string;
    columnType: number;
}

namespace block {
    interface Event<T> {
        type: 'storage' | 'server' | 'error' | 'timer';
        data: T;
    }
}
