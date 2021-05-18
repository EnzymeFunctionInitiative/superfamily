
function getPopoverSwissProt(sp) {
    if (sp.length == 0)
        return "";

    var ul = addSwissProtList(sp, function(){}, function(){});
    ul.hide();
    var btn = $('<button class="btn btn-primary btn-sm">SwissProts</button>');
    btn.click(function() {
        ul.show();
    });
    var div = $("<div></div>");
    div.append(btn);
    div.append(ul);
    return div;
}

function addSwissProtList(list, enzymeCodeFn, clipFn) {
    var ul = $('<ul class="expandable"></ul>');
    for (var i = 0; i < list.length; i++) {
        var parts = list[i][0].split("||");
        var desc = parts[0];
        if (parts.length > 0 && typeof parts[1] !== "undefined") 
            desc += enzymeCodeFn(parts[1]);
        var spItemIds = list[i][1].split(",").map(x => '<a href="https://www.uniprot.org/uniprot/'+x+'">'+x+'</a>').join("<br>\n");
        ul.append('<li data-toggle="collapse" data-target="#spListItem' + i + '">' + desc + '<div class="collapse sp-list-item" id="spListItem' + i + '">' + spItemIds + '</div>' + '</li>');
        spItemIds = "\t" + list[i][1].split(",").join("\n\t") + "\n";
        clipFn(desc, spItemIds);
    }
    return ul;
}

