const renderParameters = {};
renderParameters.title = "Footprint Coherence Via Circular Links.";
renderParameters.greeting = "Just because someone sent you here, doesn't mean they are me. Below are links and/or directions for finding stuff I created or manage.";
renderParameters.conclusion = "But don't take my word for it. Follow a pointer below to see if the thing it references also refers you back here.";
renderParameters.goodbye = "Similar lists are accessible through the following domains under my control. But don't take my word for it:";
renderParameters.tagFoundSmallText = "";//"The URL in your address bar includes extra information suggesting that...";
renderParameters.tagFoundBigText
=
function (numberOfMatches)
{
    return (
        "...you may find the first "
        +
        (
            numberOfMatches == 1
            ? "link"
            :""+numberOfMatches + " links"
        )
        + " particularly useful."
    );
};//...you may find the first pointer particularly useful."
renderParameters.maindomains
=
[
    //["https", "rus.tf"]
];

renderParameters.domains
=[
    ,["https", "proof.am"]
    ,["https", "notfake.id"]
    ,["https", "okokstop.com"]
    ,["https", "jjj.ooo"] 
 
];


renderParameters.resourceLocations
=
[
    {
       metaURL: "notfake.id"
       , url:"On Discord under the username: notfake.id"
       ,nonclickable: true
       , description: ""
    }
    ,{
       metaURL: "proof.am#rsx"
       , url:"https://x.com/rustysand7x"
       , description:"🐦🐦"
    }
    ,{
        metaURL: "jjj.ooo#64"
        , url:"https://github.com/jjjooo64"
        , description:"Amazing repositories coming soon..."
    }
    ,{
       metaURL: "notfake.id#resume"
       , url:""
       ,nonclickable: true
       , description:"Digital CV coming soon..."
    }
    ,{
        metaURL: "proof.am#rustysan"
        , url:"mailto:rustysan@amazon.com"
        , description:"I'm the owner of this email address. I will send you a verification email from this address upon request."
    }
    ,{
        metaURL: "proof.am#gatech"
        , url:"mailto:easyproof@gatech.edu"
        , description:"If you send an email to this address, I will reply from jspinoza3@gatech.edu"
    }
];
