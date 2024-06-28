

function AppDataFeatures(appData, appMeta, url, progress) {
    this.appData = appData;
    this.appMeta = appMeta;
    this.url = url;
    this.progress = progress;
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// FAMILY/ANNOTATION ELEMENTS
//
AppDataFeatures.prototype.addTigrFamilies  = function () {
    var tigr = this.appData.getTigr();
    if (tigr.length == 0)
        return;
    var table = $('<table class="table table-sm w-100"></table>');
    var head = $('<thead><tr><th>TIGR ID</th><th>TIGR Description</th></tr></thead>');
    var body = $('<tbody></tbody>');
    var text = "";
    for (var i = 0; i < tigr.length; i++) {
        body.append('<tr><td>' + tigr[i][0] + '</td><td>' + tigr[i][1] + '</td></tr>');
        text += tigr[i][0] + "\t" + tigr[i][1] + "\n";
    }
    table.append(head).append(body);
    if (tigr.length > 0) {
        $("#tigrList").append(table);
        $("#dataAvailableTigr").click(function () {
            $("#tigrListModal").modal();
        });
        $("#dataAvailableTigr").enableDataAvailableButton();
    }
}
AppDataFeatures.prototype.checkForKegg = function () {
    if (!this.appData.hasKeggIds())
        return false;
    var that = this;
    //$("#keggList").append("<div>This cluster contains " + parseInt(this.appData.getKeggCount()).toLocaleString() + " KEGG-annotated sequences.</div>");
    $("#dataAvailableKegg").click(function () {
        that.progress.start();
        that.appData.getKeggIds(that.appMeta.Version, function (id) {
            $("#keggIdList").append('<a href="https://www.genome.jp/dbget-bin/www_bget?' + id + '">' + id + '</a><br>');
            $("#keggIdListClip").append(id + "\n");
        }, function () {
            that.progress.stop();
            $("#keggIdModal").modal();
        });
    });
    $("#otherAnnoContainer").show();
    $("#dataAvailableKegg").enableDataAvailableButton();
    return true;
}
AppDataFeatures.prototype.checkForAlphafoldIds = function () {
    if (!this.appData.hasAlphafoldIds())
        return false;
    var that = this;
    $("#dataAvailableAlphafold").click(function () {
        that.progress.start();
        that.appData.getAlphafoldIds(that.appMeta.Version, function (data) {
            that.addAlphafoldIds(data);
        }, function () {
            that.progress.stop();
            $("#alphafoldModal").modal();
            $("#dataAvailableAlphafold").click(function() { $("#alphafoldModal").modal(); }).enableDataAvailableButton();
        });
    });
    $("#otherAnnoContainer").show();
    $("#dataAvailableAlphafold").enableDataAvailableButton();
    return true;
}
AppDataFeatures.prototype.addAlphafoldIds = function (af) {
    if (af.length == 0)
        return false;
    //var table = $('<table class="table table-sm w-auto"></table>');
    //table.append('<thead><tr><th>UniProt ID</th><th>Alphafold ID</th></thead>');
    //var body = $('<tbody></tbody>');
    //table.append(body);
    //$("#alphafoldIdList").append(table);
    for (var i = 0; i < af.length; i++) {
        var id = af[i];
        //var row = $("<tr></tr>");
        var link = '<a href="https://alphafold.ebi.ac.uk/search/text/' + id + '" target="_blank">' + id + '</a><br>';
        $("#alphafoldIdList").append(link);
        //row.append("<td>" + link + "</td>");
        //row.append("<td>" + '<a href="' + dois[j] + '" target="_blank">' + dois[j] + '</a></td>');
        //$("#alphafoldIdList").append(uniprotId + ' <a href="' + dois[j] + '">' + dois[j] + '</a><br>');
        //body.append(row);
        //$("#alphafoldIdListClip").append(uniprotId + "\t" + dois[j] + "\n");
        $("#alphafoldIdListClip").append(id + "\n");
    }
    return true;
}
AppDataFeatures.prototype.addSwissProtFunctions = function () {
    var list = this.appData.getSwissProtFunctions();
    if (list === false || list.length == 0)
        return false;

    var ecodes = this.appData.getEnzymeCodes();
    var ecFn = function(code) {
        var codeDesc = "";
        if (code) {
            codeDesc = ecodes[code];
            var linkCode = '<a href="https://enzyme.expasy.org/EC/' + code + '">' + code + '</a>';
            if (typeof codeDesc !== "undefined")
                codeDesc = '<span data-toggle="tooltip" title="' + codeDesc + '">' + linkCode + '</span>';
            else
                codeDesc = linkCode;
            //desc += " (" + codeDesc + ")";
        }
        return codeDesc;
    };
    var clipFn = function (desc, spItemIds) {
        $('#spModalIdListClip').append(desc + "\n" + spItemIds);
    };
    
    var ul = addSwissProtList(list, ecFn, clipFn);

    $("#spFunctions").append(ul);
    $("#spFunctions ul li span").css({ "font-style": "italic" });
    $("#dataAvailableSp").click(function() { $("#spModal").modal(); }).enableDataAvailableButton();
    return true;
}
AppDataFeatures.prototype.addPdb = function () {
    var pdb = this.appData.getPdb();
    if (pdb.length == 0)
        return false;
    for (var i = 0; i < pdb.length; i++) {
        var ids = pdb[i][0].split(',');
        for (var j = 0; j < ids.length; j++) {
            var id = ids[j];
            $("#pdbIdList").append('<a href="https://www.rcsb.org/structure/' + id + '">' + id + '</a> (' + pdb[i][1] +  ')<br>');
            $("#pdbIdListClip").append(id + "\t" + pdb[i][1] + "\n");
        }
    }
    $("#pdbIdModal").modal();
    $("#dataAvailablePdb").click(function() { $("#pdbModal").modal(); }).enableDataAvailableButton();
    return true;
}
AppDataFeatures.prototype.addAnno = function () {
    var anno = this.appData.getAnno();
    if (anno.length == 0)
        return false;
    var table = $('<table class="table table-sm w-auto"></table>');
    table.append('<thead><tr><th>UniProt ID</th><th>DOI</th></thead>');
    var body = $('<tbody></tbody>');
    table.append(body);
    $("#annoIdList").append(table);
    for (var i = 0; i < anno.length; i++) {
        var uniprotId = anno[i][0];
        var dois = anno[i][1];
        for (var j = 0; j < dois.length; j++) {
            var row = $("<tr></tr>");
            var link = '<a href="https://www.uniprot.org/uniprot/' + uniprotId + '" target="_blank">' + uniprotId + '</a>';
            row.append("<td>" + link + "</td>");
            row.append("<td>" + '<a href="' + dois[j] + '" target="_blank">' + dois[j] + '</a></td>');
            //$("#annoIdList").append(uniprotId + ' <a href="' + dois[j] + '">' + dois[j] + '</a><br>');
            body.append(row);
            $("#annoIdListClip").append(uniprotId + "\t" + dois[j] + "\n");
        }
    }
    $("#annoIdModal").modal();
    $("#dataAvailableAnno").click(function() { $("#annoModal").modal(); }).enableDataAvailableButton();
    return true;
}
AppDataFeatures.prototype.addGndFeature = function() {
    var feat = this.appData.getDisplayFeatures();
    if (!feat.hasOwnProperty("gnd") || this.appData.getChildren().length > 0)
        return false;

    var that = this.appMeta;
    $("#dataAvailableGnd").click(function() {
        var gndParms = 'rs-id=' + that.Id;
        if (that.Ascore)
            gndParms += ":" + that.Ascore;
        if (that.Version)
            gndParms += '&rs-ver=rsam-' + that.Version;
        if (that.GndKey)
            gndParms += '&key=' + that.GndKey;
        //TODO: get the URL from a config var or something
        window.open('https://efi.igb.illinois.edu/dev/efi-gnt/view_diagrams.php?' + gndParms);
    }).enableDataAvailableButton();
    return true;
}

AppDataFeatures.prototype.addClusterSize = function (divId) {
    var size = this.appData.getSize();
    if (size === false)
        return false;
    $("#"+divId).append('UniProt: <b>' + commify(size.uniprot) + '</b>, UniRef90: <b>' + commify(size.uniref90) + '</b>');
    if (size.uniref50 > 0)
        $("#"+divId).append(', UniRef50: <b>' + commify(size.uniref50) + '</b>');
    $("#clusterSizeContainer").show();
    return true;
}
AppDataFeatures.prototype.addConvRatio = function () {
    var cr = this.appData.getConvRatio();
    if (typeof cr.conv_ratio === "undefined" || cr === false || cr.conv_ratio == 0)
        return false;
    $("#convRatio").text(cr.conv_ratio);
    $("#ssnConvRatio").text(cr.ssn_conv_ratio);
    $("#convRatioContainer").show();
    $("#clusterSizeContainer").show();
    return true;
}
AppDataFeatures.prototype.addConsRes = function () {
    var cs = this.appData.getConsensusResidues();
    if (typeof cs === "undefined" || cs === false)
        return false;
    var consResContents = "";
    var showConsRes = false;
    if (Array.isArray(cs)) {
        var consResContents = $('<div class="float-left"></div>');
        for (var i = 0; i < cs.length; i++) {
            //if (str)
            //    str += ", ";
            //str += '<b>' + cs[i].num_res + "</b><br><sup>" + cs[i].percent + "%</sup>";
            var div = '<div class="float-left ml-3 text-center"><b>' + cs[i].num_res + '</b><br><sup>' + cs[i].percent + '%</sup></div>';
            consResContents.append(div);
        }
        showConsRes = cs.length > 0;
    } else {
        consResContents = '<b>' + cs.num_res + '</b>' + ' (70%)';
        showConsRes = true;
    }
    $("#consensusResidue").append(consResContents);
    if (showConsRes) {
        $("#consensusResidueContainer").show();
        return true;
    }
    return false;
}



////////////////////////////////////////////////////////////////////////////////////////////////////
// UI ELEMENTS (DOWNLOAD, DISPLAY)
//
AppDataFeatures.prototype.addDisplayFeatures = function () {
    var feat = this.appData.getDisplayFeatures();
    var that = this;
    var hasData = Object.keys(feat).length > 0;

    if (feat.hasOwnProperty("weblogo")) {
        var img = $('<img src="' + this.appMeta.DataDir + '/weblogo.png" alt="WebLogo for ' + this.appMeta.Id + '" class="display-img-width">');
        $("#weblogo").append(img);
        $("#downloadWeblogoImage").click(function (e) { e.preventDefault(); window.location.href = that.url.getDownloadUrl("weblogo"); });
        $("#weblogoContainer").show();
    }
    if (feat.hasOwnProperty("length_histogram")) {
        //TODO: uniref50/90
        var addHistFn = function(fileName, dlType, seqText) {
            var mainDiv = $("<div></div>");

            mainDiv.append('<h5>Length Histogram for ' + seqText + '</h5>');
            // First download
            dlBtn = $('<i class="fas fa-download"></i>');
            dlDiv = $('<div class="float-right download-btn" data-toggle="tooltip" title="Download high-resolution">PNG </div>').append(dlBtn);
            dlDiv.click(function (e) { e.preventDefault(); window.location.href = that.url.getDownloadUrl(dlType); });
            mainDiv.append(dlDiv);
            mainDiv.append('<div style="clear: both"></div>');

            // Then image
            mainDiv.append('<div></div>')
                .append('<img src="' + that.appMeta.DataDir + '/length_histogram' + fileName + '_lg.png" alt="Length histogram for ' + that.appMeta.Id + '" class="display-img-width">');

            return mainDiv;
        }

        for (var i = 0; i < feat.length_histogram.length; i++) {
            var theDiv;
            if (feat.length_histogram[i] == "uniprot")
                theDiv = addHistFn("_uniprot", "hist", "All Sequences");
            else if (feat.length_histogram[i] == "uniprot_leg")
                theDiv = addHistFn("", "hist", "All Sequences");
            else if (feat.length_histogram[i] == "uniref50")
                theDiv = addHistFn("_uniref50", "hist", "Node Sequences (UniRef50) &mdash; Used for MSA, WebLogo, and HMM");
            else if (feat.length_histogram[i] == "uniref90")
                theDiv = addHistFn("_uniref90", "hist", "Node Sequences (UniRef90) &mdash; Used for MSA, WebLogo, and HMM");
            $("#lengthHistogramContainer").append(theDiv);
        }
    
        $("#lengthHistogramContainer").show();
    }

    return hasData;
}
AppDataFeatures.prototype.addDownloadFeatures = function (containerId, hideTabStuff = false) {
    var feat = this.appData.getDownloadFeatures();
    if (feat.length == 0)
        return false;

    var isDiced = this.appData.getIsDiced();

    var table = $('<table class="table table-sm text-center w-auto"></table>');
    table.append('<thead><tr><th>Download</th><th>File Type</th></thead>');//<th>Size</th></thead>');
    var body = $('<tbody>');
    table.append(body);

    if (feat.hasOwnProperty("ssn")) {
        body.append('<tr><td>' + this.getDownloadButton("ssn") + '</td><td>Sequence Similarity Network' + "" + '</td></tr>');//<td>' + this.getDownloadSize(feat[i]) + '</td></tr>');
    }
    if (feat.hasOwnProperty("weblogo") && !hideTabStuff) {
        body.append('<tr><td>' + this.getDownloadButton("weblogo") + '</td><td>WebLogo for Node Sequences</td></tr>');//<td>' + this.getDownloadSize(feat[i]) + '</td></tr>');
    }
    if (feat.hasOwnProperty("msa") && !hideTabStuff) {
        body.append('<tr><td>' + this.getDownloadButton("msa") + '</td><td>MSA for Node Sequences</td></tr>');//<td>' + this.getDownloadSize(feat[i]) + '</td></tr>');
    }
    if (feat.hasOwnProperty("hmm") && !hideTabStuff) {
        body.append('<tr><td>' + this.getDownloadButton("hmm") + '</td><td>HMM for Node Sequences</td></tr>');//<td>' + this.getDownloadSize(feat[i]) + '</td></tr>');
        if (!hideTabStuff) {
            var logoParms = "";
            var logoParms = 'cid=' + this.appMeta.Id;
            if (this.appMeta.Ascore)
                logoParms += '&as=' + this.appMeta.Ascore;
            if (this.appMeta.Version)
                logoParms += '&v=' + this.appMeta.Version;
            var logoBtn = '<button class="btn btn-primary btn-sm hmm-logo" data-logo="' + logoParms + '">View HMM</button>';
            body.append('<tr><td>' + logoBtn + '</td><td>View HMM in SkyLign</td><td></td></tr>');
        }
    }
    if (feat.hasOwnProperty("gnd") && !hideTabStuff) {
        var gndParms = 'rs-id=' + this.appMeta.Id;
        if (this.appMeta.Ascore)
            gndParms += ":" + this.appMeta.Ascore;
        if (false) // check if this is a parent and provide the child ID here
            gndParms += ":" + this.appMeta.Id;
        if (this.appMeta.Version)
            gndParms += '&rs-ver=' + this.appMeta.VersionName + '-' + this.appMeta.Version;
        gndParms += "&key=" + this.appMeta.GndKey;
        var viewBtn = '<a href="https://efi.igb.illinois.edu/dev/efi-gnt/view_diagrams.php?' + gndParms + '" target="_blank"><button class="btn btn-primary btn-sm">View GNDs</button></a>';
        body.append('<tr><td>' + viewBtn + '</td><td>View Genome Neighborhood Diagrams</td><td></td></tr>');
    }
    if (feat.hasOwnProperty("id_fasta")) {
        table.append('<tbody><tr><td colspan="3"><b>ID Lists and FASTA Files</b></td></tr></tbody>');
        body = $('<tbody>');
        table.append(body);

        var that = this;
        var addRowFn = function(key, desc) {
            body.append('<tr><td>' + that.getDownloadButton(key) + '</td><td>' + desc + '</td></tr>');
        };

        var types = feat.id_fasta;
        if (types.hasOwnProperty("uniprot"))
            addRowFn("uniprot_id", "UniProt ID List");
        if (types.hasOwnProperty("uniref90"))
            addRowFn("uniref90_id", "UniRef90 ID list");
        if (types.hasOwnProperty("uniref50"))
            addRowFn("uniref50_id", "UniRef50 ID list");
        if (types.hasOwnProperty("uniprot"))
            addRowFn("uniprot_fasta", "UniProt FASTA file");
        if (types.hasOwnProperty("uniref90"))
            addRowFn("uniref90_fasta", "UniRef90 FASTA file");
        if (types.hasOwnProperty("uniref50"))
            addRowFn("uniref50_fasta", "UniRef50 FASTA file");
    }
    if (feat.hasOwnProperty("misc")) {
        var t = [
            //{ "key": "cluster_size", "desc": "Cluster sizes" },
            { "key": "swissprot.txt", "desc": "SwissProt annotations within cluster" },
            //{ "key": "sp_singletons", "desc": "SwissProt annotations by singletons" }
        ];

        table.append('<tbody><tr><td colspan="3"><b>Miscellaneous Files</b></td></tr></tbody>');
        body = $('<tbody>');
        table.append(body);

        for (var k = 0; k < t.length; k++) {
            body.append('<tr><td>' + this.getDownloadButton(t[k].key) + '</td><td>' + t[k].desc + '</td></tr>');//<td>' + this.getDownloadSize(t[k].key) + '</td></tr>');
        }
    }
    if (feat.hasOwnProperty("cons_res")) {
        table.append('<tbody><tr><td colspan="3"><b>Consensus Residues</b></td></tr></tbody>');
        body = $('<tbody>');
        var consResTypes = this.appData.getConsensusResiduesFiles();
        for (var ri = 0; ri < consResTypes.length; ri++) {
            var consRes = consResTypes[ri];
            var res = consRes.toLowerCase();
            body.append('<tr><td>' + this.getDownloadButton("crpo"+res) + '</td><td>Consensus residue percentage summary table (' + consRes + ')</td></tr>');
            table.append(body);
        }
    }

    $("#"+containerId).append(table);
    return true;
}

AppDataFeatures.prototype.getDownloadButton = function (fileType) {
    return '<a href="' + this.url.getDownloadUrl(fileType) + '"><button class="btn btn-primary btn-sm">Download</button></a>';
}


