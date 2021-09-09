
function SearchResults(util, render, searchApp, doIdSearchNav) {
    this.util = util;
    this.searchApp = searchApp;
    this.render = render;
    this.doIdSearch = doIdSearchNav;
}




////////////////////////////////////////////////////////////////////////////////////////////////////
// SEARCH BY SEQUENCE

SearchResults.prototype.searchSeqFn = function(id = "") {
    var that = this;
    var seq = $("#searchSeq").val();
    var version = this.util.getVersion();
    var progress = new Progress($("#progressLoader"));
    progress.start();
    var parms = {t: "seq", v: version};
    if (typeof id !== "function")
        parms.id = id;
    else
        parms.query = seq;
    $.post(this.searchApp, parms, function(dataStr) {
        var data = JSON.parse(dataStr);
        if (data.status !== true) {
            $("#searchSeqErrorMsg").text(data.message).show();
        } else {

            $("#searchResults").empty();
            $("#searchResults").append('<div class="my-5 bigger">Query Sequence:<br><code>' + data.query.replaceAll('^', "<br>") + '</code></div>');


            if (data.matches.length > 0) {
                //$("#searchResults").append('<div class="mt-5"><h5>Non-diced Clusters</h5></div>');
                that.render.addClusterTableFn(data.matches, false, true);
            }

            $("#searchResults").append('<div class="my-5"></div>');

            if (data.diced_matches.length > 0) {
                $("#searchResults").append('<div class="mt-5"><h4>Diced Clusters</h4></div>');
                that.render.addClusterTableFn(data.diced_matches, true);
                sessionStorage.evalueData = JSON.stringify(data.diced_matches);
                sessionStorage.queryId = typeof data.queryId === "string" ? data.queryId : "";
            }
        }

        if (typeof id === "function")
            id(data.id);
        progress.stop();
    });
};




////////////////////////////////////////////////////////////////////////////////////////////////////
// SEARCH BY ID

SearchResults.prototype.searchIdFn = function(id = "") {
    var that = this;
    var idVal = $("#searchId").val();
    var version = this.util.getVersion();
    var parms = {t: "id", v: version};
    if (typeof id !== "function")
        parms.id = id;
    else
        parms.query = idVal;
    $.post(this.searchApp, parms, function(dataStr) {
        var data = JSON.parse(dataStr);
        if (data.status !== true) {
            $("#searchIdErrorMsg").text(data.message).show();
        } else {
            if (typeof data.cluster_data !== "undefined" && typeof data.cluster_data === "object") {
                $("#searchResults").empty();
                $("#searchResults").append('<div class="my-5 bigger">Query ID:<br><b>' + data.query + '</b></div>');
                that.render.addClusterTableFn(data.cluster_data, true, false, "searchResultsId");
                sessionStorage.idData = JSON.stringify(data.cluster_data);
                sessionStorage.queryId = data.query;
                if (typeof id === "function")
                    id(data.id);
            } else {
                window.location.href = that.util.getResultsUrl(data.cluster_id);
            }
        }
    });
};




////////////////////////////////////////////////////////////////////////////////////////////////////
// SEARCH BY TAX

SearchResults.prototype.getSearchTaxType = function() {
    return $("#searchTaxTypeGenus").prop("checked") ? "genus" : ($("#searchTaxTypeFamily").prop("checked") ? "family" : "species");
};


SearchResults.prototype.searchTaxFn = function(id = "") {
    var that = this;
    var termVal = $("#searchTaxTerm").val();
    var termType = this.getSearchTaxType();
    var version = this.util.getVersion();
    var progress = new Progress($("#progressLoader"));
    progress.start();
    var parms = {t: "tax", v: version};
    if (typeof id !== "function") {
        parms.id = id;
    } else {
        parms.query = termVal;
        parms.type = termType;
    }
    $.post(this.searchApp, parms, function(dataStr) {
        var data = JSON.parse(dataStr);

        if (data.status !== true) {
            $("#searchTaxTermErrorMsg").text(data.message).show();
        } else {
            $("#searchUi").hide();

            var processFn = function(matches, isDiced = false) {
                var hasDiced = false;
                var table = $('<table id="searchResultsTax" class="table table-sm w-100"></table>');
    		    table.append('<thead><tr><th>UniProt ID</th><th>Cluster</th><th>Organism</th><th>TrEMBL/SwissProt</th></thead>');
    		    //table.append('<thead><tr><th>UniProt ID</th><th>Cluster</th><th>Description</th><th>Organism</th><th>TrEMBL/SwissProt</th></thead>');
    		    //table.append('<thead><tr><th>UniProt ID</th><th>Cluster</th>' + (isDiced ? '<th>Alignment Score</th>' : '') + '<th>Description</th><th>Organism</th><th>TrEMBL/SwissProt</th></thead>');
		        var body = $('<tbody>');
        		table.append(body);
                for (var i = 0; i < matches.length; i++) {
                    var D = matches[i];
                    var netName = typeof D.name !== "undefined" ? D.name : D.cluster;
                    if (D.parent.toLowerCase().startsWith("mega"))
                        netName = "Mega" + netName;
                    var ascore = isDiced ? D.ascore : '';
                    var ascoreText = isDiced ? (' AS ' + D.ascore) : '';
                    var tr = $('<tr>');
                    tr.append('<td><a href="https://www.uniprot.org/uniprot/' + D.uniprot_id + '">' + D.uniprot_id + '</a></td>');
                    var alink = "";
                    if (typeof D.is_diced !== "undefined") {
                        hasDiced = true;
                        //alink = $('<a href="' + this.util.getResultsUrl(D.cluster, ascore) + '">' + netName + ascoreText + '</a>');
                        alink = $('<button class="btn btn-primary btn-sm" data-upid="' + D.uniprot_id + '">Search Diced ' + netName + '</button>');
                        alink.click(function(e) {
                            var upid = $(this).data("upid");
                            $("#searchId").val(upid);
                            setTimeout(() => that.searchIdFn(that.doIdSearch), 0);
                        });
                    } else {
                        alink = $('<a href="' + that.util.getResultsUrl(D.cluster, ascore) + '">' + netName + ascoreText + '</a>');
                    }
                    var td = $('<td></td>');
                    td.append(alink);
                    tr.append(td);
                    tr.append('<td>' + D.organism + '</td>');
                    tr.append('<td>' + D.status + '</td>');
                    body.append(tr);
                }
                $("#searchResults").append(table);
                return hasDiced;
            };

            var numSeq = data.matches.length;
            
            $("#searchResults").empty();
            $("#searchResults").append('<div class="my-5 bigger">Query:<br><b>' + data.query + '</b><br>Number of Sequences Found: ' + numSeq + '</div>');

            var hasDiced = processFn(data.matches);

            $("#searchResults").append('<div class="my-5"></div>');
            
            if (typeof data.diced_matches !== "undefined" && data.diced_matches.length > 0) {
                $("#searchResults").append('<div class="mt-5"><h4>Diced Clusters</h4></div>');
                processFn(data.diced_matches);
            }

            $("#searchResultsContainer").show();
            
            //if (typeof id === "function" && !hasDiced)
            if (typeof id === "function")
                id(data.id);

            progress.stop();
        }
    });
};



