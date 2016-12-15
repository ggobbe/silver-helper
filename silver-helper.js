'use strict';

var url = document.location.href;

if (url.indexOf("bank.php") != -1) {
    var collections = [
        {
            name: "Boosts",
            keywords: ["boost", "constitution", "force", "agilité", "intel", "voix de gimlo", "maitrise spirituelle", "controle mental", "lait de coco"]
        },
        {
            name: "Potions",
            keywords: ["potion", "poisson", "essence", "ration", "vie des forgerons"]
        },
        {
            name: "Equipement",
            keywords: [
                // "casque", "masque", "diadème", "heaume", "chapeau", "tiare", "couronne",
                // "pendentif", "amulette",
                // "armure", "cuirasse", "tunique", "robe", "plastron", "cape", "manteau", "cotte de maille",
                // "bouclier", "pavois", "ecu", "rondache",
                // "epée", "glaive", "marteau", "dague", "bâton", "lame", "cimeterre", "lance", "gourdin", "sceptre", "hache", "arc ",
                // "bott"
            ]
        },
        {
            name: "Autres",
            keywords: [""]
        }
    ];

    var tableNum = 0;
    $(".bord2").each(function (index, value) {
        tableNum++;
        for (var x in collections) {
            if (!collections.hasOwnProperty(x)) continue;
            var col = collections[x];

            var collectionId = "collection-" + col.name.toLowerCase() + tableNum;
            if ($("#" + collectionId).length > 0) continue;

            var collectionDiv = $('<div id="' + collectionId + '" style="background: #3399cc;"></div>');
            var collectionTitle = $('<h4 style="color: white;">' + col.name + '</h4>');
            collectionDiv.append(collectionTitle);

            var mainCell = $(value).find('td[width="128"]');
            var brs = $(value).find('td[width="128"] > br');
            brs.each(function (brIndex, brValue) {
                $(brValue).remove();
            });
            mainCell.append(collectionDiv);
        }

        var items = $(value).find(".tabContour");
        items.each(function (itemIndex, itemValue) {
            var itemName = $(itemValue).find("td.default")[0].innerText.toLowerCase();
            var itemType = $(itemValue).parent().find('input[name="type"]');

            if (itemType.val() === 'vetement') {
                var collectionId = "collection-equipement" + tableNum;
                var parent = $(itemValue).parent();
                $("#" + collectionId).append(parent);
                return;
            }

            for (var i in collections) {
                if (!collections.hasOwnProperty(i)) continue;
                var collection = collections[i];

                for (var j in collection.keywords) {
                    if (!collection.keywords.hasOwnProperty(j)) continue;
                    var keyword = collection.keywords[j];

                    if (itemName.indexOf(keyword) != -1) {
                        var collectionId = "collection-" + collection.name.toLowerCase() + tableNum;
                        var parent = $(itemValue).parent();
                        $("#" + collectionId).append(parent);
                        return;
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