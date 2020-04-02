var DATA = {
	"networks": {
		"fullnetwork": {
			"image": "fullnetwork",
			"title": "Primary Clusters of the Radical SAM Superfamily",
			"name": "Radical SAM Superfamily",
			//TODO: this is for testing only
			"TESTtext": " The Radical SAM superfamily is composed of proteins from the IPR007197 and IPR006638 InterPro families. ",
			"regions": [
				{
					"id": "cluster-1",
					"name": "Mega-1",
					"number": "2",
					"coords": [0, 0, 31.16, 100]
				},
				{
					"id": "cluster-2",
					"name": "Mega-2",
					"number": "1",
					"coords": [31.17, 0, 51.48, 72.29]
				},
				{
					"id": "cluster-3",
					"name": "Mega-3",
					"number": "3",
					"coords": [51.49, 0, 62.87, 33.76]
				},
				{
					"id": "cluster-4",
					"name": "Mega-4",
					"number": "4",
					"coords": [62.88, 0, 70.94, 31.93]
				},
				{
					"id": "cluster-5",
					"name": "5",
					"number": "5",
					"coords": [70.95, 0, 74.82, 12.11]
				},
				{
					"id": "cluster-6",
					"name": "Mega-6",
					"number": "7",
					"coords": [74.9, 0, 82.8, 32, 3]
				},
				{
					"id": "cluster-7",
					"name": "7",
					"number": "8",
					"coords": [82.81, 0, 85, 9]
				},
				{
					"id": "cluster-8",
					"name": "8",
					"number": "6",
					"coords": [85.01, 0, 87.1, 9]
				},
				{
					"id": "cluster-9",
					"name": "9",
					"number": "11",
					"coords": [87.11, 0, 89.3, 9]
				},
				{
					"id": "cluster-10",
					"name": "10",
					"number": "9",
					"coords": [89.31, 0, 91.3, 9]
				},
				{
					"id": "cluster-11",
					"name": "11",
					"number": "10",
					"coords": [91.31, 0, 93.5, 9]
				},
				{
					"id": "cluster-12",
					"name": "12",
					"number": "13",
					"coords": [93.51, 0, 95.6, 9]
				},
				{
					"id": "cluster-13",
					"name": "13",
					"number": "12",
					"coords": [95.61, 0, 97.4, 9]
				},
				{
					"id": "cluster-14",
					"name": "14",
					"number": "14",
					"coords": [97.41, 0, 99, 9]
				}
			]
		},
		"cluster-1": {
			"image": "cluster-1",
			"title": "Subgroups and Clusters of Megacluster 1",
			"name": "Megacluster 1",
			"subgroups": [
				{
					"id": "cluster-1-1",
					"name": "Mega-1-1",
					"desc": "SPASM/twitch domain Containing",
					"sfld": "17",
					"color": "#ff13ff",
				},
				{
					"id": "cluster-1-2",
					"name": "Mega-1-2",
					"desc": "Viperin (No AISC)",
					"sfld": "3",
				},
				{
					"id": "cluster-1-3",
					"name": "Mega-1-3",
					"desc": "Avilamycin synthase (C-Term AISC)",
					"sfld": "4",
					"color": "#ff8eac",
				},
				{
					"id": "cluster-1-4",
					"name": "Mega-1-4",
					"desc": "DesII-like (No AISC)",
					"sfld": "7",
					"color": "#f397ff",
				},
				{
					"id": "cluster-1-5",
					"name": "Mega-1-5",
					"desc": "FeMo-cofactor biosynthesis protein (AISC)",
					"sfld": "10",
					"color": "#b6e3a7",
				},
				{
					"id": "cluster-1-6",
					"name": "Mega-1-6",
					"desc": "Methyltransferase D (C-Term AISC)",
					"sfld": "14",
					"color": "#ffbdb4",
				},
				{
					"id": "cluster-1-7",
					"name": "Mega-1-7",
					"desc": "Spectinomycin biosynthesis (AISC)",
					"sfld": "18",
				}
			],
		},
		"cluster-1-1": {
			"image": "cluster-1-1",
			"title": "Megacluster-1-1: SFLD Subgroup 17 / SPASM/twitch domain Containing",
			"name": "Megacluster-1-1",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR02109",
					"description": "pyrroloquinoline quinone biosynthesis protein PqqE"
				},
				{
					"id": "TIGR02666",
					"description": "GTP 3',8-cyclase MoaA"
				},
				{
					"id": "TIGR02668",
					"description": "GTP 3',8-cyclase MoaA"
				},
				{
					"id": "TIGR03470",
					"description": "adenosyl-hopene transferase HpnH"
				},
				{
					"id": "TIGR03906",
					"description": "quinohemoprotein amine dehydrogenase maturation protein"
				},
				{
					"id": "TIGR03913",
					"description": "GDL motif peptide-associated radical SAM/SPASM maturase"
				},
				{
					"id": "TIGR03942",
					"description": "anaerobic sulfatase maturase"
				},
				{
					"id": "TIGR03961",
					"description": "PTO1314 family radical SAM protein"
				},
				{
					"id": "TIGR03962",
					"description": "mycofactocin radical SAM maturase"
				},
				{
					"id": "TIGR03974",
					"description": "thioether cross-link-forming SCIFF peptide maturase"
				},
				{
					"id": "TIGR03977",
					"description": "His-Xaa-Ser system radical SAM maturase HxsC"
				},
				{
					"id": "TIGR03978",
					"description": "His-Xaa-Ser system radical SAM maturase HxsB"
				},
				{
					"id": "TIGR04038",
					"description": "NULL"
				},
				{
					"id": "TIGR04043",
					"description": "MSMEG_0568 family radical SAM protein"
				},
				{
					"id": "TIGR04051",
					"description": "heme d1 biosynthesis radical SAM protein NirJ"
				},
				{
					"id": "TIGR04054",
					"description": "putative heme d1 biosynthesis radical SAM protein NirJ1"
				},
				{
					"id": "TIGR04055",
					"description": "putative heme d1 biosynthesis radical SAM protein NirJ2"
				},
				{
					"id": "TIGR04064",
					"description": "nif11-like peptide radical SAM maturase"
				},
				{
					"id": "TIGR04068",
					"description": "Cys-rich peptide radical SAM maturase CcpM"
				},
				{
					"id": "TIGR04078",
					"description": "YydG family peptide radical SAM peptide maturase"
				},
				{
					"id": "TIGR04080",
					"description": "KxxxW cyclic peptide radical SAM maturase"
				},
				{
					"id": "TIGR04082",
					"description": "selenobiotic family peptide radical SAM maturase"
				},
				{
					"id": "TIGR04083",
					"description": "TIGR04083 family peptide-modifying radical SAM enzyme"
				},
				{
					"id": "TIGR04084",
					"description": "TIGR04084 family radical SAM/SPASM domain-containing protein"
				},
				{
					"id": "TIGR04100",
					"description": "TIGR04100 family radical SAM protein"
				},
				{
					"id": "TIGR04115",
					"description": "radical SAM peptide maturase, CXXX-repeat target family"
				},
				{
					"id": "TIGR04133",
					"description": "NULL"
				},
				{
					"id": "TIGR04136",
					"description": "FibroRumin system radical SAM peptide maturase"
				},
				{
					"id": "TIGR04148",
					"description": "radical SAM peptide maturase"
				},
				{
					"id": "TIGR04150",
					"description": "TIGR04150 pseudo-rSAM protein"
				},
				{
					"id": "TIGR04163",
					"description": "peptide-modifying radical SAM enzyme CbpB"
				},
				{
					"id": "TIGR04167",
					"description": "radical SAM/Cys-rich domain protein"
				},
				{
					"id": "TIGR04250",
					"description": "SynChlorMet cassette radical SAM/SPASM protein ScmE"
				},
				{
					"id": "TIGR04251",
					"description": "SynChlorMet cassette radical SAM/SPASM protein ScmF"
				},
				{
					"id": "TIGR04261",
					"description": "GRRM system radical SAM/SPASM domain protein"
				},
				{
					"id": "TIGR04269",
					"description": "FxsB family radical SAM/SPASM domain protein"
				},
				{
					"id": "TIGR04280",
					"description": "putative geopeptide radical SAM maturase"
				},
				{
					"id": "TIGR04303",
					"description": "GeoRSP system radical SAM/SPASM protein"
				},
				{
					"id": "TIGR04311",
					"description": "radical SAM/SPASM family putative metalloenzyme maturase"
				},
				{
					"id": "TIGR04317",
					"description": "tungsten cofactor oxidoreductase radical SAM maturase"
				},
				{
					"id": "TIGR04321",
					"description": "spiro-SPASM protein"
				},
				{
					"id": "TIGR04334",
					"description": "radical SAM/SPASM domain Clo7bot peptide maturase"
				},
				{
					"id": "TIGR04340",
					"description": "radical SAM/SPASM domain protein, ACGX system"
				},
				{
					"id": "TIGR04347",
					"description": "pseudo-rSAM protein/SPASM domain protein"
				},
				{
					"id": "TIGR04403",
					"description": "sporulation killing factor system radical SAM maturase"
				},
				{
					"id": "TIGR04463",
					"description": "radical SAM/SPASM domain protein maturase"
				},
				{
					"id": "TIGR04466",
					"description": "cytosylglucuronate decarboxylase"
				},
				{
					"id": "TIGR04478",
					"description": "radical SAM/CxCxxxxC motif protein YfkAB"
				},
				{
					"id": "TIGR04496",
					"description": "XyeB family radical SAM/SPASM peptide maturase"
				},
				{
					"id": "TIGR04545",
					"description": "heme b synthase"
				},
				{
					"id": "TIGR04546",
					"description": "12,18-didecarboxysiroheme deacetylase"
				}
			]
		},
		"cluster-1-2": {
			"image": "cluster-1-2",
			"title": "Megacluster-1-2: SFLD Subgroup 3 / Viperin (No AISC)",
			"name": "Megacluster-1-2",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"]
		},
		"cluster-1-3": {
			"image": "cluster-1-3",
			"title": "Megacluster-1-3: SFLD Subgroup 4 / Avilamycin synthase (C-Term AISC)",
			"name": "Megacluster-1-3",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"]
		},
		"cluster-1-4": {
			"image": "cluster-1-4",
			"title": "Megacluster-1-4: SFLD Subgroup 7 / DesII-like (No AISC)",
			"name": "Megacluster-1-4",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR04426",
					"description": "dTDP-4-amino-4,6-dideoxy-D-glucose ammonia-lyase"
				}
			]
		},
		"cluster-1-5": {
			"image": "cluster-1-5",
			"title": "Megacluster-1-5: SFLD Subgroup 10 / FeMo-cofactor biosynthesis protein (AISC)",
			"name": "Megacluster-1-5",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR01290",
					"description": "nitrogenase cofactor biosynthesis protein NifB"
				}
			]
		},
		"cluster-1-6": {
			"image": "cluster-1-6",
			"title": "Megacluster-1-6: SFLD Subgroup 14 / Methyltransferase D (C-Term AISC)",
			"name": "Megacluster-1-6",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"]
		},
		"cluster-1-7": {
			"image": "cluster-1-7",
			"title": "Megacluster-1-7: SFLD Subgroup 18 / 	Spectinomycin biosynthesis (AISC)",
			"name": "Megacluster-1-7",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"]
		},
		"cluster-2": {
			"image": "cluster-2",
			"title": "Megacluster-2",
			"name": "Megacluster-2",
			"regions": [
				{
					"id": "cluster-2-1x",
					"name": "2-1",
					"number": "3",
					"coords": [0, 0, 34.5, 100]
				},
				{
					"id": "cluster-2-2",
					"name": "2-2",
					"number": "2",
					"coords": [34.5, 0, 48.2, 39.5]
				},
				{
					"id": "cluster-2-3",
					"name": "2-3",
					"number": "1",
					"coords": [48.2, 0, 70.1, 39.5]
				},
				{
					"id": "cluster-2-4x",
					"name": "2-4",
					"number": "4",
					"coords": [70.1, 0, 79.1, 20.4]
				},
				{
					"id": "cluster-2-5",
					"name": "2-5",
					"number": "5",
					"coords": [79.1, 0, 87.5, 20.4]
				}
			]
		},
		"cluster-2-1x": {
			"image": "cluster-2-1x",
			"title": "Megacluster-2-1: SFLD Subgroup 5 / B12-binding domain, sub-clusters",
			"name": "Megacluster-2-1",
			"tigr_families": [
				{
					"id": "TIGR01212",
					"description": "TIGR01212 family radical SAM protein "
				},
				{
					"id": "TIGR02026",
					"description": "magnesium-protoporphyrin IX monomethyl ester anaerobic oxidative cyclase "
				},
				{
					"id": "TIGR03471",
					"description": "hopanoid biosynthesis associated radical SAM protein HpnJ "
				},
				{
					"id": "TIGR03960",
					"description": "TIGR03960 family B12-binding radical SAM protein "
				},
				{
					"id": "TIGR03975",
					"description": "RiPP maturation radical SAM protein 1 "
				},
				{
					"id": "TIGR04013",
					"description": "TIGR04013 family B12-binding domain/radical SAM domain-containing protein "
				},
				{
					"id": "TIGR04014",
					"description": "TIGR04014 family B12-binding domain/radical SAM domain-containing protein "
				},
				{
					"id": "TIGR04190",
					"description": "TIGR04190 family B12-binding domain/radical SAM domain protein "
				},
				{
					"id": "TIGR04295",
					"description": "TIGR04295 family B12-binding domain-containing radical SAM protein "
				},
				{
					"id": "TIGR04367",
					"description": "hopanoid C-3 methylase HpnR "
				},
				{
					"id": "TIGR04385",
					"description": "B12 lower ligand biosynthesis radical SAM protein BzaD "
				},
				{
					"id": "TIGR04428",
					"description": "tryptophan 2-C-methyltransferase "
				},
				{
					"id": "TIGR04434",
					"description": "B12-binding domain/radical SAM domain-containing protein "
				},
				{
					"id": "TIGR04479",
					"description": "PhpK family radical SAM P-methyltransferase "
				},
				{
					"id": "TIGR04517",
					"description": "radical SAM family RiPP maturation amino acid epimerase "
				},
				{
					"id": "TIGR03960",
					"description": "TIGR03960 family B12-binding radical SAM protein "
				},
				{
					"id": "TIGR04517",
					"description": "radical SAM family RiPP maturation amino acid epimerase "
				}
			],
			"regions": [
				{
					"id": "cluster-2-1x-1",
					"name": "2-1-1",
					"number": "1",
					"coords": [0, 0, 31, 100]
				},
				{
					"id": "cluster-2-1x-2",
					"name": "2-1-2",
					"number": "2",
					"coords": [31, 0, 46.2, 21.2]
				},
				{
					"id": "cluster-2-1x-3",
					"name": "2-1-3",
					"number": "3",
					"coords": [46.2, 0, 52, 18.7]
				},
				{
					"id": "cluster-2-1x-4",
					"name": "2-1-4",
					"number": "5",
					"coords": [52, 0, 57, 18.7]
				},
				{
					"id": "cluster-2-1x-5",
					"name": "2-1-5",
					"number": "6",
					"coords": [57, 0, 63.4, 21.2]
				},
				{
					"id": "cluster-2-1x-6",
					"name": "2-1-6",
					"number": "4",
					"coords": [63.4, 0, 68.3, 16.4]
				},
				{
					"id": "cluster-2-1x-7",
					"name": "2-1-7",
					"number": "9",
					"coords": [68.3, 0, 73.5, 16.4]
				},
				{
					"id": "cluster-2-1x-8",
					"name": "2-1-8",
					"number": "7",
					"coords": [73.5, 0, 77.9, 15.2]
				},
				{
					"id": "cluster-2-1x-9",
					"name": "2-1-9",
					"number": "8",
					"coords": [77.9, 0, 81.8, 14]
				},
				{
					"id": "cluster-2-1x-10",
					"name": "2-1-10",
					"number": "10",
					"coords": [81.8, 0, 85.5, 14]
				},
				//{
				//	"id": "cluster-2-1x-11",
				//	"name": "2-1-11",
				//	"number": "13",
				//	"coords": [85.5, 0, 89.5, 14]
				//},
				//{
				//	"id": "cluster-2-1x-12",
				//	"name": "2-1-12",
				//	"number": "11",
				//	"coords": [89.5, 0, 92.7, 11]
				//},
				//{
				//	"id": "cluster-2-1x-13",
				//	"name": "2-1-13",
				//	"number": "12",
				//	"coords": [92.7, 0, 95.6, 8]
				//},
				//{
				//	"id": "cluster-2-1x-14",
				//	"name": "2-1-14",
				//	"number": "14",
				//	"coords": [95.6, 0, 97.2, 8]
				//}
			]
		},
		"cluster-2-1x-1": {
			"image": "cluster-2-1x-1",
			"title": "Megacluster-2-1-1: SFLD Subgroup 5 / B12-binding domain, level 3",
			"name": "Megacluster-2-1-1",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-2-1x-2": {
			"image": "cluster-2-1x-2",
			"title": "Megacluster-2-1-2: SFLD Subgroup 5 / B12-binding domain, level 3",
			"name": "Megacluster-2-1-2",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-2-1x-3": {
			"image": "cluster-2-1x-3",
			"title": "Megacluster-2-1-3: SFLD Subgroup 5 / B12-binding domain, level 3",
			"name": "Megacluster-2-1-3",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-2-1x-4": {
			"image": "cluster-2-1x-4",
			"title": "Megacluster-2-1-4: SFLD Subgroup 5 / B12-binding domain, level 3",
			"name": "Megacluster-2-1-4",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-2-1x-5": {
			"image": "cluster-2-1x-5",
			"title": "Megacluster-2-1-5: SFLD Subgroup 5 / B12-binding domain, level 3",
			"name": "Megacluster-2-1-5",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-2-1x-6": {
			"image": "cluster-2-1x-6",
			"title": "Megacluster-2-1-6: SFLD Subgroup 5 / B12-binding domain, level 3",
			"name": "Megacluster-2-1-6",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-2-1x-7": {
			"image": "cluster-2-1x-7",
			"title": "Megacluster-2-1-7: SFLD Subgroup 5 / B12-binding domain, level 3",
			"name": "Megacluster-2-1-7",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-2-1x-8": {
			"image": "cluster-2-1x-8",
			"title": "Megacluster-2-1-8: SFLD Subgroup 5 / B12-binding domain, level 3",
			"name": "Megacluster-2-1-8",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-2-1x-9": {
			"image": "cluster-2-1x-9",
			"title": "Megacluster-2-1-9: SFLD Subgroup 5 / B12-binding domain, level 3",
			"name": "Megacluster-2-1-9",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-2-1x-10": {
			"image": "cluster-2-1x-10",
			"title": "Megacluster-2-1-10: SFLD Subgroup 5 / B12-binding domain, level 3",
			"name": "Megacluster-2-1-10",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-2-2": {
			"image": "cluster-2-2",
			"title": "Megacluster-2-2: SFLD Subgroup 2 / Oxygen-independent coproporphyinogen III oxidase-like",
			"name": "Megacluster-2-2",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR00538",
					"description": "oxygen-independent coproporphyrinogen III oxidase "
				},
				{
					"id": "TIGR00539",
					"description": "radical SAM family heme chaperone HemW "
				},
				{
					"id": "TIGR01211",
					"description": "tRNA uridine(34) 5-carboxymethylaminomethyl modification radical SAM/GNAT enzyme Elp3 "
				},
				{
					"id": "TIGR03994",
					"description": "coproporphyrinogen dehydrogenase HemZ "
				},
				{
					"id": "TIGR04107",
					"description": "heme anaerobic degradation radical SAM methyltransferase ChuW/HutW "
				}
			]
		},
		"cluster-2-3": {
			"image": "cluster-2-3",
			"title": "Megacluster-2-3: SFLD Subgroup 12 / Methylthiotransferase",
			"name": "Megacluster-2-3",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR00089",
					"description": "MiaB/RimO family radical SAM methylthiotransferase "
				},
				{
					"id": "TIGR01125",
					"description": "30S ribosomal protein S12 methylthiotransferase RimO "
				},
				{
					"id": "TIGR01574",
					"description": "tRNA (N6-isopentenyl adenosine(37)-C2)-methylthiotransferase MiaB "
				},
				{
					"id": "TIGR01578",
					"description": "tRNA (N(6)-L-threonylcarbamoyladenosine(37)-C(2))-methylthiotransferase "
				},
				{
					"id": "TIGR01579",
					"description": "tRNA (N(6)-L-threonylcarbamoyladenosine(37)-C(2))-methylthiotransferase MtaB "
				}
			]
		},
		"cluster-2-4": {
			"image": "cluster-2-4",
			"title": "Megacluster-2-4: SFLD Subgroup 8 / Elongator complex protein 3",
			"name": "Megacluster-2-4",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-2-4x": {
			"image": "cluster-2-4x",
			"title": "Megacluster-2-4: SFLD Subgroup 8 / Elongator complex protein 3, sub-clusters (AS24)",
			"name": "Megacluster-2-4",
			"tigr_families": [
				{
					"id": "TIGR01211",
					"description": "tRNA uridine(34) 5-carboxymethylaminomethyl modification radical SAM/GNAT enzyme Elp3 "
				},
				{
					"id": "TIGR01212",
					"description": "TIGR01212 family radical SAM protein "
				}
			],
			"regions": [
				{
					"id": "cluster-2-4x-1",
					"name": "2-4-1",
					"number": "1",
					"coords": [0, 0, 25.6, 70.9]
				},
				{
					"id": "cluster-2-4x-2",
					"name": "2-4-2",
					"number": "2",
					"coords": [25.6, 0, 66.7, 100]
				},
				{
					"id": "cluster-2-4x-3",
					"name": "2-4-3",
					"number": "3",
					"coords": [66.7, 0, 93.6, 77.1]
				}
			]
		},
		"cluster-2-4x-1": {
			"image": "cluster-2-4x-1",
			"title": "Megacluster-2-4-1: SFLD Subgroup 8 / Elongator complex protein 3, sub-cluster 1",
			"name": "Megacluster-2-4-1",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-2-4x-2": {
			"image": "cluster-2-4x-2",
			"title": "Megacluster-2-4-2: SFLD Subgroup 8 / Elongator complex protein 3, sub-cluster 2",
			"name": "Megacluster-2-4-2",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-2-4x-3": {
			"image": "cluster-2-4x-3",
			"title": "Megacluster-2-4-3: SFLD Subgroup 8 / Elongator complex protein 3, sub-cluster 3",
			"name": "Megacluster-2-4-3",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-2-5": {
			"image": "cluster-2-5",
			"title": "Megacluster-2-5: SFLD Subgroup 8 / Elongator complex protein 3",
			"name": "Megacluster-2-5",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR01210",
					"description": "archaeosine biosynthesis radical SAM protein RaSEA "
				}
			]
		},
		"cluster-3": {
			"image": "cluster-3",
			"title": "Megacluster-3",
			"name": "Megacluster-3",
			"regions": [
				{
					"id": "cluster-3-1",
					"name": "3-1",
					"number": "2",
					"coords": [0, 0, 14, 76]
				},
				{
					"id": "cluster-3-2",
					"name": "3-2",
					"number": "1",
					"coords": [14, 0, 24.5, 70]
				},
				{
					"id": "cluster-3-3",
					"name": "3-3",
					"number": "5",
					"coords": [24.5, 0, 42, 100]
				},
				{
					"id": "cluster-3-4",
					"name": "3-4",
					"number": "3",
					"coords": [42, 0, 55.5, 70]
				},
				{
					"id": "cluster-3-5",
					"name": "3-5",
					"number": "4",
					"coords": [55.5, 0, 70, 70]
				},
				{
					"id": "cluster-3-6",
					"name": "3-6",
					"number": "6",
					"coords": [70, 0, 78.3, 41]
				},
				{
					"id": "cluster-3-7",
					"name": "3-7",
					"number": "7",
					"coords": [78.3, 0, 83.8, 37]
				},
				//{
				//	"id": "cluster-3-8",
				//	"name": "3-8",
				//	"number": "8",
				//	"coords": [83.8, 0, 87.9, 19]
				//},
				//{
				//	"id": "cluster-3-9",
				//	"name": "3-9",
				//	"number": "9",
				//	"coords": [87.9, 0, 92, 12]
				//}
			]
		},
		"cluster-3-1": {
			"image": "cluster-3-1",
			"title": "Megacluster-3-1: SFLD Subgroup 15 / Organic radical activating enzymes",
			"name": "Megacluster-3-1",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR02493",
					"description": "pyruvate formate lyase-activating protein"
				},
				{
					"id": "TIGR02494",
					"description": "glycyl-radical enzyme activating protein"
				},
				{
					"id": "TIGR04003",
					"description": "[benzylsuccinate synthase]-activating enzyme"
				},
				{
					"id": "TIGR04041",
					"description": "YjjW family glycine radical enzyme activase"
				},
				{
					"id": "TIGR04395",
					"description": "choline TMA-lyase-activating enzyme"
				}
			]
		},
		"cluster-3-2": {
			"image": "cluster-3-2",
			"title": "Megacluster-3-2: SFLD Subgroup 11 / 7-Carboxyl-7-deazaguanine synthase-like",
			"name": "Megacluster-3-2",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR03365",
					"description": "7-carboxy-7-deazaguanine synthase QueE"
				},
				{
					"id": "TIGR03963",
					"description": "putative 7-carboxy-7-deazaguanine synthase QueE"
				},
				{
					"id": "TIGR04322",
					"description": "7-carboxy-7-deazaguanine synthase QueE"
				},
				{
					"id": "TIGR04349",
					"description": "7-carboxy-7-deazaguanine synthase QueE"
				},
				{
					"id": "TIGR04508",
					"description": "7-carboxy-7-deazaguanine synthase"
				}
			]
		},
		"cluster-3-3": {
			"image": "cluster-3-3",
			"title": "Megacluster-3-3",
			"name": "Megacluster-3-3",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR04295",
					"description": "family B12-binding domain-containing radical SAM protein"
				},
			]
		},
		"cluster-3-4": {
			"image": "cluster-3-4",
			"title": "Megacluster-3-4",
			"name": "Megacluster-3-4",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR04337",
					"description": "AmmeMemoRadiSam system radical SAM enzyme"
				}
			]
		},
		"cluster-3-5": {
			"image": "cluster-3-5",
			"title": "Megacluster-3-5",
			"name": "Megacluster-3-5",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR02491",
					"description": "anaerobic ribonucleoside-triphosphate reductase activating protein"
				}
			]
		},
		"cluster-3-6": {
			"image": "cluster-3-6",
			"title": "Megacluster-3-6",
			"name": "Megacluster-3-6",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-3-7": {
			"image": "cluster-3-7",
			"title": "Megacluster-3-7",
			"name": "Megacluster-3-7",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		//"cluster-3-8": {
		//	"image": "cluster-3-8",
		//	"title": "Megacluster-3-8",
		//	"name": "Megacluster-3-8",
		//	"display": ["weblogo", "length_histogram"],
		//	"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		//},
		//"cluster-3-9": {
		//	"image": "cluster-3-9",
		//	"title": "Megacluster-3-9",
		//	"name": "Megacluster-3-9",
		//	"display": ["weblogo", "length_histogram"],
		//	"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		//},
		"cluster-4": {
			"image": "cluster-4",
			"title": "Megacluster-4",
			"name": "Megacluster-4",
			"tigr_families": [
			],
			"regions": [
				{
					"id": "cluster-4-1",
					"name": "4-1",
					"number": "2",
					"coords": [0, 0, 11.7, 91.5]
				},
				{
					"id": "cluster-4-2",
					"name": "4-2",
					"number": "1",
					"coords": [11.7, 0, 22, 33]
				},
				{
					"id": "cluster-4-3",
					"name": "4-3",
					"number": "4",
					"coords": [22, 0, 32.1, 28]
				},
				{
					"id": "cluster-4-4",
					"name": "4-4",
					"number": "3",
					"coords": [32.1, 0, 43, 36]
				},
				{
					"id": "cluster-4-5",
					"name": "4-5",
					"number": "6",
					"coords": [43, 0, 56.5, 28]
				},
				{
					"id": "cluster-4-6",
					"name": "4-6",
					"number": "5",
					"coords": [56.5, 0, 69, 50]
				},
				{
					"id": "cluster-4-7",
					"name": "4-7",
					"number": "7",
					"coords": [69, 0, 76.2, 24]
				},
				{
					"id": "cluster-4-8",
					"name": "4-8",
					"number": "8",
					"coords": [76.2, 0, 85.5, 27]
				},
				{
					"id": "cluster-4-9",
					"name": "4-9",
					"number": "9",
					"coords": [85.5, 0, 93.4, 31]
				},
				{
					"id": "cluster-4-10",
					"name": "4-10",
					"number": "10",
					"coords": [93.4, 0, 100, 22]
				}
			]
		},
		"cluster-4-1": {
			"image": "cluster-4-1",
			"title": "Megacluster-4-1 CofG,CofH,futalosine (F420, menaquinone cofactor)",
			"name": "Megacluster-4-1",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR00423",
					"description": "CofH family radical SAM protein"
				},
				{
					"id": "TIGR03550",
					"description": "7,8-didemethyl-8-hydroxy-5-deazariboflavin synthase CofG"
				},
				{
					"id": "TIGR03551",
					"description": "5-amino-6-(D-ribitylamino)uracil--L-tyrosine 4-hydroxyphenyl transferase CofH"
				},
				{
					"id": "TIGR03699",
					"description": "dehypoxanthine futalosine cyclase"
				},
				{
					"id": "TIGR03700",
					"description": "aminofutalosine synthase MqnE"
				}
			]
		},
		"cluster-4-2": {
			"image": "cluster-4-2",
			"title": "Megacluster-4-2 Biotin synthase (BATS)",
			"name": "Megacluster-4-2",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR00433",
					"description": "biotin synthase BioB"
				}
			]
		},
		"cluster-4-3": {
			"image": "cluster-4-3",
			"title": "Megacluster-4-3 PylB, HydE",
			"name": "Megacluster-4-3",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR03910",
					"description": "methylornithine synthase PylB"
				},
				{
					"id": "TIGR03956",
					"description": "[FeFe] hydrogenase H-cluster radical SAM maturase HydE"
				}
			]
		},
		"cluster-4-4": {
			"image": "cluster-4-4",
			"title": "Megacluster-4-4 ThiH, HydG (BATS)",
			"name": "Megacluster-4-4",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR02351",
					"description": "2-iminoacetate synthase ThiH"
				},
				{
					"id": "TIGR03955",
					"description": "[FeFe] hydrogenase H-cluster radical SAM maturase HydG"
				}
			]
		},
		"cluster-4-5": {
			"image": "cluster-4-5",
			"title": "Megacluster-4-5",
			"name": "Megacluster-4-5",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-4-6": {
			"image": "cluster-4-6",
			"title": "Megacluster-4-6",
			"name": "Megacluster-4-6",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR04043",
					"description": "MSMEG_0568 family radical SAM protein"
				}
			]
		},
		"cluster-4-7": {
			"image": "cluster-4-7",
			"title": "Megacluster-4-7",
			"name": "Megacluster-4-7",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-4-8": {
			"image": "cluster-4-8",
			"title": "Megacluster-4-8",
			"name": "Megacluster-4-8",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-4-9": {
			"image": "cluster-4-9",
			"title": "Megacluster-4-9",
			"name": "Megacluster-4-9",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR03957",
					"description": "5,10-methenyltetrahydromethanopterin hydrogenase cofactor biosynthesis protein HmdB"
				}
			]
		},
		"cluster-4-10": {
			"image": "cluster-4-10",
			"title": "Megacluster-4-10",
			"name": "Megacluster-4-10",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-5": {
			"image": "cluster-5",
			"title": "Cluster-5: SFLD Subgroup 13 / Methyltransferase Class A",
			"name": "Cluster-5",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR00048",
					"description": "23S rRNA (adenine(2503)-C(2))-methyltransferase RlmN"
				}
			]
		},
		"cluster-6": {
			"image": "cluster-6",
			"title": "Megacluster-6",
			"name": "Megacluster-6",
			"regions": [
				{
					"id": "cluster-6-1",
					"name": "6-1",
					"number": "1",
					"coords": [0, 0, 52.8, 100]
				},
				{
					"id": "cluster-6-2",
					"name": "6-2",
					"number": "2",
					"coords": [52.8, 0, 66.5, 47]
				},
				{
					"id": "cluster-6-3",
					"name": "6-3",
					"number": "3",
					"coords": [66.5, 0, 82.3, 47]
				},
				{
					"id": "cluster-6-4",
					"name": "6-4",
					"number": "4",
					"coords": [82.3, 0, 96.3, 30]
				}
			]
		},
		"cluster-6-1": {
			"image": "cluster-6-1",
			"title": "Megacluster-6-1: SFLD Subgroup 19 / Subgroup 19 Spore photoproduct photolyse",
			"name": "Megacluster-6-1",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR04470",
					"description": "radical SAM mobile pair protein B"
				},
				{
					"id": "TIGR04471",
					"description": "radical SAM mobile pair protein A"
				}
			]
		},
		"cluster-6-2": {
			"image": "cluster-6-2",
			"title": "Megacluster-6-2",
			"name": "Megacluster-6-2",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR04070",
					"description": "spore photoproduct lyase"
				}
			]
		},
		"cluster-6-3": {
			"image": "cluster-6-3",
			"title": "Megacluster-6-3",
			"name": "Megacluster-6-3",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR04471",
					"description": "radical SAM mobile pair protein A"
				}
			]
		},
		"cluster-6-4": {
			"image": "cluster-6-4",
			"title": "Megacluster-6-4",
			"name": "Megacluster-6-4",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-7": {
			"image": "cluster-7",
			"title": "cluster-7: SFLD Subgroup 16 / PLP-dependent aminotransferase",
			"name": "cluster-7",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR00238",
					"description": "KamA family radical SAM protein"
				},
				{
					"id": "TIGR03820",
					"description": "lysine 2,3-aminomutase"
				},
				{
					"id": "TIGR03821",
					"description": "EF-P beta-lysylation protein EpmB"
				},
				{
					"id": "TIGR03822",
					"description": "lysine-2,3-aminomutase-like protein"
				},
				{
					"id": "TIGR04368",
					"description": "glutamate 2,3-aminomutase"
				},
				{
					"id": "TIGR04468",
					"description": "arginine 2,3-aminomutase"
				}
			]
		},
		"cluster-8": {
			"image": "cluster-8",
			"title": "Cluster-8: SFLD Subgroup 6 / Lipoyl synthase-like",
			"name": "Cluster-8",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR00510",
					"description": "lipoyl synthase"
				}
			]
		},
		"cluster-9": {
			"image": "cluster-9",
			"title": "Cluster-9: SFLD Subgroup 20 / tRNA wybutosine synthesizing",
			"name": "Cluster-9",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR03972",
					"description": "4-demethylwyosine synthase TYW1"
				}
			]
		},
		"cluster-10": {
			"image": "cluster-10",
			"title": "Cluster-10",
			"name": "Cluster-10",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR03904",
					"description": "YgiQ family radical SAM protein"
				}
			]
		},
		"cluster-11": {
			"image": "cluster-11",
			"title": "Cluster-11",
			"name": "Cluster-11",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR03916",
					"description": "putative DNA modification/repair radical SAM protein"
				}
			]
		},
		"cluster-12": {
			"image": "cluster-12",
			"title": "Cluster-12",
			"name": "Cluster-12",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-13": {
			"image": "cluster-13",
			"title": "Cluster-13",
			"name": "Cluster-13",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
		},
		"cluster-14": {
			"image": "cluster-14",
			"title": "Cluster-14",
			"name": "Cluster-14",
			"display": ["weblogo", "length_histogram"],
			"downloads": ["weblogo", "msa", "hmm", "id_fasta", "misc"],
			"tigr_families": [
				{
					"id": "TIGR03278",
					"description": "methyl coenzyme M reductase-arginine methyltransferase Mmp10"
				}
			]
		}
	},
	"sizes": {
		"cluster-1": {
			"uniprot": 126746,
			"uniref90": 63952,
			"uniref50": 17454
		},
		"cluster-2": {
			"uniprot": 195361,
			"uniref90": 87965,
			"uniref50": 16527
		},
		"cluster-3": {
			"uniprot": 64748,
			"uniref90": 29059,
			"uniref50": 4220
		},
		"cluster-4": {
			"uniprot": 57217,
			"uniref90": 21267,
			"uniref50": 1752
		},
		"cluster-5": {
			"uniprot": 34653,
			"uniref90": 12125,
			"uniref50": 1255
		},
		"cluster-6": {
			"uniprot": 20764,
			"uniref90": 9003,
			"uniref50": 1023
		},
		"cluster-7": {
			"uniprot": 14347,
			"uniref90": 6497,
			"uniref50": 539
		},
		"cluster-8": {
			"uniprot": 29854,
			"uniref90": 9219,
			"uniref50": 481
		},
		"cluster-9": {
			"uniprot": 2856,
			"uniref90": 1436,
			"uniref50": 251
		},
		"cluster-10": {
			"uniprot": 10488,
			"uniref90": 3262,
			"uniref50": 173
		},
		"cluster-11": {
			"uniprot": 7363,
			"uniref90": 2382,
			"uniref50": 136
		},
		"cluster-12": {
			"uniprot": 274,
			"uniref90": 133,
			"uniref50": 14
		},
		"cluster-13": {
			"uniprot": 500,
			"uniref90": 195,
			"uniref50": 12
		},
		"cluster-14": {
			"uniprot": 256,
			"uniref90": 148,
			"uniref50": 9
		},
		"cluster-2-1x": {
			"uniprot": "52151",
			"uniref90": "31228",
			"uniref50": "9092"
		},
		"cluster-2-2": {
			"uniprot": "58106",
			"uniref90": "23335",
			"uniref50": "3319"
		},
		"cluster-2-3": {
			"uniprot": "74767",
			"uniref90": "28128",
			"uniref50": "2995"
		},
		"cluster-2-4x": {
			"uniprot": "16984",
			"uniref90": "6481",
			"uniref50": "923"
		},
		"cluster-2-5": {
			"uniprot": "1514",
			"uniref90": "800",
			"uniref50": "188"
		},
		"cluster-2-1x-1": {
			"uniprot": "37151",
			"uniref90": "23391",
			"uniref50": "7736"
		},
		"cluster-2-1x-2": {
			"uniprot": "8213",
			"uniref90": "3972",
			"uniref50": "728"
		},
		"cluster-2-1x-3": {
			"uniprot": "3913",
			"uniref90": "2251",
			"uniref50": "324"
		},
		"cluster-2-1x-4": {
			"uniprot": "837",
			"uniref90": "445",
			"uniref50": "91"
		},
		"cluster-2-1x-5": {
			"uniprot": "668",
			"uniref90": "377",
			"uniref50": "78"
		},
		"cluster-2-1x-6": {
			"uniprot": "1119",
			"uniref90": "588",
			"uniref50": "54"
		},
		"cluster-2-1x-7": {
			"uniprot": "61",
			"uniref90": "47",
			"uniref50": "28"
		},
		"cluster-2-1x-8": {
			"uniprot": "81",
			"uniref90": "67",
			"uniref50": "18"
		},
		"cluster-2-1x-9": {
			"uniprot": "65",
			"uniref90": "52",
			"uniref50": "12"
		},
		"cluster-2-1x-10": {
			"uniprot": "18",
			"uniref90": "15",
			"uniref50": "10"
		},
		"cluster-2-1x-11": {
			"uniprot": "5",
			"uniref90": "5",
			"uniref50": "5"
		},
		"cluster-2-1x-12": {
			"uniprot": "10",
			"uniref90": "10",
			"uniref50": "3"
		},
		"cluster-2-1x-13": {
			"uniprot": "6",
			"uniref90": "5",
			"uniref50": "2"
		},
		"cluster-2-1x-14": {
			"uniprot": "2",
			"uniref90": "1",
			"uniref50": "1"
		},
		"cluster-2-4x-1": {
			"uniprot": "0",
			"uniref90": "0",
			"uniref50": "0"
		},
		"cluster-2-4x-2": {
			"uniprot": "0",
			"uniref90": "0",
			"uniref50": "0"
		},
		"cluster-2-4x-3": {
			"uniprot": "0",
			"uniref90": "0",
			"uniref50": "0"
		},
		"cluster-3-1": {
			"uniprot": "19948",
			"uniref90": "6541",
			"uniref50": "1230"
		},
		"cluster-3-2": {
			"uniprot": "21732",
			"uniref90": "8963",
			"uniref50": "762"
		},
		"cluster-3-3": {
			"uniprot": "4884",
			"uniref90": "2927",
			"uniref50": "719"
		},
		"cluster-3-4": {
			"uniprot": "7822",
			"uniref90": "5393",
			"uniref50": "686"
		},
		"cluster-3-5": {
			"uniprot": "6818",
			"uniref90": "2607",
			"uniref50": "445"
		},
		"cluster-3-6": {
			"uniprot": "4671",
			"uniref90": "2783",
			"uniref50": "340"
		},
		"cluster-3-7": {
			"uniprot": "482",
			"uniref90": "249",
			"uniref50": "29"
		},
		"cluster-3-8": {
			"uniprot": "17",
			"uniref90": "4",
			"uniref50": "3"
		},
		"cluster-3-9": {
			"uniprot": "17",
			"uniref90": "6",
			"uniref50": "2"
		},
		"cluster-4-1": {
			"uniprot": "17963",
			"uniref90": "7197",
			"uniref50": "424"
		},
		"cluster-4-2": {
			"uniprot": "23649",
			"uniref90": "7183",
			"uniref50": "404"
		},
		"cluster-4-3": {
			"uniprot": "3500",
			"uniref90": "1823",
			"uniref50": "231"
		},
		"cluster-4-4": {
			"uniprot": "9134",
			"uniref90": "3052",
			"uniref50": "181"
		},
		"cluster-4-5": {
			"uniprot": "814",
			"uniref90": "566",
			"uniref50": "163"
		},
		"cluster-4-6": {
			"uniprot": "2751",
			"uniref90": "986",
			"uniref50": "133"
		},
		"cluster-4-7": {
			"uniprot": "781",
			"uniref90": "519",
			"uniref50": "127"
		},
		"cluster-4-8": {
			"uniprot": "243",
			"uniref90": "170",
			"uniref50": "37"
		},
		"cluster-4-9": {
			"uniprot": "140",
			"uniref90": "95",
			"uniref50": "29"
		},
		"cluster-4-10": {
			"uniprot": "136",
			"uniref90": "90",
			"uniref50": "18"
		},
		"cluster-6-1": {
			"uniprot": "17076",
			"uniref90": "7688",
			"uniref50": "904"
		},
		"cluster-6-2": {
			"uniprot": "3275",
			"uniref90": "1249",
			"uniref50": "85"
		},
		"cluster-6-3": {
			"uniprot": "945",
			"uniref90": "128",
			"uniref50": "25"
		},
		"cluster-6-4": {
			"uniprot": "132",
			"uniref90": "92",
			"uniref50": "8"
		}
	},
	"swissprot": {
		"cluster-4-1": [
		   "5-amino-6-(D-ribitylamino)uracil--L-tyrosine 4-hydroxyphenyl transferase",
		   "5-amino-6-(D-ribitylamino)uracil--L-tyrosine 4-hydroxyphenyl transferase ",
		   "5-amino-6-(D-ribitylamino)uracil--L-tyrosine 4-hydroxyphenyl transferase 1 ",
		   "5-amino-6-(D-ribitylamino)uracil--L-tyrosine 4-hydroxyphenyl transferase 2",
		   "7",
		   "8-didemethyl-8-hydroxy-5-deazariboflavin synthase",
		   "Aminodeoxyfutalosine synthase",
		   "Cyclic dehypoxanthine futalosine synthase",
		   "5-amino-6-(D-ribitylamino)uracil--L-tyrosine 4-hydroxyphenyl transferase",
		   "5-amino-6-(D-ribitylamino)uracil--L-tyrosine 4-hydroxyphenyl transferase ",
		   "5-amino-6-(D-ribitylamino)uracil--L-tyrosine 4-hydroxyphenyl transferase 1 ",
		   "5-amino-6-(D-ribitylamino)uracil--L-tyrosine 4-hydroxyphenyl transferase 2",
		   "7",
		   "8-didemethyl-8-hydroxy-5-deazariboflavin synthase",
		   "Aminodeoxyfutalosine synthase",
		   "Cyclic dehypoxanthine futalosine synthase"
		],
		"cluster-2-2": [
		   " anaerobic 1 ShortCoprogen oxidase ShortCoproporphyrinogenase",
		   " mitochondrial",
		   "Anaerobilin synthase",
		   "Coproporphyrinogen III oxidase",
		   "Heme chaperone HemW",
		   "Oxygen-independent coproporphyrinogen III oxidase ShortCPO",
		   "Oxygen-independent coproporphyrinogen-III oxidase-like protein HemZ",
		   "Putative heme chaperone HemW-like protein",
		   "Radical S-adenosyl methionine domain-containing protein 1",
		   " anaerobic 1 ShortCoprogen oxidase ShortCoproporphyrinogenase",
		   " mitochondrial",
		   "Anaerobilin synthase",
		   "Coproporphyrinogen III oxidase",
		   "Heme chaperone HemW",
		   "Oxygen-independent coproporphyrinogen III oxidase ShortCPO",
		   "Oxygen-independent coproporphyrinogen-III oxidase-like protein HemZ",
		   "Putative heme chaperone HemW-like protein",
		   "Radical S-adenosyl methionine domain-containing protein 1"
		],
		"cluster-4-4": [
		   "2-iminoacetate synthase",
		   "2-iminoacetate synthase"
		],
	}
};

