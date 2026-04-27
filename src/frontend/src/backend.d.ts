import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ScanResult {
    breakdown: Array<BreakdownItem>;
    verdict: string;
    riskScore: bigint;
}
export interface BreakdownItem {
    status: string;
    rule: string;
    description: string;
    detail: string;
}
export interface ScanRecord {
    url: string;
    verdict: string;
    timestamp: bigint;
    riskScore: bigint;
}
export interface backendInterface {
    /**
     * / Returns up to `limit` most-recent scans (newest first).
     * / Pass 0 to get all.
     */
    getScanHistory(limit: bigint): Promise<Array<ScanRecord>>;
    /**
     * / Returns up to 20 most-recent phishing/suspicious scans (newest first).
     */
    getThreatFeed(): Promise<Array<ScanRecord>>;
    scanUrl(url: string): Promise<ScanResult>;
}
