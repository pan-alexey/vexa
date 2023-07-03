export interface RemoteState {
    layout: [];
}
export interface Config {
    name: string;
    publish: () => Promise<{
        [x: string]: unknown;
        BUCKET_NAME: string;
        MINIO_ACCESS_KEY: string;
        MINIO_ENDPOINT: string;
        MINIO_ENDPOINT_PORT: string;
        MINIO_SECRET_KEY: string;
    }>;
    debug: {
        remotes: Record<string, string>;
        httpPort: number;
        getState: (props: {
            url: string;
        }) => Promise<unknown>;
    };
}
export type CliConfigCallback = () => Promise<Config>;
export declare class CliConfig {
    private callback;
    constructor(callback: CliConfigCallback);
    getConfig(): CliConfigCallback;
}
