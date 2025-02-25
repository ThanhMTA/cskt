import { Action } from "@app/enums";
import React from "react";

export interface IMenuItem {
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    to?: string,
    children?: IMenuItem[],
    component?: React.ReactNode,
    onClick?: () => void
}



export interface IQueryPayload {
    q?: string;
    page: number;
    per_page: number;
}

export interface IAttributes {
    [key: string]: string[];
}

export interface IMeta {
    count: number;
}

export interface IMetaDistinct {
    countDistinct: {
        [key: string]: number;
    };
}
export interface IResponse<T> {
    meta?: IMeta;
    data: T;
}

export interface IRequest {
    q?: string;
    page?: number;
    limit?: number;
    offset?: number;
}

export interface IEndPoint {
    key: string;
    value: string;
    label: string;
}

export interface IActivity {
    key: string,
    full_name: string,
    timestamp: any,
    collection: string,
    action: Action,
    detail_active: string
}