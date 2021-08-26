

function AppDiced(appData, appMeta, dataFeat) {
    this.appData = appData;
    this.appMeta = appMeta;
    this.dataFeat = dataFeat;
}


AppDiced.prototype.initDicedSsnOverview = function(ascores) {
    this.dataFeat.addClusterSize();
    var altDiv = $("#dicedAscoreListContainer");
    altDiv.show();
    
    var clusterName = this.appData.getName();

    var tabList = $("#dicedAscoreTabList");
    var tabs = $("#dicedAscoreTabs");
    for (var i = 0; i < ascores.length; i++) {
        var as = ascores[i];
        var fileName = this.appData.getImage();
        var filePath = this.appMeta.DataDir + '/dicing-' + as + '/' + fileName + '_sm.png';
        var style = i == 0 ? "active" : "";
        var style2 = i == 0 ? "show" : "";

        //var link = $('<a class="nav-link ' + style + '" id="ascore-pills-ascore-' + as + '-tab" data-toggle="pill" href="#ascore-tabs-ascore-' + as + '" role="tab">AS ' + as + '</a>');
        var link = $('<li class="nav-item"><a class="nav-link ' + style + '" id="ascore-pills-ascore-' + as + '-tab" data-toggle="pill" href="#ascore-tabs-ascore-' + as + '" role="tab">AS ' + as + '</a></li>');
        tabList.append(link);

        var theUrl = getUrlFn(this.appMeta.Id+"-1", this.appMeta.Version, as);
        var tab = $('<div class="tab-pane fade ' + style2 + ' ' + style + '" id="ascore-tabs-ascore-' + as + '"><h4>Alignment Score ' + as + '</h4></div>');
        var img = $('<img src="' + filePath + '" class="img-fluid" alt="Overview image for AS ' + as + '">');
        var imgLink = $('<a href="' + theUrl + '"></a>');
        imgLink.append(img);
        tab.append(imgLink);
        tab.append('<div class="center btn btn-primary m-1"><a href="' + theUrl + '">Go to the first sub-cluster in ' + clusterName + '.</a></div>');

        tabs.append(tab);
    }

    $("#submitAnnoLink").attr("href", $("#submitAnnoLink").attr("href") + "?id=" + this.appMeta.Id);
    $("#downloadClusterImage").hide();
}


AppDiced.prototype.addAscoreTabs = function() {
    //$("#clusterImgContainer").hide();
    var ascores = this.appData.getAltSsns();
    //TODO:
}


AppDiced.prototype.initDicedDescText = function(nextAs) {
    $(".diced-desc-cluster-id").text(this.appData.getName());
    $(".diced-desc-default-as").text(nextAs);
    $(".diced-desc-sfld").text(this.appData.getSfldDesc());
    $(".diced-desc-next-as").text(nextAs);
}


