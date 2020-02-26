import React, { FunctionComponent } from "react";

interface Props {
    error: Error
}

export const ErrorIndicator: FunctionComponent<Props> = ({ error }: Props): JSX.Element => {
return <>Error "{error.message}"</>
}