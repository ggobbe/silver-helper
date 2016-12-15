'use strict';

var url = document.location.href;

var createCollections = function (collections, container, idSuffix) {
    for (var x in collections) {
        if (!collections.hasOwnProperty(x)) continue;
        var col = collections[x];

        var collectionId = "collection-" + col.name.toLowerCase() + idSuffix;
        if ($("#" + collectionId).length > 0) continue;

        var collectionDiv = $('<div id="' + collectionId + '" style="background: #3399cc;"></div>');
        var collectionTitle = $('<h4 style="color: white; margin-top: 11px; margin-bottom: 5px;">' + col.name + '</h4>');
        collectionDiv.append(collectionTitle);

        var brs = $(container).find('> br');
        brs.each(function (brIndex, brValue) {
            $(brValue).remove();
        });
        $(container).append(collectionDiv);
    }
}

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
            name: "Equipements",
            keywords: []
        },
        {
            name: "Autres",
            keywords: [""]
        }
    ];

    var tableNum = 0;
    $(".bord2").each(function (index, value) {
        tableNum++;
        var container = $(value).find('td[width="128"]');
        createCollections(collections, container, tableNum);

        var items = $(value).find(".tabContour");
        items.each(function (itemIndex, itemValue) {
            var itemName = $(itemValue).find("td.default")[0].innerText.toLowerCase();
            var itemType = $(itemValue).parent().find('input[name="type"]');

            if (itemType.val() === 'vetement') {
                var collectionId = "collection-equipements" + tableNum;
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
}