import React from "react";

export default function DatePhoto(props)
{
    const d = new Date(props.date);

    return <span className="date" dateTime={props.date}>{d.toLocaleDateString()} {d.toLocaleTimeString().replace(/:[0-9]+$/, '')}</span>
}