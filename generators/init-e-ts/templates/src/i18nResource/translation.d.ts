interface IResourceDef {
    [language: string]: {
        [key: string]: string;
    }
}

declare const resource: IResourceDef;

export default resource;