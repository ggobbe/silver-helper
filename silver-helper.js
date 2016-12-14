'use strict';

var url = document.location.href;

if (url.indexOf("auberge.php") != -1) {
    console.log("loading auberge script");

} else if (url.indexOf("bank.php") != -1) {
    console.log("loading bank script");

} else if (url.endsWith("rating")) {
    // TODO work in progress, need to get Pseudo and to put link after iframe src change
    var iframeElement = $('iframe[src^="/membres.php"]');
    var iframe = iframeElement.contents();
    var rankElement = iframe.find("td.default")[1];
    var rankRegex = /Vous êtes classé (\d+)ème sur \d+ membres/g;
    var rankResult = rankRegex.exec(rankElement.innerText);
    if (rankResult != null) {
        var rank = +rankResult[1];

        var pageSkip = rank - 25;
        if (pageSkip < 0) pageSkip = 0;

        var nextPageLink = iframe.find('a[href^="?begin="]').first();
        var categoryRegex = /cl=(\d+)/g;
        var categoryResult = categoryRegex.exec(nextPageLink.attr("href"));
        var category = 0;
        if (categoryResult != null) {
            category = categoryResult[1];
            rankElement.append(document.createElement("br"));
            var posLink = document.createElement("a");
            $(posLink).attr("href", "membres.php?begin=" + pageSkip + "&cl=" + category);
            $(posLink).attr("class", "whiteLink");
            $(posLink).css("fontWeight", "bold");
            $(posLink).append(document.createTextNode("Naviguer vers ma page"));
            rankElement.append(posLink);

            // iframe.find('td[align="left"] > span.default').each(function (index, value) {
            //     if (value.innerText.indexOf("Pseudo") != -1) {
            //         $(this).closest("tr").css("backgroundColor", "#000");
            //     }
            // });
        }
    }
}