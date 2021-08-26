
function getPopoverSwissProt(sp, groupIdx) {
    var processFn = function () { return addSwissProtList(sp, function(){}, function(){}, groupIdx); };
    return getPopoverDiv(sp, "SwissProt", processFn, false);
}

function getPopoverAnno(anno, groupIdx) {
    var processFn = function () { return addAnnoList(anno, groupIdx); };
    return getPopoverDiv(anno, "Annotations", processFn, false);
}

function getPopoverDiv(data, title, processFn, showBtn) {
    if (data.length == 0)
        return "";

    var div = $("<div></div>");
    var ul = processFn(data);
    if (showBtn) {
        ul.hide();
        var btn = $('<button class="btn btn-primary btn-sm">' + title + '</button>');
        btn.click(function() {
            ul.show();
        });
        div.append(btn);
    }
    div.append(ul);
    return div;
}
function getPopoverDiv2(data, title, processFn) {
    if (data.length == 0)
        return "";

    var div = processFn(data);
    return div;
}

function makeUniProtLink(uniProtId, altText) {
    if (!altText)
        altText = uniProtId;
    return '<a href="https://www.uniprot.org/uniprot/' + uniProtId + '" target="_blank">' + altText + '</a>';
}
function addSwissProtList(list, enzymeCodeFn, clipFn, groupIdx) {
    var ul = $('<ul class="expandable" style="padding-left:0px"></ul>');
    for (var i = 0; i < list.length; i++) {
        var parts = list[i][0].split("||");
        var desc = parts[0];
        if (parts.length > 0 && typeof parts[1] !== "undefined") 
            desc += enzymeCodeFn(parts[1]);
        var spItemIds = list[i][1].split(",").map(x => makeUniProtLink(x)).join("<br>\n");
        ul.append('<li data-toggle="collapse" data-target="#spListItem' + groupIdx + '-' + i + '">' + desc + '<div class="collapse sp-list-item" id="spListItem' + groupIdx + '-' + i + '">' + spItemIds + '</div>' + '</li>');
        spItemIds = "\t" + list[i][1].split(",").join("\n\t") + "\n";
        clipFn(desc, spItemIds);
    }
    return ul;
}

function addAnnoList(list, groupIdx) {
    var ul = $('<ul class="expandable" style="padding-left:0px"></ul>');
    for (var i = 0; i < list.length; i++) {
        var uniprotId = list[i][0];
        var doiList = list[i][1];
        var div = $('<div class="collapse sp-list-item" id="annoListItem' + groupIdx + '-' + i + '"></div>');
        div.append(makeUniProtLink(uniprotId, "UniProt Page") + '<br>');
        for (var j = 0; j < doiList.length; j++) {
            div.append('<a href="' + doiList[j] + '" target="_blank">' + doiList[j] + '</a><br>');
        }
        var li = $('<li data-toggle="collapse" data-target="#annoListItem' + groupIdx + '-' + i + '">' + uniprotId + '</li>');
        li.append(div);
        ul.append(li);
    }
    return ul;
}
function addAnnoList2(list) {
    var div = $('<div></div>');
    for (var i = 0; i < list.length; i++) {
        var doiList = list[i][1];
        for (var j = 0; j < doiList.length; j++) {
            div.append('<a href="' + doiList[j] + '">' + list[i][0] + '</a><br>')
        }
    }
    return div;
}

function addPopoverList(list, theClass, contentsFn) {
    var ul = $('<ul class="expandable"></ul>');
    var addListItemContentsFn = function(i, contentsFn) {
        return $('<div class="collapse sp-list-item" id="' + theClass + i + '">' + contentsFn() + '</div>');
    };
    var addListItemFn = function(i, contentsFn) {
        return $('<li data-toggle="collapse" data-target="#' + theClass + i + '">' + contentsFn() + '</li>');
    };
    for (var i = 0; i < list.length; i++) {
        var item = processFn(list[i], addListItemContentsFn, addListItemFn);
        ul.append(item);
    }
    return ul;
}

