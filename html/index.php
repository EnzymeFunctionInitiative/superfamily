<?php require_once 'includes/header.inc.php'; ?>

	<main role="main">

		<!-- Main jumbotron for a primary marketing message or call to action -->
		<!--<div class="jumbotron">-->
			<div class="container">
				<h1 class="display-5 text-center">Exploring the Radical SAM Enzyme Superfamily</h1>
				<!--<p>This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique.</p>-->
				<!--<p><a class="btn btn-primary btn-lg" href="#" role="button">Learn more &raquo;</a></p>-->
			</div>
		<!--</div>-->

		<div class="container">
			<p>
				The members of the radical SAM superfamily contain a Fe<sub>4</sub>S<sub>4</sub> cluster that binds S-adenosyl methionine (SAM);
				one-electron reduction of the bound SAM yields a 5&prime;-deoxyadenosyl radical (5&prime;-dAdo&bull;) and Met.
				The 5&prime;-dAdo&bull; generates a substrate radical (R&bull;) (and 5&prime;-deoxyadenosine) that undergoes intriguing and often
				complex chemistry to yield the product.  The radical SAM superfamily has attracted the attention of the
				mechanistic enzymology/bioinorganic chemistry communities.
			</p>

			<p>
				<img src="img/intro/reaction.png" class="w-100" alt="Illustration of the chemical reaction that generates a substrate radical R&bull; and 5&prime;-deoxyadenosine."/>
			</p>

			<p>
				The Structure-Function Linkage Database (SFLD; <a href="http://sfld.rbvi.ucsf.edu/archive/django/index.html">http://sfld.rbvi.ucsf.edu/archive/django/index.html</a>) used sequence similarity
				networks (SSNs) to segregate the superfamily into 20 subgroups with characterized functions and 22 without characterized functions,
				with the goal of making the superfamily accessible to the community.  That curation effort was described in Methods in Enzymology
				Volume 606 in 2018:  <i>Atlas of the Radical SAM Superfamily:  Divergent Evolution of Function Using an
				"Plug and Play" Domain</i>, G.L. Holliday, E. Akiva, E.C. Meng, S.D. Brown, S. Calhoun, U. Pieper, A. Sali, S.J. Booker and P.C. Babbitt
				(doi: <a href="https://dx.doi.org/10.1016/bs.mie.2018.06.004">10.1016/bs.mie.2018.06.004</a>).
				The radical SAM superfamily then included 113,776 sequences.  The SSN used to define the subgroups is reproduced below
				(Figure 5 in the Atlas), with the nodes in the 20 characterized subgroups defined by clusters in the SSN highlighted
				(minimum e-value threshold to draw edges is 20).  Unfortunately, the SFLD is now an archive.
			</p>

			<p class="text-center"">
				<img src="img/intro/atlas.png" class="w-50" alt="The SSN used to define the subgroups in the Atlas of the the Radical Superfamily, from the Atlas publication." />
			</p>

			<p>
				As of January 1, 2020, the radical SAM superfamily included 550,775 sequences (InterPro families IPR007197
				and IPR006638 from UniProt Release 2019_10).  The size of the superfamily will continue to increase:  the
				doubling time for the UniProt database is ~2.5 yrs.  
			</p>

			<p>
				We provide a web resource (<a href="https://efi.igb.illinois.edu/">https://efi.igb.illinois.edu/</a>;
				doi: <a href="https://dx.doi.org/10.1021/acs.biochem.9b00735">10.1021/acs.biochem.9b00735</a>; 
				<a href="https://efi.igb.illinois.edu/training/biochem/FromTheBench2019.pdf"><i class="fas fa-download"></i></a>) that provides
				"genomic enzymology" tools.  These tools are widely used by the enzymology, chemical biology, and
				microbiology communities to explore sequence-function space in protein families (SSNs using EFI-EST),
				discover genome context that may provide clues for assigning functions to uncharacterized enzymes
				(GNNs/GNDs using EFI-GNT), and prioritizing uncharacterized members for functional assignment based on
				metagenome abundance (EFI-CGFP).
			</p>

			<p>
				However, the increasing size of the radical SAM superfamily makes it difficult/impossible to use our tools
				to investigate the various subgroups.  Therefore, we are developing radicalSAM.org to provide access to the
				sequences in the various subgroups as well as useful information about the subgroups.  The sequences can be
				used as input for EFI-EST to generate SSNs that, in turn, can be used with EFI-GNT and EFI-CGFP.
			</p>

			<p>
				We used the SSN generated with the sequences in InterPro families IPR007197 and IPR006638 in UniProt Release
				2019_10/InterPro Release 77 as the reference dataset.  In this SSN, the minimum alignment score threshold
				to draw edges is 11.  This SSN includes 43,385 UniRef50 IDs/clusters and 36,130,127 edges.   Visualization
				of this SSN requires a computer with &ge;256GB RAM, i.e., well beyond that found in most experimental
				laboratories. 
			</p>

			<p class="text-center">
				<a href="img/intro/ssn_full_lg.png"><img src="img/intro/ssn_full_sm.png" class="" alt="The SSN from the IPR007197 and IPR006638 families, with an alignment score of 11." /></a>
			</p>

			<p>
				In contrast to the SFLD’s SSN, the clusters for the subgroups are not separated in this SSN, the result of
				both the larger number of sequences and the minimization of the number of singletons.  
			</p>

			<p>
				This SSN was manually edited to remove "long" edges, resulting a simpler SSN, although it still contains five "megaclusters".
			</p>

			<p class="text-center">
				<a href="img/intro/ssn_edit_lg.png"><img src="img/intro/ssn_edit_sm.png" alt="The SSN from the IPR007197 and IPR006638 families, with an alignment score of 11, manually edited to remove long edges." /></a>
			</p>

			<p>
				The megaclusters then were segregated into the component clusters/subgroups in radicalSAM.org using SSNs
				generated with larger minimum alignment score thresholds to draw edges and additional manual editing to
				remove "long" edges.
			</p>

			<p>
				RadicalSAM.org provides a page for each subgroup/cluster so defined that provides access to several types
				of information and file downloads:  clusters sizes (numbers of UniProt, UniRef90, and UniRef50 IDs), length
				histogram, WebLogo and multiple sequence alignment (MSA), HMM, lists of UniProt, UniRef90, and UniRef50
				IDs, FASTA files for UniProt, UniRef90, and UniRef50 IDs, SwissProt functions, KEGG-annotated sequence IDs,
				TIGR families, and community-provided annotations that are not yet included in SwissProt.  The lists of IDs
				can be used with Option D of EFI-EST to generate SSNs that can be used to explore sequence-function space
				in SSNs, identify genome context for bacterial and fungal proteins using EFI-GNT, and quantitate metagenome
				abundance using EFI-CGFP.
			</p>

			<p>
				We used the MSA for each subgroup/cluster to generate a hidden Markov model (HMM); we are using these HMMs
				to update the sequences for each release of the UniProt/InterPro databases.   Sequence-function space in
				subgroup 17, SPASM/Twitch domain-containing (magenta nodes in the SSNs), is too diverse for this HMM-based
				approach for updating; the sequences in this subgroup currently are updated manually with each database
				release.
			</p>

			<p class="text-center mt-5">
				<a href="explore.html"><button class="btn btn-success btn-lg">Explore the Data</button></a>
			</p>

			<p>

			</p>

			<p>

			</p>

			<!-- Example row of columns -->
			<!--<div class="row">
				<div class="col-md-4">
					<h2>Heading</h2>
					<p>Donec id elit <a href="TEST">non mi porta gravida </a>at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
					<p><a class="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
				</div>
				<div class="col-md-4">
					<h2>Heading</h2>
					<p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
					<p><a class="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
				</div>
				<div class="col-md-4">
					<h2>Heading</h2>
					<p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
					<p><a class="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
				</div>
			</div>

			<hr>-->

		</div> <!-- /container -->

	</main>

<?php require_once 'includes/footer.inc.php'; ?>

