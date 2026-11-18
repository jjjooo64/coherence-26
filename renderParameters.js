const renderParameters = {};
renderParameters.title = "";
renderParameters.boxFiller = "I control all content on the root domain of this page and every subdomain of that domain. I can make a secret code of your choice appear in this box upon request.";
renderParameters.greeting = "Below is a list of other things I made and/or manage";
renderParameters.conclusion = "Skeptics may follow a pointer below to see if the thing it references also refers you back here.";
renderParameters.goodbye = "Similar lists are accessible through the following domains under my control. But don't take my word for it:";
renderParameters.tagFoundSmallText = "";
renderParameters.tagFoundBigText = function (numberOfMatches) {
    return (
        "...you may find the first "
        + (numberOfMatches == 1 ? "link" : "" + numberOfMatches + " links")
        + " particularly useful."
    );
};
renderParameters.maindomains = [];

// Set this to your Function URL (no trailing slash)
renderParameters.endpoint = "https://oh4h4wfp6p5ehekkq7fbw3odtq0vkgdj.lambda-url.us-east-1.on.aws";

// Tries the endpoint; falls back to the dummy values if it fails.
// Returns { domains, resourceLocations, verificationText }
renderParameters.load = async function () {
    // Dummy values (demonstration of the expected format)
    const fallback = {
        domains: [
            ["https", "example.com"],
            ["https", "sub.example.org"]
        ],
        resourceLocations: [
            {
                metaURL: "example.com#tag",
                url: "https://example.com/path",
                nonclickable: false,
                description: "Example clickable resource"
            },
            {
                metaURL: "example.org",
                url: "Plain text or Discord handle",
                nonclickable: true,
                description: "Example non-clickable resource"
            }
        ],
        verificationText: null
    };
    if (!renderParameters.endpoint) return fallback;
    const base = renderParameters.endpoint.replace(/\/$/, "");
    try {
        const [paramsRes, textRes] = await Promise.all([
            fetch(base + "/"),
            fetch(base + "/code")
        ]);
        const result = { ...fallback };
        if (paramsRes.ok) {
            const params = await paramsRes.json();
            if (Array.isArray(params.domains)) result.domains = params.domains;
            if (Array.isArray(params.resourceLocations)) result.resourceLocations = params.resourceLocations;
        }
        if (textRes.ok) {
            const text = await textRes.json();
            if (text.verificationText) result.verificationText = text.verificationText;
        }
        return result;
    } catch (e) {
        return fallback;
    }
};
