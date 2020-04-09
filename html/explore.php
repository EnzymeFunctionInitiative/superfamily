<?php require_once 'includes/header.inc.php'; ?>

    <main role="main">
        <div class="container">
            <nav aria-label="breadcrumb" id="exploreBreadcrumb" style="display: none;">
            </nav>
            <div class="container">
                <h1 class="text-center" id="familyTitle"></h1>
                <div>
                    <div id="clusterNums" class="w-100 container-cluster-num"></div>
                    <div>
                        <div class="border border-dark rounded p-2 mb-2 float-right w-100">
                            <img src="img/blank.png" class="img-fluid" id="clusterImg" />
                        </div>
                    </div>
                    <div style="clear:both"></div>
                    <div>
                        <div class="float-right"><i class="fas fa-download download-btn" data-toggle="tooltip" title="Download high-resolution" id="downloadClusterImage"></i></div>
                        <div class="data-available float-left" id="dataAvailable" style="display: none">
                            <button class="btn btn-outline-secondary disabled" type="button" id="dataAvailableSp">Swiss-Prot</button>
                            <button class="btn btn-outline-secondary disabled" type="button" id="dataAvailableKegg">KEGG</button>
                            <button class="btn btn-outline-secondary disabled" type="button" id="dataAvailablePdb">PDB</button>
                            <button class="btn btn-outline-secondary disabled" type="button" id="dataAvailableTigr">TIGR</button>
                            <button class="btn btn-outline-secondary disabled" type="button" id="dataAvailablePubs">Pubs</button>
                            <button class="btn btn-outline-secondary disabled" type="button" id="dataAvailableAnno">Anno</button>
                        </div>
                        <div style="clear:both"></div>
                        <div id="clusterSizeContainer" style="display: none">
                            <div id="clusterSize">Number of IDs: </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="alert alert-danger" role="alert" id="loadError" style="display: none"></div>
            <p class="text-center" id="clusterDesc">
            </p>

            <div id="subgroupTable" style="display: none">
            </div>
            <div id="displayFeatures" style="display: none">
                <div id="summaryInfoContainer">
                    <!--<div id="derivationContainerBottom">
                        <b>DERIVATION:</b> IPR007197+IPR006638 // AS##,
                        edge-edited<span data-toggle="tooltip" title="Edge editing is done to ensure that clusters with very low connectivity to other parts of the network are isolated." style="font-size: 0.8em;"><sup><i class="fas fa-question-circle"></i></sup></span>
                        and isolated // AS##,
                        edge-edited<span data-toggle="tooltip" title="Edge editing is done to ensure that clusters with very low connectivity to other parts of the network are isolated." style="font-size: 0.8em;"><sup><i class="fas fa-question-circle"></i></sup></span>
                        and isolated // HMM developed from isofunctional cluster
                    </div>-->
                    <!--
                    <div id="spFunctionContainer" style="display: none">
                        <h3>Swiss-Prot Functions</h3>
                        <div id="spFunctions"></div>
                    </div>
                    -->
                </div>
                <h3 class="explore-heading">Length Histograms and WebLogo</h3>
                <div class="row">
                    <div id="lengthHistogramContainer" class="col" style="display: none">
                        <h5>Length Histogram for All Sequences (UniProt IDs)</h5>
                        <div id="fullLengthHistogram"></div>
                        <div class="float-right"><i class="fas fa-download download-btn" data-toggle="tooltip" title="Download high-resolution" id="downloadFullLenHistoImage"></i></div>
                        <div style="clear: both"></div>
                        <h5>Length-Filtered Histogram for Node Sequences (UniRef50 IDs) &mdash; Used for MSA, WebLogo, and HMM</h5>
                        <div id="filteredLengthHistogram"></div>
                        <div class="float-right"><i class="fas fa-download download-btn" data-toggle="tooltip" title="Download high-resolution" id="downloadFiltLenHistoImage"></i></div>
                        <div style="clear: both"></div>
                    </div>
                    <div id="weblogoContainer" class="col" style="display: none">
                        <h5>WebLogo</h5>
                        <div id="weblogo"></div>
                        <div class="float-right"><i class="fas fa-download download-btn" data-toggle="tooltip" title="Download high-resolution" id="downloadWeblogoImage"></i></div>
                    </div>
                </div>
            </div>

            <div id="downloadContainer" style="display: none">
                <h3 class="explore-heading">Downloads</h3>
                <div id="downloads"></div>
            </div>

            <div id="metadataContainer" style="display: none">
                <div id="otherAnnoContainer">
                    <h3>Public Annotation Databases</h3>
                </div>

                <div id="commAnno">
                    <h3>Community Annotations</h3>
                    <div id="noCommAnno">
                        <p>
                        No community annotations are available for this cluster.  
                        </p>
                        <p>
                        We are accepting <a href="submit.html" id="submitAnnoLink">submissions for community-driven annotations</a>.
                        </p>
                    </div>
                    <div id="commAnnoTable"></div>
                </div>

                <div id="publicationsContainer">
                    <h3>Publications</h3>
                    <div id="publications">
                        No publications are available for this cluster.  Please contact us to contribute a
                        citation to this page.
                    </div>
                </div>

                <div id="familyListContainer">
                    <div id="tigrfamContainer">
                        <h3>TIGR Families</h3>
                        <div id="tigrFams"></div>
                    </div>
                </div>
            </div>
        </div> <!-- /container -->

    </main>

    <footer class="container">
        <hr class="w-25" />
        <div class="text-center">
            radicalSAM.org <span class="pl-4"></span> Gerlt, Mitchell, Firouzbakht, and Oberg, 2020 <span class="pl-4"></span> <a href="https://efi.igb.illinois.edu">EFI</a> at <a href="https://igb.illinois.edu">Institute for Genomic Biology, University of Illinois</a>
        </div>
    </footer>
    <script src="js/jquery-3.4.1.min.js" crossorigin="anonymous"></script>
    <script src="js/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    <!--<script src="data/data.js?v=15"></script>-->
    <script src="js/network.js?v=1"></script>
    <script src="js/app.js?v=16"></script>
    <script src="js/imageMapResizer.min.js"></script>
    <script src="js/jquery.maphilight.min.js"></script>
    <script>
        $(document).ready(function () {
            var requestId = getPageClusterId();
            if (!requestId) {
                requestId = "fullnetwork";
            }
            var app = new App();
            $.get("getdata.php", {a: "cluster", cid: requestId}, function (dataStr) {
                var data = parseNetworkJson(dataStr);
                if (data !== false) {
                    if (data.valid) {
                        var network = new Network(requestId, data);
                        app.init(network);
                    } else {
                        app.responseError(data.message);
                    }
                } else {
                    app.invalidNetworkJsonError(dataStr);
                }
            });
            $('[data-toggle="tooltip"]').tooltip();
        });
    </script>
    <div id="keggIdModal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">KEGG IDs in Cluster</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="modal-body">
                    <div id="keggIdList" class="modal-colwrap-3">
                    </div>
                    <textarea id="keggIdListClip" style="display: none"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default copy-btn" data-clipboard-target="keggIdListClip" data-id="keggIdListClip"><i class="far fa-copy"></i></button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <div id="spModal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">SwissProt Functions in Cluster</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="modal-body">
                    <p>Click the SwissProt function to see associated UniProt IDs.</p>
                    <div id="spFunctions">
                    </div>
                    <textarea id="spModalIdListClip" style="display: none"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default copy-btn" data-id="spModalIdListClip"><i class="far fa-copy"></i></button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <div id="pdbModal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">PDB Entries in Cluster</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="modal-body">
                    <div id="pdbIdList">
                    </div>
                    <textarea id="pdbIdListClip" style="display: none"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default copy-btn" data-id="pdbIdListClip"><i class="far fa-copy"></i></button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <div id="progressLoader" class="" style="display: none">
        <i class="fas fa-spinner fa-spin"></i>
    </div>
</body>
</html>
