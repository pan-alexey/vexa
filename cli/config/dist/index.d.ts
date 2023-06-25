export interface RemoteState {
    layout: [];
}
export interface Config {
    name: string;
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
