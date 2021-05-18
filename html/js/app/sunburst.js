
////////////////////////////////////////////////////////////////////////////////////////////////////
// SUNBURST
//

function AppSunburst(network, uniref) {
    this.network = network;
    this.uniref = uniref;
}

AppSunburst.prototype.addSunburstFeature = function() {
    var feat = this.network.getDisplayFeatures();
    if (!feat.hasOwnProperty("tax"))
        return;

    var that = this;
    var Colors = getSunburstColorFn();

    var setupSvgDownload = function() {
        var svg = $("#sunburstChart svg")[0];
        $("#sunburstSvg").click(function() {
            var svgData = svg.outerHTML;
            var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
            var svgUrl = URL.createObjectURL(svgBlob);
            var downloadLink = document.createElement("a");
            downloadLink.href = svgUrl;
            downloadLink.download = "newesttree.svg";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    };

    var addCurViewNumSeq = function() {
        var numUniProt = commify(that.sbCurrentData.numSequences);
        var idStr = that.sbCurrentData.numSequences > 1 ? "IDs" : "ID";
        $("#sunburstIdNums").text(numUniProt + " UniProt " + idStr + " visible");
    };


    $("#dataAvailableSunburst").click(function() {
        var progress = new Progress($("#sunburstProgressLoader"));
        progress.start();
        $("#sunburstModal").modal();
        $("#sunburstChart").empty();
        var parms = {cid: that.network.Id, a: "tax", v: that.version};
        if (that.alignmentScore)
            parms.as = that.alignmentScore;
        $.ajax({
            dataType: "json",
            url: "getdata.php",
            data: parms,
            success: function(treeData) {
                if (typeof(treeData.valid) !== "undefined" && treeData.valid === "false") {
                    //TODO: handle error
                    alert(treeData.message);
                } else {
                    that.sbRootData = treeData;
                    that.sbCurrentData = treeData;
                    addCurViewNumSeq();
                    var sb = Sunburst()
                        .width(600)
                        .height(600)
                        .data(treeData)
                        .label("node")
                        .size("numSpecies")
                        .color(Colors)
                        .excludeRoot(true)
                        //.color((d, parent) => color(parent ? parent.data.name : null))
                        //.tooltipContent((d, node) => `Size: <i>${node.value}</i>`)
                        (document.getElementById("sunburstChart"));
                    sb.onClick(function(data) {
                        that.sbCurrentData = data;
                        addCurViewNumSeq();
                        sb.focusOnNode(data);
                    });
                    //setupSvgDownload();
                    progress.stop();
                }
            }
        });
    }).enableDataAvailableButton();

    this.sbDownloadFile = null;
    var makeTextFile = function(text) {
        var data = new Blob([text], {type: 'text/plain'});
    
        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (that.sbDownloadFile !== null) {
          window.URL.revokeObjectURL(that.sbDownloadFile);
        }
    
        that.sbDownloadFile = window.URL.createObjectURL(data);
    
        return that.sbDownloadFile;
    };

    var fixNodeName = function(str) {
        return str.replace(/[^a-z0-9]/gi, "_");
    };

    var getIdType = function() {
        return $("input[name='sunburstIdType']:checked").val();
    };


    if (this.uniref.getUniRefVersion() != 50) {
        $("#sunburstIdTypeUniRef50Container").hide();
    }

    $("#sunburstDlIds").click(function() {
        var idType = getIdType();
        var ids = getIdsFromTree(that.sbCurrentData, idType);
        var fname = that.network.Id + "_";
        if (that.alignmentScore)
            fname += "AS" + that.alignmentScore + "_";
        if (idType != "uniref")
            fname += idType + "_";
        fname += fixNodeName(that.sbCurrentData.node) + ".txt";
        var text = ids.join("\r\n");
        //$("#sbDownloadBtn").show();
        //$("#sunburstDownloadModal").show();
        $("#sbDownloadLink").attr("download", fname);
        $("#sbDownloadLink").attr("href", makeTextFile(text));
        $("#sbDownloadLink")[0].click();
        //$("#sbDownloadBtn").find("a").trigger("click"); //#sbDownloadLink
        //$("#sbDownloadBtn").trigger("click"); //#sbDownloadLink
        //$("#sbDownloadLink").click(function() {
        //    //$("#sunburstDownloadModal").modal();
        //    $("#sunburstDownloadModal").hide();
        //});
        //$("#sunburstDownloadModal").modal();
    });
    $("#sunburstDlFasta").click(function() {
        var idType = getIdType();
        var progress = new Progress($("#downloadProgressLoader"));
        progress.start();
        var ids = getIdsFromTree(that.sbCurrentData, idType);
        var form = $('<form method="POST" action="getfasta.php"></form>');
        var fc = $('<input name="c" type="hidden">').val(that.network.Id);
        form.append(fc);
        var fv = $('<input name="v" type="hidden">').val(that.version);
        form.append(fv);
        var fo = $('<input name="o" type="hidden">').val(fixNodeName(that.sbCurrentData.node));
        form.append(fo);
        var fids = $('<input name="ids" type="hidden">').val(JSON.stringify(ids));
        form.append(fids);
        if (that.alignmentScore) {
            var fas = $('<input name="as" type="hidden">').val(that.alignmentScore);
            form.append(fas);
        }
        var fidtype = $('<input name="it" type="hidden">').val(idType);
        form.append(fidtype);
        $("body").append(form);
        $("#sbDownloadBtn").hide();
        $("#sunburstDownloadModal").show();
        $("#sunburstDownloadModal h5").show();
        $("#sunburstDownloadModal").modal();
        form.submit();
        setTimeout(function() {
            $("#sunburstDownloadModal").modal("hide");
            progress.stop();
        }, 1000);


        //$.ajax({
        //    type: "POST",
        //    dataType: "json",
        //    url: "getfasta.php",
        //    data: parms,
        //    success: function(data) {
        //        $("#sunburstDownloadModal").modal("hide");
        //    }
        //});
        //$("#sbDownloadLink").attr("href", );
    });
}


function getIdsFromTree(data, idType) {
    var nextLevel = function(level) {
        var ids = [];
        // Bottom level
        if (typeof level.sequences !== "undefined") {
            for (var i = 0; i < level.sequences.length; i++) {
                var id = idType == "uniref50" ? level.sequences[i].sa50 : (idType == "uniref90" ? level.sequences[i].sa90 : level.sequences[i].seqAcc);
                //ids.push(level.sequences[i].seqAcc);
                ids.push(id);
            }
        } else {
            for (var i = 0; i < level.children.length; i++) {
                var nextIds = nextLevel(level.children[i]);
                for (var j = 0; j < nextIds.length; j++) {
                    ids.push(nextIds[j]);
                }
            }
        }
        return ids;
    };

    var ids = nextLevel(data);
    ids = Array.from(new Set(ids));
    return ids;
}

function triggerDownload (imgURI) {
  var evt = new MouseEvent('click', {
    view: window,
    bubbles: false,
    cancelable: true
  });

  var a = document.createElement('a');
  a.setAttribute('download', 'MY_COOL_IMAGE.png');
  a.setAttribute('href', imgURI);
  a.setAttribute('target', '_blank');

  a.dispatchEvent(evt);
}


