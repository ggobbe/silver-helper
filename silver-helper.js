'use strict';

var url = document.location.href;

var createCollections = function (collections, container, idSuffix) {
    for (var x in collections) {
        if (!collections.hasOwnProperty(x)) continue;
        var col = collections[x];

        var collectionId = "collection-" + col.name.toLowerCase() + idSuffix;
        if ($("#" + collectionId).length > 0) continue;

        var collectionDiv = $('<div id="' + collectionId + '" style="background: #3399cc;"></div>');
        var collectionAnchor = $('<a name="' + collectionId + '"></a>');
        var separatorText = $("<span> </span>");
        var collectionLink = $('<a href="#' + collectionId + '" class="white_link">' + col.name + '</a>');
        var collectionTitle = $('<h4 style="color: white; margin-top: 11px; margin-bottom: 5px;">' + col.name + '</h4>');
        collectionDiv.append(collectionAnchor);
        collectionDiv.append(collectionTitle);

        var brs = $(container).find('> br');
        brs.each(function (brIndex, brValue) {
            $(brValue).remove();
        });
        $(container).prepend(separatorText);
        $(container).prepend(collectionLink);
        $(container).append(collectionDiv);
    }
}

var addItemToCollection = function (item, collection, suffix) {
    var collectionId = "collection-" + collection.name.toLowerCase() + suffix;
    $("#" + collectionId).append(item);
}

var findItemCollection = function (item, collections) {
    var itemName = $(item).find("td.default")[0].innerText.toLowerCase();
    var itemType = $(item).find('input[name="type"]');

    if (itemType.val() === 'vetement') {
        return collections[2]; // Equipements
    }

    for (var i in collections) {
        if (!collections.hasOwnProperty(i)) continue;
        var collection = collections[i];

        for (var j in collection.keywords) {
            if (!collection.keywords.hasOwnProperty(j)) continue;
            var keyword = collection.keywords[j];

            if (itemName.indexOf(keyword) != -1) {
                return collection;
            }
        }
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

        var items = $(value).find('form[name="form1"]');
        items.each(function (itemIndex, itemValue) {
            var collection = findItemCollection($(itemValue), collections);
            addItemToCollection($(itemValue), collection, tableNum);
        });
    });
}