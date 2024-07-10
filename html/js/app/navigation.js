

function AppNav(appData, appMeta) {
    this.appData = appData;
    this.appMeta = appMeta;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// PAGE NAVIGATION ELEMENTS
//
AppNav.prototype.addBreadcrumb = function() {
    var nav = $("#exploreBreadcrumb");
    $("#exploreBreadcrumb").click(function() {
        sessionStorage.clear();
    });
    $("#navbarNavItems").click(function() {
        sessionStorage.clear();
    });

    var bc = this.appData.getBreadcrumb();
    var ol = $('<ol class="breadcrumb"><li class="breadcrumb-item" aria-current="page"><a href="?v=' + this.appMeta.Version + '">Explore</a></li>');
    for (var i = 0; i < bc.length; i++) {
        var item = "";
        var parentId = bc[i].cluster_id;
        var isDiced = (i == bc.length - 2 && this.appMeta.Ascore);
        //var ascore = isDiced ? "&as=" + this.appMeta.Ascore : "";
        var dicedMaster = ""; //(isDiced && i > bc.length-2) ? "&d=l" : "";
        var url = 'id=' + parentId + dicedMaster;
        if (this.appMeta.Version)
            url += '&v=' + this.appMeta.Version;
        item = '<li class="breadcrumb-item"><a href="?' + url + '">';
        //TODO: get parent
        var parentNet = bc[i].cluster_name;
        if (typeof parentNet !== "undefined")
            item += parentNet;
        else
            item += bc[i];
        item += '</li>';
        ol.append($(item));
    }
    item = '<li class="breadcrumb-item active" aria-current="page">' + this.appData.getName() + '</li>';
    ol.append($(item));
    nav.append(ol);
    nav.show();
}

