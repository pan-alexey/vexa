export interface RemoteState {
    layout: [];
}
export interface Config {
    name: string;
    publish: () => Promise<{
        [x: string]: unknown;
        BUCKET_NAME: string;
        S3_ACCESS_KEY: string;
        S3_ENDPOINT: string;
        S3_ENDPOINT_PORT: string;
        S3_SECRET_KEY: string;
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
