export default async function handler(req, res) {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({error: "Missing Name"});
    }

    try {
        const url = `https://simbad.u-strasbg.fr/simbad/sim-id?Ident=${encodeURIComponent(
            name
        )}&output.format=JSON`;

        const response = await fetch(url);
        const data = await response.json();

        const result = data?.data?.[0] || {};

        res.status(200).json({
            type: result.otype || "Unknown",
            spectral_type: result.sp_type || "Unknown",
            parallax: result.plx_value || null,
        });
    } catch(err){
        res.status(500).json({error: "SIMBAD fetch failed"});
    }
}