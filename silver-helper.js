'use strict';

var url = document.location.href;

if (url.endsWith("auberge.php")) {
    console.log("loading auberge script");

} else if (url.endsWith("rating")) {
    // TODO work in progress, need to get Pseudo and to put link after iframe src change
    var iframe = $('iframe[src^="/membres.php"]');
    var iframeDOM = iframe.contents();
    var rating = iframeDOM.find("td.default")[1];
    var regex = /Vous êtes classé (\d+)ème sur \d+ membres/g;
    var result = regex.exec(rating.innerText);
    if (result != null) {
        var position = +result[1];
        var total = +result[2];

        var skip = position - 25;
        if (skip < 0) skip = 0;

        var nextLink = iframeDOM.find('a[href^="?begin="]').first();
        var clRegex = /cl=(\d+)/g;
        var clResult = clRegex.exec(nextLink.attr("href"));
        var cl = 0;
        if (clResult != null) {
            cl = clResult[1];
            rating.append(document.createElement("br"));
            var posLink = document.createElement("a");
            $(posLink).attr("href", "membres.php?begin=" + skip + "&cl=" + cl);
            $(posLink).attr("class", "whiteLink");
            $(posLink).css("fontWeight", "bold");
            $(posLink).append(document.createTextNode("Naviguer vers ma page"));
            rating.append(posLink);

            iframeDOM.find('td[align="left"] > span.default').each(function (index, value) {
                if (value.innerText.indexOf("Pseudo") != -1) {
                    $(this).closest("tr").css("backgroundColor", "#000");
                }
            });
        }
    }
}