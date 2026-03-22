import { useEffect, useRef } from "react";

export default function SpectrumBuilder({ lines, hover, setHover}) {
    const canvasRef = useRef(null);

    const wavelengthToRGB = (waveLength) => {
        if (waveLength < 380 || waveLength > 750) return [0, 0, 0];

        if (waveLength < 440) return [-(waveLength - 440) / 60, 0, 1];
        if (waveLength < 490) return [0, (waveLength - 440) / 50, 1];
        if (waveLength < 510) return [0, 1, -(waveLength - 510) / 20];
        if (waveLength < 580) return [(waveLength - 510) / 70, 1, 0];
        if (waveLength < 645) return [1, -(waveLength - 645) / 65, 0];

        return [1, 0, 0];
    };

    const draw = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const width = canvas.width;
        const height = canvas.height;

        //gradient
        for (let x = 0; x < width; x++) {
            const wavelength = 380 + (x/width) * (750 - 380);
            const [red, green, blue] = wavelengthToRGB(wavelength);

            ctx.fillStyle = `rgb(${red * 255}, ${green * 255}, ${blue * 255})`;
            ctx.fillRect(x, 0, 1, height);
        }

        //spectral lines
        lines.forEach((line) => {
            const x = ((line.wavelength - 380) / (750 - 380)) * width;

            ctx.strokeStyle = "black";
            ctx.lineWidth = hover === line.wavelength ? 4 : 2;

            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        });
    };

    useEffect(draw, [line, hover]);

    return (
        <canvas
            ref={canvasRef}
            width={900}
            height={250}
            onMouseMove={(e) => {
                const rect = e.target.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const wavelength = 380 + (x / rect.width) * (750 - 380);

                const closest = lines.find(
                    (l) => Match.abs(l.wavelength - wavelength) < 3
                );

                setHover(closest?.wavelength || null);
            }}
        />
    );
}