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
					"coords": [0, 0, 31.16, 100],
					"size": {
						"uniprot": 126746,
						"uniref90": 63952,
						"uniref50": 17454
					},
				},
				{
					"id": "cluster-2",
					"name": "Mega-2",
					"number": "1",
					"coords": [31.17, 0, 51.48, 72.29],
					"size": {
						"uniprot": 195361,
						"uniref90": 87965,
						"uniref50": 16527
					}
				},
				{
					"id": "cluster-3",
					"name": "Mega-3",
					"number": "3",
					"coords": [51.49, 0, 62.87, 33.76],
					"size": {
						"uniprot": 64748,
						"uniref90": 29059,
						"uniref50": 4220
					}
				},
				{
					"id": "cluster-4",
					"name": "Mega-4",
					"number": "4",
					"coords": [62.88, 0, 70.94, 31.93],
					"size": {
						"uniprot": 57217,
						"uniref90": 21267,
						"uniref50": 1752
					}
				},
				{
					"id": "cluster-5",
					"name": "5",
					"number": "5",
					"coords": [70.95, 0, 74.82, 12.11],
					"size": {
						"uniprot": 34653,
						"uniref90": 12125,
						"uniref50": 1255
					}
				},
				{
					"id": "cluster-6",
					"name": "Mega-6",
					"number": "7",
					"coords": [74.9, 0, 82.8, 32, 3],
					"size": {
						"uniprot": 20764,
						"uniref90": 9003,
						"uniref50": 1023
					}
				},
				{
					"id": "cluster-7",
					"name": "7",
					"number": "8",
					"coords": [82.81, 0, 85, 9],
					"size": {
						"uniprot": 14347,
						"uniref90": 6497,
						"uniref50": 539
					}
				},
				{
					"id": "cluster-8",
					"name": "8",
					"number": "6",
					"coords": [85.01, 0, 87.1, 9],
					"size": {
						"uniprot": 29854,
						"uniref90": 9219,
						"uniref50": 481
					}
				},
				{
					"id": "cluster-9",
					"name": "9",
					"number": "11",
					"coords": [87.11, 0, 89.3, 9],
					"size": {
						"uniprot": 2856,
						"uniref90": 1436,
						"uniref50": 251
					}
				},
				{
					"id": "cluster-10",
					"name": "10",
					"number": "9",
					"coords": [89.31, 0, 91.3, 9],
					"size": {
						"uniprot": 10488,
						"uniref90": 3262,
						"uniref50": 173
					}
				},
				{
					"id": "cluster-11",
					"name": "11",
					"number": "10",
					"coords": [91.31, 0, 93.5, 9],
					"size": {
						"uniprot": 7363,
						"uniref90": 2382,
						"uniref50": 136
					}
				},
				{
					"id": "cluster-12",
					"name": "12",
					"number": "13",
					"coords": [93.51, 0, 95.6, 9],
					"size": {
						"uniprot": 274,
						"uniref90": 133,
						"uniref50": 14
					}
				},
				{
					"id": "cluster-13",
					"name": "13",
					"number": "12",
					"coords": [95.61, 0, 97.4, 9],
					"size": {
						"uniprot": 500,
						"uniref90": 195,
						"uniref50": 12
					}
				},
				{
					"id": "cluster-14",
					"name": "14",
					"number": "14",
					"coords": [97.41, 0, 99, 9],
					"size": {
						"uniprot": 256,
						"uniref90": 148,
						"uniref50": 9
					}
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
		},
		"cluster-1-2": {
			"image": "cluster-1-2",
			"title": "Megacluster-1-2: SFLD Subgroup 3 / Viperin (No AISC)",
			"name": "Megacluster-1-2",
		},
		"cluster-1-3": {
			"image": "cluster-1-3",
			"title": "Megacluster-1-3: SFLD Subgroup 4 / Avilamycin synthase (C-Term AISC)",
			"name": "Megacluster-1-3",
		},
		"cluster-1-4": {
			"image": "cluster-1-4",
			"title": "Megacluster-1-4: SFLD Subgroup 7 / DesII-like (No AISC)",
			"name": "Megacluster-1-4",
		},
		"cluster-1-5": {
			"image": "cluster-1-5",
			"title": "Megacluster-1-5: SFLD Subgroup 10 / FeMo-cofactor biosynthesis protein (AISC)",
			"name": "Megacluster-1-5",
		},
		"cluster-1-6": {
			"image": "cluster-1-6",
			"title": "Megacluster-1-6: SFLD Subgroup 14 / Methyltransferase D (C-Term AISC)",
			"name": "Megacluster-1-6",
		},
		"cluster-1-7": {
			"image": "cluster-1-7",
			"title": "Megacluster-1-7: SFLD Subgroup 18 / 	Spectinomycin biosynthesis (AISC)",
			"name": "Megacluster-1-7",
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
					"coords": [0, 0, 34.5, 100],
					"size": {
						"uniprot": "52151",
						"uniref90": "31228",
						"uniref50": "9092"
					}
				},
				{
					"id": "cluster-2-2",
					"name": "2-2",
					"number": "2",
					"coords": [34.5, 0, 48.2, 39.5],
					"size": {
						"uniprot": "58106",
						"uniref90": "23335",
						"uniref50": "3319"
					}
				},
				{
					"id": "cluster-2-3",
					"name": "2-3",
					"number": "1",
					"coords": [48.2, 0, 70.1, 39.5],
					"size": {
						"uniprot": "74767",
						"uniref90": "28128",
						"uniref50": "2995"
					}
				},
				{
					"id": "cluster-2-4x",
					"name": "2-4",
					"number": "4",
					"coords": [70.1, 0, 79.1, 20.4],
					"size": {
						"uniprot": "16984",
						"uniref90": "6481",
						"uniref50": "923"
					}
				},
				{
					"id": "cluster-2-5",
					"name": "2-5",
					"number": "5",
					"coords": [79.1, 0, 87.5, 20.4],
					"size": {
						"uniprot": "1514",
						"uniref90": "800",
						"uniref50": "188"
					}
				}
			]
		},
		"cluster-2-1x": {
			"image": "cluster-2-1x",
			"title": "Megacluster-2-1: SFLD Subgroup 5 / B12-binding domain, sub-clusters",
			"name": "Megacluster-2-1",
			"regions": [
				{
					"id": "cluster-2-1x-1",
					"name": "2-1-1",
					"number": "1",
					"coords": [0, 0, 31, 100],
					"size": {
						"uniprot": "37151",
						"uniref90": "23391",
						"uniref50": "7736"
					}
				},
				{
					"id": "cluster-2-1x-2",
					"name": "2-1-2",
					"number": "2",
					"coords": [31, 0, 46.2, 21.2],
					"size": {
						"uniprot": "8213",
						"uniref90": "3972",
						"uniref50": "728"
					}
				},
				{
					"id": "cluster-2-1x-3",
					"name": "2-1-3",
					"number": "3",
					"coords": [46.2, 0, 52, 18.7],
					"size": {
						"uniprot": "3913",
						"uniref90": "2251",
						"uniref50": "324"
					}
				},
				{
					"id": "cluster-2-1x-4",
					"name": "2-1-4",
					"number": "5",
					"coords": [52, 0, 57, 18.7],
					"size": {
						"uniprot": "837",
						"uniref90": "445",
						"uniref50": "91"
					}
				},
				{
					"id": "cluster-2-1x-5",
					"name": "2-1-5",
					"number": "6",
					"coords": [57, 0, 63.4, 21.2],
					"size": {
						"uniprot": "668",
						"uniref90": "377",
						"uniref50": "78"
					}
				},
				{
					"id": "cluster-2-1x-6",
					"name": "2-1-6",
					"number": "4",
					"coords": [63.4, 0, 68.3, 16.4],
					"size": {
						"uniprot": "1119",
						"uniref90": "588",
						"uniref50": "54"
					}
				},
				{
					"id": "cluster-2-1x-7",
					"name": "2-1-7",
					"number": "9",
					"coords": [68.3, 0, 73.5, 16.4],
					"size": {
						"uniprot": "61",
						"uniref90": "47",
						"uniref50": "28"
					}
				},
				{
					"id": "cluster-2-1x-8",
					"name": "2-1-8",
					"number": "7",
					"coords": [73.5, 0, 77.9, 15.2],
					"size": {
						"uniprot": "81",
						"uniref90": "67",
						"uniref50": "18"
					}
				},
				{
					"id": "cluster-2-1x-9",
					"name": "2-1-9",
					"number": "8",
					"coords": [77.9, 0, 81.8, 14],
					"size": {
						"uniprot": "65",
						"uniref90": "52",
						"uniref50": "12"
					}
				},
				{
					"id": "cluster-2-1x-10",
					"name": "2-1-10",
					"number": "10",
					"coords": [81.8, 0, 85.5, 14],
					"size": {
						"uniprot": "18",
						"uniref90": "15",
						"uniref50": "10"
					}
				},
				{
					"id": "cluster-2-1x-11",
					"name": "2-1-11",
					"number": "13",
					"coords": [85.5, 0, 89.5, 14],
					"size": {
						"uniprot": "5",
						"uniref90": "5",
						"uniref50": "5"
					}
				},
				{
					"id": "cluster-2-1x-12",
					"name": "2-1-12",
					"number": "11",
					"coords": [89.5, 0, 92.7, 11],
					"size": {
						"uniprot": "10",
						"uniref90": "10",
						"uniref50": "3"
					}
				},
				{
					"id": "cluster-2-1x-13",
					"name": "2-1-13",
					"number": "12",
					"coords": [92.7, 0, 95.6, 8],
					"size": {
						"uniprot": "6",
						"uniref90": "5",
						"uniref50": "2"
					}
				},
				{
					"id": "cluster-2-1x-14",
					"name": "2-1-14",
					"number": "14",
					"coords": [95.6, 0, 97.2, 8],
					"size": {
						"uniprot": "2",
						"uniref90": "1",
						"uniref50": "1"
					}
				}
			]
		},
		"cluster-2-2": {
			"image": "cluster-2-2",
			"title": "Megacluster-2-2: SFLD Subgroup 2 / Oxygen-independent coproporphyinogen III oxidase-like",
			"name": "Megacluster-2-2",
		},
		"cluster-2-3": {
			"image": "cluster-2-3",
			"title": "Megacluster-2-3: SFLD Subgroup 12 / Methylthiotransferase",
			"name": "Megacluster-2-3",
		},
		"cluster-2-4": {
			"image": "cluster-2-4",
			"title": "Megacluster-2-4: SFLD Subgroup 8 / Elongator complex protein 3",
			"name": "Megacluster-2-4",
		},
		"cluster-2-4x": {
			"image": "cluster-2-4x",
			"title": "Megacluster-2-4: SFLD Subgroup 8 / Elongator complex protein 3, sub-clusters (AS24)",
			"name": "Megacluster-2-4",
			"regions": [
				{
					"id": "cluster-4-4-1",
					"name": "4-4-1",
					"number": "1",
					"coords": [0, 0, 25.6, 70.9],
					"size": {
						"uniprot": "0",
						"uniref90": "0",
						"uniref50": "0"
					}
				},
				{
					"id": "cluster-4-4-2",
					"name": "4-4-2",
					"number": "2",
					"coords": [25.6, 0, 66.7, 100],
					"size": {
						"uniprot": "0",
						"uniref90": "0",
						"uniref50": "0"
					}
				},
				{
					"id": "cluster-4-4-3",
					"name": "4-4-3",
					"number": "3",
					"coords": [66.7, 0, 93.6, 77.1],
					"size": {
						"uniprot": "0",
						"uniref90": "0",
						"uniref50": "0"
					}
				}
			]
		},
		"cluster-2-5": {
			"image": "cluster-2-5",
			"title": "Megacluster-2-5: SFLD Subgroup 8 / Elongator complex protein 3",
			"name": "Megacluster-2-5",
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
					"coords": [0, 0, 14, 76],
					"size": {
						"uniprot": "19948",
						"uniref90": "6541",
						"uniref50": "1230"
					}
				},
				{
					"id": "cluster-3-2",
					"name": "3-2",
					"number": "1",
					"coords": [14, 0, 24.5, 70],
					"size": {
						"uniprot": "21732",
						"uniref90": "8963",
						"uniref50": "762"
					}
				},
				{
					"id": "cluster-3-3",
					"name": "3-3",
					"number": "5",
					"coords": [24.5, 0, 42, 100],
					"size": {
						"uniprot": "4884",
						"uniref90": "2927",
						"uniref50": "719"
					}
				},
				{
					"id": "cluster-3-4",
					"name": "3-4",
					"number": "3",
					"coords": [42, 0, 55.5, 70],
					"size": {
						"uniprot": "7822",
						"uniref90": "5393",
						"uniref50": "686"
					}
				},
				{
					"id": "cluster-3-5",
					"name": "3-5",
					"number": "4",
					"coords": [55.5, 0, 70, 70],
					"size": {
						"uniprot": "6818",
						"uniref90": "2607",
						"uniref50": "445"
					}
				},
				{
					"id": "cluster-3-6",
					"name": "3-6",
					"number": "6",
					"coords": [70, 0, 78.3, 41],
					"size": {
						"uniprot": "4671",
						"uniref90": "2783",
						"uniref50": "340"
					}
				},
				{
					"id": "cluster-3-7",
					"name": "3-7",
					"number": "7",
					"coords": [78.3, 0, 83.8, 37],
					"size": {
						"uniprot": "482",
						"uniref90": "249",
						"uniref50": "29"
					}
				},
				{
					"id": "cluster-3-8",
					"name": "3-8",
					"number": "8",
					"coords": [83.8, 0, 87.9, 19],
					"size": {
						"uniprot": "17",
						"uniref90": "4",
						"uniref50": "3"
					}
				},
				{
					"id": "cluster-3-9",
					"name": "3-9",
					"number": "9",
					"coords": [87.9, 0, 92, 12],
					"size": {
						"uniprot": "17",
						"uniref90": "6",
						"uniref50": "2"
					}
				}
			]
		},
		"cluster-3-1": {
			"image": "cluster-3-1",
			"title": "Megacluster-3-1: SFLD Subgroup 15 / Organic radical activating enzymes",
			"name": "Megacluster-3-1",
		},
		"cluster-3-2": {
			"image": "cluster-3-2",
			"title": "Megacluster-3-2: SFLD Subgroup 11 / 7-Carboxyl-7-deazaguanine synthase-like",
			"name": "Megacluster-3-2",
		},
		"cluster-3-3": {
			"image": "cluster-3-3",
			"title": "Megacluster-3-3",
			"name": "Megacluster-3-3",
		},
		"cluster-3-4": {
			"image": "cluster-3-4",
			"title": "Megacluster-3-4",
			"name": "Megacluster-3-4",
		},
		"cluster-3-5": {
			"image": "cluster-3-5",
			"title": "Megacluster-3-5",
			"name": "Megacluster-3-5",
		},
		"cluster-3-6": {
			"image": "cluster-3-6",
			"title": "Megacluster-3-6",
			"name": "Megacluster-3-6",
		},
		"cluster-3-7": {
			"image": "cluster-3-7",
			"title": "Megacluster-3-7",
			"name": "Megacluster-3-7",
		},
		"cluster-3-8": {
			"image": "cluster-3-8",
			"title": "Megacluster-3-8",
			"name": "Megacluster-3-8",
		},
		"cluster-3-9": {
			"image": "cluster-3-9",
			"title": "Megacluster-3-9",
			"name": "Megacluster-3-9",
		},
		"cluster-4": {
			"image": "cluster-4",
			"title": "Megacluster-4",
			"name": "Megacluster-4",
			"regions": [
				{
					"id": "cluster-4-1",
					"name": "4-1",
					"number": "2",
					"coords": [0, 0, 11.7, 91.5],
					"size": {
						"uniprot": "17963",
						"uniref90": "7197",
						"uniref50": "424"
					}
				},
				{
					"id": "cluster-4-2",
					"name": "4-2",
					"number": "1",
					"coords": [11.7, 0, 22, 33],
					"size": {
						"uniprot": "23649",
						"uniref90": "7183",
						"uniref50": "404"
					}
				},
				{
					"id": "cluster-4-3",
					"name": "4-3",
					"number": "4",
					"coords": [22, 0, 32.1, 28],
					"size": {
						"uniprot": "3500",
						"uniref90": "1823",
						"uniref50": "231"
					}
				},
				{
					"id": "cluster-4-4",
					"name": "4-4",
					"number": "3",
					"coords": [32.1, 0, 43, 36],
					"size": {
						"uniprot": "9134",
						"uniref90": "3052",
						"uniref50": "181"
					}
				},
				{
					"id": "cluster-4-5",
					"name": "4-5",
					"number": "6",
					"coords": [43, 0, 56.5, 28],
					"size": {
						"uniprot": "814",
						"uniref90": "566",
						"uniref50": "163"
					}
				},
				{
					"id": "cluster-4-6",
					"name": "4-6",
					"number": "5",
					"coords": [56.5, 0, 69, 50],
					"size": {
						"uniprot": "2751",
						"uniref90": "986",
						"uniref50": "133"
					}
				},
				{
					"id": "cluster-4-7",
					"name": "4-7",
					"number": "7",
					"coords": [69, 0, 76.2, 24],
					"size": {
						"uniprot": "781",
						"uniref90": "519",
						"uniref50": "127"
					}
				},
				{
					"id": "cluster-4-8",
					"name": "4-8",
					"number": "8",
					"coords": [76.2, 0, 85.5, 27],
					"size": {
						"uniprot": "243",
						"uniref90": "170",
						"uniref50": "37"
					}
				},
				{
					"id": "cluster-4-9",
					"name": "4-9",
					"number": "9",
					"coords": [85.5, 0, 93.4, 31],
					"size": {
						"uniprot": "140",
						"uniref90": "95",
						"uniref50": "29"
					}
				},
				{
					"id": "cluster-4-10",
					"name": "4-10",
					"number": "10",
					"coords": [93.4, 0, 100, 22],
					"size": {
						"uniprot": "136",
						"uniref90": "90",
						"uniref50": "18"
					}
				}
			]
		},
		"cluster-4-1": {
			"image": "cluster-4-1",
			"title": "Megacluster-4-1",
			"name": "Megacluster-4-1",
		},
		"cluster-4-2": {
			"image": "cluster-4-2",
			"title": "Megacluster-4-2",
			"name": "Megacluster-4-2",
		},
		"cluster-4-3": {
			"image": "cluster-4-3",
			"title": "Megacluster-4-3",
			"name": "Megacluster-4-3",
		},
		"cluster-4-4": {
			"image": "cluster-4-4",
			"title": "Megacluster-4-4",
			"name": "Megacluster-4-4",
		},
		"cluster-4-5": {
			"image": "cluster-4-5",
			"title": "Megacluster-4-5",
			"name": "Megacluster-4-5",
		},
		"cluster-4-6": {
			"image": "cluster-4-6",
			"title": "Megacluster-4-6",
			"name": "Megacluster-4-6",
		},
		"cluster-4-7": {
			"image": "cluster-4-7",
			"title": "Megacluster-4-7",
			"name": "Megacluster-4-7",
		},
		"cluster-4-8": {
			"image": "cluster-4-8",
			"title": "Megacluster-4-8",
			"name": "Megacluster-4-8",
		},
		"cluster-4-9": {
			"image": "cluster-4-9",
			"title": "Megacluster-4-9",
			"name": "Megacluster-4-9",
		},
		"cluster-4-10": {
			"image": "cluster-4-10",
			"title": "Megacluster-4-10",
			"name": "Megacluster-4-10",
		},
		"cluster-5": {
			"image": "cluster-5",
			"title": "Cluster-5: SFLD Subgroup 13 / Methyltransferase Class A",
			"name": "Cluster-5",
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
					"coords": [0, 0, 52.8, 100],
					"size": {
						"uniprot": "17076",
						"uniref90": "7688",
						"uniref50": "904"
					}
				},
				{
					"id": "cluster-6-2",
					"name": "6-2",
					"number": "2",
					"coords": [52.8, 0, 66.5, 47],
					"size": {
						"uniprot": "3275",
						"uniref90": "1249",
						"uniref50": "85"
					}
				},
				{
					"id": "cluster-6-3",
					"name": "6-3",
					"number": "3",
					"coords": [66.5, 0, 82.3, 47],
					"size": {
						"uniprot": "945",
						"uniref90": "128",
						"uniref50": "25"
					}
				},
				{
					"id": "cluster-6-4",
					"name": "6-4",
					"number": "4",
					"coords": [82.3, 0, 96.3, 30],
					"size": {
						"uniprot": "132",
						"uniref90": "92",
						"uniref50": "8"
					}
				}
			]
		},
		"cluster-6-1": {
			"image": "cluster-6-1",
			"title": "Megacluster-6-1: SFLD Subgroup 19 / Subgroup 19 Spore photoproduct photolyse",
			"name": "Megacluster-6-1",
		},
		"cluster-6-2": {
			"image": "cluster-6-2",
			"title": "Megacluster-6-2",
			"name": "Megacluster-6-2",
		},
		"cluster-6-3": {
			"image": "cluster-6-3",
			"title": "Megacluster-6-3",
			"name": "Megacluster-6-3",
		},
		"cluster-6-4": {
			"image": "cluster-6-4",
			"title": "Megacluster-6-4",
			"name": "Megacluster-6-4",
		},
		"cluster-7": {
			"image": "cluster-7",
			"title": "cluster-7: SFLD Subgroup 16 / PLP-dependent aminotransferase",
			"name": "cluster-7",
		},
		"cluster-8": {
			"image": "cluster-8",
			"title": "Cluster-8: SFLD Subgroup 6 / Lipoyl synthase-like",
			"name": "Cluster-8",
		},
		"cluster-9": {
			"image": "cluster-9",
			"title": "Cluster-9: SFLD Subgroup 20 / tRNA wybutosine synthesizing",
			"name": "Cluster-9",
		},
		"cluster-10": {
			"image": "cluster-10",
			"title": "Cluster-10",
			"name": "Cluster-10",
		},
		"cluster-11": {
			"image": "cluster-11",
			"title": "Cluster-11",
			"name": "Cluster-11",
		},
		"cluster-12": {
			"image": "cluster-12",
			"title": "Cluster-12",
			"name": "Cluster-12",
		},
		"cluster-13": {
			"image": "cluster-13",
			"title": "Cluster-13",
			"name": "Cluster-13",
		},
		"cluster-14": {
			"image": "cluster-14",
			"title": "Cluster-14",
			"name": "Cluster-14",
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
		"cluster-4-4-1": {
			"uniprot": "0",
			"uniref90": "0",
			"uniref50": "0"
		},
		"cluster-4-4-2": {
			"uniprot": "0",
			"uniref90": "0",
			"uniref50": "0"
		},
		"cluster-4-4-3": {
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
	}
};

