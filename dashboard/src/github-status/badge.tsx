import React, { FunctionComponent } from "react";
import { GithubStatus } from ".";

interface Props {
    lastUpdated: number;
    status: GithubStatus;
};

export const GithubStatusBadge: FunctionComponent<Props> = ({ lastUpdated, status }: Props): JSX.Element => {
    const { indicator, description } = status;
    const date = new Date(lastUpdated);

    return <>
        <div>
            <strong>{date.toLocaleString()}</strong>
        </div>
        Indicator: {indicator} - {description}
    </>;
}