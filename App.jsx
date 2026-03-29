import { useState } from "react";
import SpectrumBuilder from "./src/SpectrumBuilder";
import { spectralData, stellarClasses, sampleStellarObjects } from "./data/spectralData";

export default function App() {
    const [lines, setLines] = useState([]);
    const [hover, setHover] = useState(null);
    const [info, setInfo] = useState("");

    const buildLines = (elements) => {
        return elements.flatMap((el) =>
            (spectralData[el] || []).map((wavelength) => ({
                wavelength,
                element: el,
            }))
        );
    };

    const search = async (query) => {
        query = query.trim();

        //local test stellar objects
        if(sampleStellarObjects[query]) {
            setLines(buildLines(sampleStellarObjects[query]));
            setInfo(`Stellar Object ${query}`);
            return;
        }

        //fetch SIMBAD INFO
        const res = await fetch(`/api/simbad?name=${query}`);
        const data = await res.json();

        const spectralType = data.spectral_type || "G";
        const starClass = spectralType[0] ||  "G";

        const elements =
            stellarClasses[starClass] || stellarClasses["G"];

        setLines(buildLines(elements));

        setInfo(
            `Type: ${data.type} | Spectral: ${spectralType}`
        );
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Stellar Spectrum Viewer</h1>

            <input
                placeholder="Enter star (e.g. Sirius)"
                onKeyDown={(e) => {
                    if (e.key === "Enter") search(e.target.value);
                }}
            />

            <p>{info}</p>

            <SpectrumBuilder
                lines={lines}
                hover={hover}
                setHover={setHover}
            />
        </div>

    );
}