AppDiced.prototype.addDicedNav = function(isParent = false) {
    var that = this;

    if (!isParent) {
        var nav = this.appData.getDicedNav(isParent);
        var idParts = this.appMeta.Id.split("-");
        var parentIdParts = idParts.slice(0, idParts.length-1);
        var prevId = nav.siblings.prev ? parentIdParts.join("-") + "-" + nav.siblings.prev : "";
        var nextId = nav.siblings.next ? parentIdParts.join("-") + "-" + nav.siblings.next : "";
        
        var prevBtn = $('<button id="prev-sibling-btn" class="btn btn-primary btn-sm mr-0">Previous</button>');
        if (prevId) {
            prevBtn.click(function() {
                goToUrlFn(prevId, that.appMeta.Version, that.appMeta.Ascore);
            });
        } else {
            prevBtn.addClass("disabled");
        }
    
        var nextBtn = $('<button id="next-sibling-btn" class="btn btn-primary btn-sm">Next</button>');
        if (nextId) {
            nextBtn.click(function() {
                goToUrlFn(nextId, that.appMeta.Version, that.appMeta.Ascore);
            });
        } else {
            nextBtn.addClass("disabled");
        }
    
        var idCb = $('<select id="sel-sibling-id" class="form-control w-auth mx-2"></select>');
        var curId = idParts[idParts.length-1];
        var ids = nav.siblings.ids;
        var parentNum = idParts.slice(1, idParts.length-1).join("-");
        for (var i = 0; i < ids.length; i++) {
            var isSel = ids[i] == curId ? "selected" : "";
            idCb.append($('<option value="cluster-' + parentNum + '-' + ids[i] + '" ' + isSel + '>Cluster ' + parentNum + '-' + ids[i] + '</option>'));
        }
        idCb.change(function() {
            goToUrlFn(this.value, that.appMeta.Version, that.appMeta.Ascore);
        });
        
        $("#dicedNav").append(prevBtn).append(idCb).append(nextBtn);
    }

    var nav = this.appData.getDicedNav(isParent);
    var ascoreCb = $('<select id="sel-parent-ascores" class="form-control w-auto"></select>');
    for (var i = 0; i < nav.ascores.length; i++) {
        var isSel = nav.ascores[i] == this.appMeta.Ascore ? "selected" : "";
        ascoreCb.append($('<option value="' + nav.ascores[i] + '" ' + isSel + '>AS ' + nav.ascores[i] + '</option>'));
    }
    ascoreCb.change(function() {
        goToUrlFn(that.appMeta.Id, that.appMeta.Version, this.value);
    });
    $("#dicedNav").append('<span class="mr-1 ml-4">Alignment Score:</span>').append(ascoreCb);


    if (!isParent) {
        var asNavBtn = $('<button id="cluster-as-nav-btn" class="btn btn-primary btn-sm pull-right" style="margin-left: 90px"><i class="fas fa-code-branch"></i> AS Walk-Through</button>');
        asNavBtn.click(function() {
            $("#clusterAsNavList").empty();
            var dnav = that.appData.getDicedWalkthrough();
            var makeWalkthroughDnav = function(navList, headingText, isForward) {
                var nextAscore = "";
                var table = $('<table class="table"></table>');
                var th = $('<thead></thead>');
                th.append('<td>Cluster ID</td><td>Num Nodes</td><td>Conv. Ratio</td>');
                var dicedSpCol = $('<td>SwissProt</td>');
                th.append(dicedSpCol);
                dicedSpCol.show();
                var dicedAnnoCol = $('<td>Annotation</td>');
                th.append(dicedAnnoCol);
                var tbody = $('<tbody></tbody>');
                table.append(th).append(tbody);
   
                var numSp = 0;
                var numAnno = 0;
                var groupIdx = isForward ? "f" : "b";
                for (var i = 0; i < navList.length; i++) {
                    var navItem = navList[i];
                    var navItemName = ucFirst(navItem.cluster_id);
                    nextAscore = navItem.ascore;
                    if (typeof navItem.num_nodes !== "undefined") {
                        var spDiv = getPopoverSwissProt(navItem.sp, groupIdx+i);
                        if (spDiv != "")
                            numSp++;
                        var annoDiv = getPopoverAnno(navItem.anno, groupIdx+i);
                        if (annoDiv != "")
                            numAnno++;
                        var listItem = $('<tr></tr>');
                        listItem.append('<td><a href="' + getUrlFn(navItem.cluster_id, that.appMeta.Version, navItem.ascore) + '">' + navItemName + '</a></td>');
                        listItem.append('<td>' + navItem.num_nodes + '</td>');
                        var cr = typeof navItem.cr !== "undefined" ? navItem.cr : "";
                        listItem.append('<td>' + cr + '</td>');
                        var spCell = $('<td></td>');
                        spCell.append(spDiv);
                        listItem.append(spCell);
                        var annoCell = $('<td></td>');
                        annoCell.append(annoDiv);
                        listItem.append(annoCell);
                        tbody.append(listItem);
                    }
                }
                if (nextAscore)
                    $("#clusterAsNavList").append('<div></div>').append('<h5>' + headingText + ' (AS' + nextAscore + ')</h5>').append(table);
                //if (numSp == 0)
                //    dicedSpCol.hide();
                //if (numAnno == 0)
                //    dicedAnnoCol.hide();
            };
            if (dnav.backward !== false)
                makeWalkthroughDnav(dnav.backward, "Previous Cluster", false);
            if (dnav.forward !== false)
                makeWalkthroughDnav(dnav.forward, "Next Clusters", true);
            $("#clusterAsNavModal").modal();
        });
        $("#dicedNav").append(asNavBtn);
    }
}


