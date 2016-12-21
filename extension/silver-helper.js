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
    var itemType = $(item).find('input[name="type"]').val();
    var itemId = $(item).find('input[name="idItem"]').val();

    if (itemType === 'vetement') {
        return collections[2]; // Equipements
    }

    for (var i in collections) {
        if (!collections.hasOwnProperty(i)) continue;
        var collection = collections[i];

        if ($.inArray(+itemId, collection.ids) != -1) {
            return collection;
        }
    }
    return collections[3];
}

if (url.indexOf("bank.php") != -1) {
    var collections = [
        {
            name: "Potions",
            ids: [669, 10, 44, 289, 560, 9, 1, 37, 226, 49, 31, 345, 445, 446, 447, 69, 7, 101, 716, 82, 298, 948, 131, 761, 282, 279, 300, 302, 380, 437, 381, 732, 382, 459, 658, 1012, 383, 672, 892, 1098, 1100, 1137, 873, 1135, 1101, 1005, 1065, 1075, 886, 1117, 544, 994, 1002, 1084, 4, 32, 8, 717, 81, 132, 949, 301, 733, 460, 762, 303, 384, 385, 438, 386, 387, 651, 893, 874, 1118, 545, 1066, 887, 995, 989, 1027, 1076, 1085]
        },
        {
            name: "Boosts",
            ids: [25, 759, 27, 274, 26, 76, 80, 142, 715, 448, 134, 146, 354, 882, 138, 736, 100, 306, 944, 310, 744, 393, 461, 394, 395, 855, 636, 429, 869, 1067, 845, 1121, 888, 990, 1086, 905, 753, 21, 22, 757, 23, 271, 74, 269, 335, 78, 141, 704, 712, 133, 145, 353, 883, 816, 97, 137, 734, 304, 99, 377, 945, 308, 343, 755, 401, 462, 402, 403, 364, 1091, 431, 633, 1109, 482, 1104, 426, 675, 870, 937, 1068, 846, 1120, 857, 889, 703, 991, 1080, 1090, 518, 1087, 1000, 534, 666, 18, 19, 760, 20, 273, 73, 77, 143, 714, 135, 147, 355, 884, 98, 139, 735, 378, 305, 946, 309, 754, 389, 463, 390, 391, 634, 430, 1111, 1105, 871, 1069, 847, 1122, 890, 992, 1081, 1088, 904, 756, 15, 16, 758, 17, 272, 75, 270, 79, 144, 705, 713, 136, 148, 352, 885, 140, 737, 231, 379, 307, 1020, 947, 311, 745, 344, 397, 464, 398, 399, 635, 432, 1110, 1106, 674, 872, 1092, 1070, 848, 1119, 891, 993, 1082, 1089, 558, 509, 1001]
        },
        {
            name: "Equipements",
            ids: []
        },
        {
            name: "Autres",
            ids: []
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