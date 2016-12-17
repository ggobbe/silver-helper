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
} else if (url.indexOf("attacklog.php") != -1) {
    var logLinks = $('a[href^="?cl="][href*="&action=view&id="]');
    var logUrlRegex = /cl=(\d)&action=view&id=(\d+)/i;

    if (logLinks.length > 0) {
        var logs = [];
        let previous = null;
        var index = 0;
        logLinks.each(function (index, value) {
            var result = logUrlRegex.exec($(value).attr("href"));
            logs[index] = {
                "cl": result[1],
                "id": result[2],
                "link": $(value).attr("href"),
                "previous": previous != null ? previous.link : null,
                "next": null
            };
            if (previous != null) {
                previous.next = logs[index].link;
            }
            previous = logs[index];
            index++;
        });
        var data = {};
        data["logs" + logs[0].cl] = logs;
        chrome.storage.local.set(data, null);
    } else {
        var results = logUrlRegex.exec(url);
        var logCl = results[1];
        var logId = results[2];
        var logsKey = "logs" + logCl;
        chrome.storage.local.get("" + logsKey, function (data) {
            var logLinks = data[logsKey];
            for (var index in logLinks) {
                if (!logLinks.hasOwnProperty(index)) continue;

                var log = logLinks[index];
                if (log.cl == logCl && log.id == logId) {
                    var cell = $('table[width="550"]').parent();
                    var divLinks = $('<div class="default" style="padding-left:50px;"></div>');
                    if (log.previous != null) {
                        var previousLink = $('<a href="' + log.previous + '" class="white_link">Précédent(' + index + ')</a>');
                        divLinks.append(previousLink);
                    }
                    divLinks.append($('<span> - </span>'));
                    if (log.next != null) {
                        var nextLink = $('<a href="' + log.next + '" class="white_link">Suivant(' + (logLinks.length - index - 1) + ')</a>');
                        divLinks.append(nextLink);
                    }
                    cell.append(divLinks);
                    return;
                }
            }
        });
    }
} else if (url.indexOf("fight.php?type=user") != -1) {
    var descriptionTab = $("table.cadreTableSombre");
    var lineBreak = descriptionTab.next();
    lineBreak.remove();
    var parentTab = descriptionTab.parent().parent();
    parentTab.append(descriptionTab);
}