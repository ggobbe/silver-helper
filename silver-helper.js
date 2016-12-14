'use strict';

var url = document.location.href;

if (url.indexOf("auberge.php") != -1) {
    console.log("loading auberge script");

} else if (url.indexOf("bank.php") != -1) {
    console.log("loading bank script");

    var collections = [
        {
            name: "Potions",
            keywords: ["potion"]
        },
        {
            name: "Boosts",
            keywords: ["boost"]
        }
    ];

    var tableNum = 0;
    $(".bord2").each(function (index, value) {
        tableNum++;
        for (var x in collections) {
            if (!collections.hasOwnProperty(x)) continue;
            var col = collections[x];
            
            var collectionId = "collection-" + col.name.toLowerCase() + tableNum;
            if($("#"+collectionId).length > 0) continue;

            var collectionDiv = $('<div id="' + collectionId + '"></div>');
            var collectionTitle = $("<h3>" + col.name + "</h3>");
            collectionDiv.append(collectionTitle);

            $(value).append(collectionDiv);
        }

        var items = $(value).find(".tabContour");
        items.each(function (itemIndex, itemValue) {
            var itemName = $(itemValue).find("td.default")[0].innerText.toLowerCase();

            for (var i in collections) {
                if (!collections.hasOwnProperty(i)) continue;
                var collection = collections[i];

                for (var j in collection.keywords) {
                    if (!collection.keywords.hasOwnProperty(j)) continue;
                    var keyword = collection.keywords[j];

                    if (itemName.indexOf(keyword) != -1) {
                        console.log(keyword + ": " + itemName);
                    }
                }
            }
        });
    });

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