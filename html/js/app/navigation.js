

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

    var parts = this.appData.Id.split("-");
    if (parts.length > 1) {
        var ol = $('<ol class="breadcrumb"><li class="breadcrumb-item" aria-current="page"><a href="?v=' + this.appMeta.Version + '">Explore</a></li>');
        for (var i = 1; i < parts.length; i++) {
            var item = "";
            if (i == parts.length - 1) {
                item = '<li class="breadcrumb-item active" aria-current="page">' + this.appData.getName() + '</li>';
            } else {
                var parentId = parts.slice(0, i + 1).join("-");
                var isDiced = (i == parts.length - 2 && this.appMeta.Ascore);
                //var ascore = isDiced ? "&as=" + this.appMeta.Ascore : "";
                var dicedMaster = isDiced ? "&d=l" : "";
                var url = 'id=' + parentId + dicedMaster;
                if (this.appMeta.Version)
                    url += '&v=' + this.appMeta.Version;
                item = '<li class="breadcrumb-item"><a href="?' + url + '">';
                var parentNet = this.appData.getNetworkMapName(parentId);
                if (typeof parentNet !== "undefined")
                    item += parentNet;
                else
                    item += parts[i];
                item += '</li>';
            }
            ol.append($(item));
        }
        nav.append(ol);
        nav.show();
    }
}

