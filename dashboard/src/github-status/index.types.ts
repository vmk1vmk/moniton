export type GithubStatusContext = ContextLoading | ContextError | ContextData;

export interface ContextLoading {
    isLoading: true;
    hasErrors: false;
};

export interface ContextError {
    isLoading: false;
    hasErrors: true;
    error: Error;
}

export interface ContextData {
    isLoading: false;
    hasErrors: false;
    lastUpdated: number;
    status: GithubStatus;
};

export interface GithubStatus {
    indicator: 'none' | 'minor' | 'major' | 'critical';
    description: string;
}