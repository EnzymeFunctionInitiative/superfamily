﻿<?php require_once 'includes/header.inc.php'; ?>

    <main role="main">
        <div class="container">
            <h1 class="text-center" id="submitPageTitle">Community Annotation Submission</h1>
        </div>

        <div class="container">
            <p>
            We encourage user-submitted annotations for cluster or individual sequence. Upon review and
            approval, these annotation will be included on results pages for individual clusters.
            </p>
            <div class="mt-5">
                <form class="needs-validation" action="submit_result.php" method="POST" novalidate>
                    <div class="w-auto mt-5">
                        <div class="form-group w-50">
                            <label for="inputName">Your name</label>
                            <input type="text" class="form-control" id="inputName" name="inputName" placeholder="Enter name" required>
                            <div class="valid-feedback">Looks good!</div>
                        </div>
                        <div class="form-group w-50">
                            <label for="inputEmail">Your email</label>
                            <input type="email" class="form-control" id="inputEmail" name="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" required>
                            <small id="emailHelp" class="form-text text-muted">Your email address will never be shared.</small>
                            <div class="valid-feedback">Looks good!</div>
                        </div>
                        <div class="form-group w-50">
                            <label for="inputClusterId">Cluster ID</label>
                            <input type="input" class="form-control" id="inputClusterId" name="inputClusterId" aria-describedby="clusterHelp" placeholder="Enter cluster ID">
                            <small id="clusterHelp" class="form-text text-muted">If you don't know this, then please provide details below.</small>
                        </div>
                        <div class="form-group required w-50">
                            <label for="inputFunction">Function/Annotation</label>
                            <textarea class="form-control" id="inputFunction" name="inputFunction" rows="5" aria-describedby="functionHelp" placeholder="" required></textarea>
                            <small id="functionHelp" class="form-text text-muted">Provide the protein function that is associated with the described function.</small>
                            <div class="invalid-feedback">This field is mandatory.</div>
                        </div>
                        <div class="form-group w-50">
                            <label for="inputAccession">Accession ID</label>
                            <input type="input" class="form-control" id="inputAccession" name="inputAccession" aria-describedby="accessionHelp" placeholder="Enter UniProt/NCBI accession ID">
                            <small id="accessionHelp" class="form-text text-muted">Enter the UniProt (preferred) or NCBI accession ID that is associated with your submission.  If this is unknown, please provide details below.</small>
                        </div>
                        <div class="form-group required">
                            <label for="inputSequence">Sequence</label>
                            <textarea class="form-control" id="inputSequence" name="inputSequence" rows="5" aria-describedby="sequenceHelp" placeholder="" required></textarea>
                            <small id="sequenceHelp" class="form-text text-muted">Provide the protein sequence that is associated with the described function.</small>
                            <div class="invalid-feedback">This field is mandatory.</div>
                        </div>
                        <div class="form-group">
                            <label for="inputDoi">Publication DOI</label>
                            <input type="input" class="form-control" id="inputDoi" name="inputDoi" aria-describedby="doiHelp" placeholder="Enter DOI/publication identifier">
                            <small id="doiHelp" class="form-text text-muted">If the publicaiton DOI is not available, provide a link to the publication, or provide details below.</small>
                        </div>
                        <div class="form-group">
                            <label for="inputDetails">Details</label>
                            <textarea class="form-control" id="inputDetails" name="inputDetails" rows="5" aria-describedby="detailsHelp" placeholder="" required></textarea>
                            <small id="detailsHelp" class="form-text text-muted">Provide additional details regarding the sequence, cluster, publication, annotation, or other information.</small>
                            <div class="invalid-feedback">This field is mandatory.</div>
                        </div>
                        <div class="form-group required">
                            <div>
                                <button type="button" id="tosBtn" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#tosDlg">Read Terms of Service and Disclaimer</button>
                            </div>
                            <input type="checkbox" id="inputTos" name="inputTos" value="1" required>
                            <label for="inputTos">I have read and agree to the terms of service.</label>
                            <div class="invalid-feedback">This field is mandatory.</div>
                        </div>
                        <div class="form-group mt-3">
                            <div id="errorMsg" style="display: none"></div>
                            <button type="submit" class="btn btn-primary">Submit Annotation</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </main>

    <script>
        $(document).ready(function () {
                $("#tosAccept").click(function(e) {
                    $("#inputTos").prop("checked", true);
                    $("#tosBtn").removeClass("btn-primary").addClass("btn-secondary");
                });
        });
    </script>


    <div class="modal fade" id="tosDlg" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Terms of Service and Disclaimer</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    Terms of Service.<br>
                    Disclaimer.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="tosAccept" data-dismiss="modal">Accept</button>
                </div>
            </div>
        </div>
    </div>

<?php require_once 'includes/footer.inc.php'; ?>
