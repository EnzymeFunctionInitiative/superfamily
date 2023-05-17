

function SearchRender(util) {
    this.util = util;
}


SearchRender.prototype.addResultsHeader = function(table, showClusterHeader, hasEvalue) {
    var thead = $('<thead></thead>');
    table.append(thead);
    var headrow = $('<tr></tr>');
    thead.append(headrow);
    headrow.append('<th>' + (showClusterHeader ? 'Cluster' : '') + '</th>');
    if (hasEvalue)
        headrow.append('<th>E-Value</th>');
    headrow.append('<th class="text-right"># of UniProt IDs</th>');
    headrow.append('<th class="text-right"># of UniRef90 IDs</th>');
    var crcell = $('<th class="text-right">UniProt ID CR </th>');
    headrow.append(crcell);
    var ttText = 'The CR is the ratio of the number of sequence pairs with edge alignment score values (derived from BLAST e-values/bit scores) &ge; the minimum alignment score threshold used to generate the SSN to the total number of sequence pairs.';
    var po = $('<a href="index.php?#explore_conv" target="_blank" data-toggle="tooltip" title="' + ttText + '"><i class="fas fa-question-circle"></i></a>').tooltip();
    crcell.append(po);
}


SearchRender.prototype.addClusterTableFn = function(data, multiBody = false, showClusterHeader = false, extraId = "") {
    var hasEvalue = (data.length > 0 && data[0].clusters.length > 0 && typeof data[0].clusters[0].evalue !== "undefined");
    var extraId = extraId ? 'id="'+extraId+'"' : "";

    var table = $('<table '+extraId+' class="table table-sm w-75"></table>');
    this.addResultsHeader(table, showClusterHeader, hasEvalue);

    for (var i = 0; i < data.length; i++) {
        var DD = data[i];
        var cellStyle = i ? 'pt-5' : '';
        var numCols = hasEvalue ? 5 : 4;
        var parentNetName = DD.parent;
        var ascore = DD.ascore;
        var body = $('<tbody></tbody>');
        if (multiBody)
            body.append('<tr><td class="' + cellStyle + ' pb-0" colspan="' + numCols + '"><h5><b>' + parentNetName + ' AS ' + ascore + '</b></h5></td></tr>');

        for (var ri = 0; ri < DD.clusters.length; ri++) {
            var row = this.addClusterRow(DD.clusters[ri], hasEvalue, ascore);
            body.append(row);
        }
	    table.append(body);
    }
    $("#searchResults").append(table);
    $("#searchResultsContainer").show();
    $("#searchUi").hide();
};


SearchRender.prototype.addClusterRow = function(D, hasEvalue, ascore) {
    var clusterId = D.cluster;
    var numUniProt = D.num_up;
    var numUniRef90 = D.num_ur;
    var convRatio = D.cr;
    var netName = typeof D.name !== "undefined" ? D.name : clusterId;
    //if (parentNetName.toLowerCase().startsWith("mega"))
    //    netName = "Mega" + netName;

    var row = $('<tr></tr>');
    row.append('<td><a href="' + this.util.getResultsUrl(clusterId, ascore) + '">' + netName + '</a></td>');
    if (hasEvalue)
        row.append('<td>' + D.evalue + '</td>');
    row.append('<td class="text-right">' + numUniProt + '</td>');
    row.append('<td class="text-right">' + numUniRef90 + '</td>');
    row.append('<td class="text-right">' + convRatio + '</td>');
    //var cell = $('<td class="text-right" style="color: #' + getColor(convRatio) + '"></td>');
    //cell.append(convRatio > 0.7 ? ('<b>' + convRatio + '</b>') : convRatio);
    //row.append(cell);

    return row;
}


