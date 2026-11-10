// Option prices for the zome configurator (roofing, doors, lighting kits, furnishing styles). CAD, material/supply delivered
// to Clearwater / Wells Gray, researched 2026-11-04. src 'R' = based on a published listing or price range (urls in sources),
// 'A' = allowance. Concept figures, not quotes. Not yet added into costPlan(): the configurator applies them on top.
// Note: zome panels get shallower toward the crown and near-vertical at the base, so a sedum roof can only go on the upper rows.
export const OPTIONS = {
 "_meta": {
  "currency": "CAD",
  "date": "2026-11-04",
  "fx": "US prices converted at 1 USD = 1.38 CAD where noted",
  "basis": "Material/supply cost delivered to rural BC (Clearwater/Wells Gray); concept-model figures, not quotes. src R = based on a published listing/range, A = allowance."
 },
 "roofing": {
  "cedar": {
   "perM2": 108,
   "src": "R",
   "note": "#1 Blue Label 18in Perfection WRC, ~$200/bundle CAD (BC dealer Twin Creeks lists $185-210/bundle; it quotes $325 elsewhere), 25 sq ft = 2.32 m2 per bundle at 5.5in exposure -> $86/m2. +18% waste for cutting shingles to diamond/triangle panel edges -> $102, + breathable synthetic underlay ~$4/m2 + stainless ring-shank nails ~$2/m2. Ice-and-water at the base row is already in the model.",
   "installNote": "Pro or skilled carpenter; every panel edge is a hip that needs hand-cut, double-coursed shingles or a metal hip cap. Labour is roughly 1.5-2x the material on a zome.",
   "sources": [
    "https://www.twincreeksloghomes.com/en-ca/products/1-grade-18-inch-western-red-cedar-shingles",
    "https://www.rona.ca/en/product/perfection-western-red-cedar-shingles-18-42665000"
   ]
  },
  "standingSeamGraphite": {
   "perM2": 119,
   "src": "R",
   "note": "24/26 ga PVDF snap-lock panels ~CAD $6.5/sq ft = $70/m2 supply (US panel-only range $4-7/sq ft x1.38; BC installed $14-22/sq ft). +30% waste (every diamond needs tapered panels cut from full-width coil, triangles worse) -> $91, + clips/hip/eave trim ~$25/m2 (zomes are almost all hip trim) + high-temp synthetic underlay $3. Graphite/charcoal is a standard colour.",
   "installNote": "Pro sheet-metal installer required. Standing seam suits big rectangular planes; on small diamonds it is awkward and labour-heavy. Flat-lock diamond shingles are the more natural metal choice for a zome.",
   "sources": [
    "https://metalamerica.com/metal-roofing-cost/",
    "https://www.paragonroofingbc.ca/blog/metal-roof-cost-vancouver-2025-homeowner-guide",
    "https://wynkerbros.com/how-much-does-a-metal-roof-cost-in-british-columbia/",
    "https://www.westform.com/products"
   ]
  },
  "standingSeamZincGrey": {
   "perM2": 124,
   "src": "A",
   "note": "Same build-up as graphite; matte/metallic 'zinc grey' PVDF finishes usually carry a ~5-10% premium. Waste 30%.",
   "installNote": "Pro sheet-metal installer required (see graphite).",
   "sources": [
    "https://metalamerica.com/metal-roofing-cost/"
   ]
  },
  "standingSeamForestGreen": {
   "perM2": 119,
   "src": "R",
   "note": "Same build-up as graphite; forest green is a standard PVDF colour at Westform/Vicwest, no premium. Waste 30%.",
   "installNote": "Pro sheet-metal installer required (see graphite).",
   "sources": [
    "https://metalamerica.com/metal-roofing-cost/",
    "https://www.westform.com/products"
   ]
  },
  "steelDiamondShingle": {
   "perM2": 65,
   "src": "R",
   "note": "Bonus option: painted steel/aluminium diamond shingles US$2-5/sq ft (used US$3.5 x1.38 = CAD $4.83/sq ft = $52/m2), +12% waste, + cleats/underlay ~$7/m2. Cheapest metal look that suits diamond panels.",
   "installNote": "Skilled DIY or roofer; small units, simple to fit to panel shapes.",
   "sources": [
    "https://www.metalroofnet.com/metal-roofing-blog/metal-diamond-roofing-prices-styles"
   ]
  },
  "copperDiamond": {
   "perM2": 240,
   "src": "R",
   "note": "Copper shingles ~US$14/sq ft material (US guides: $11-21/sq ft) x1.38 = CAD $19.3/sq ft = $208/m2, +12% waste (diamonds tile diamond panels well; triangles and edges need cutting) + cleats/slip sheet/underlay ~$8/m2. US-price conversion at 1.38.",
   "installNote": "Specialist sheet-metal/coppersmith install, ~US$12/sq ft labour.",
   "sources": [
    "https://www.fowlerexteriors.com/blog/copper-roof-cost-square-feet/",
    "https://www.thisoldhouse.com/roofing/copper-roof-cost"
   ]
  },
  "zincDiamond": {
   "perM2": 190,
   "src": "A",
   "note": "Titanium-zinc (e.g. RHEINZINK) diamond/flat-lock tiles. No published retail; zinc work quoted at US$7-22/sq ft. Used ~US$11/sq ft material x1.38 = $163/m2, +12% waste + structured underlay/cleats $8/m2. Zinc needs a ventilated or structured underlay (no direct contact with cedar or wet substrates).",
   "installNote": "Specialist sheet-metal install; few installers in the BC interior, expect travel costs.",
   "sources": [
    "https://theroofingbrief.com/modern-metal-shingles/",
    "https://www.rheinzink.us/products/roofing/flat-lock-tiles/"
   ]
  },
  "sedum": {
   "perM2": 175,
   "src": "A",
   "note": "Pitched extensive system: pre-grown sedum mat ~$45/m2, 50-80 mm substrate $15, drainage/water-retention mat $15, root barrier $10, filter fabric $1, anti-shear retention (eave restraint profile + erosion grid/Georaster-type cells or battens fixed to the panel) ~$35/m2, plus a fully adhered waterproof membrane (EPDM or SBS) ~$35/m2 instead of shingles. +10% freight for live mats to rural BC. Canadian installed range is CAD $16-29/sq ft ($172-312/m2).",
   "installNote": "Green-roof specialist install. The panels must be engineered for 80-150 kg/m2 saturated load plus snow, and each diamond needs its own eave stop because substrate slides along each panel. Irrigation is needed in the first summer.",
   "sources": [
    "https://roofingcalculatorhq.com/en-ca/calculators/green-roof-cost-calculator/",
    "https://www.sempergreen.com/us/product/green-roofs/pitched-green-roofs/",
    "https://stormwater.pca.state.mn.us/design_criteria_for_green_roofs",
    "https://zinco-usa.com/sites/default/files/2019-05/ZinCo_Sloped_Green_Roofs.pdf",
    "https://www.nlsm.ca/products/terraext-sedum-standard/"
   ]
  },
  "_baseline": {
   "asphaltShinglesPerM2": 13.6,
   "iceWaterPerM2": 4.7,
   "note": "Existing model values, for comparison. All perM2 figures above are material (supply) delivered to rural BC, per m2 of panel surface, CAD."
  }
 },
 "doors": {
  "paintedSingle": {
   "price": 800,
   "src": "R",
   "unit": "each",
   "note": "Full-lite painted steel or fibreglass, 36x80 prehung. Masonite full-lite primed steel is $549 at Home Depot Canada; smooth fibreglass full-lite is ~$900-1,100. Used $700 door + $100 lockset/paint. Cheaper than the model's $950.",
   "installNote": "Carpenter install ~3-4 h; the zome door frame/portal is the real cost.",
   "sources": [
    "https://www.homedepot.ca/en/home/categories/windows-and-doors/exterior-doors/front-doors.html"
   ]
  },
  "paintedPair": {
   "price": 2000,
   "src": "R",
   "unit": "pair",
   "note": "72x80 painted fibreglass double French door, prehung: US$1,329.99 at Home Depot US x1.38 = CAD $1,835, + hardware $150.",
   "installNote": "Carpenter install, 1 day.",
   "sources": [
    "https://www.homedepot.com/b/Doors-Windows-Exterior-Doors-Front-Doors-Fiberglass-Doors/60-x-80/N-5yc1vZc94bZ1z1pnid"
   ]
  },
  "oakSingle": {
   "price": 2900,
   "src": "A",
   "unit": "each",
   "note": "Full-lite solid oak, insulated glass, prehung. No oak full-lite listed in Canada; Krosswood solid fir/alder prehung singles at Home Depot Canada are $2,646-3,840. Used $2,750 + $150 hardware. Needs finishing.",
   "installNote": "Carpenter install; needs site finishing (stain/varnish) and re-coating every few years.",
   "sources": [
    "https://www.homedepot.ca/en/home/categories/windows-and-doors/exterior-doors/front-doors/wood-doors.html"
   ]
  },
  "oakPair": {
   "price": 5600,
   "src": "A",
   "unit": "pair",
   "note": "Double full-lite oak, ~64x80. Krosswood 64in units at Home Depot Canada are ~$5,115; used $5,400 + $200 hardware.",
   "installNote": "Carpenter install, 1 day + finishing.",
   "sources": [
    "https://www.homedepot.ca/en/home/categories/windows-and-doors/exterior-doors/front-doors/wood-doors.html"
   ]
  },
  "blackFrameSingle": {
   "price": 2000,
   "src": "R",
   "unit": "each",
   "note": "Slim matte-black metal-frame full-glass prehung (Manux-type) US$1,399 x1.38 = $1,931. A thermally broken European aluminium door (e.g. Domadeco) runs $3,500-6,000. A budget look-alike: Dusco prefinished-black steel lite door $598 at Home Depot Canada.",
   "installNote": "Carpenter install; heavy glass, 2 people.",
   "sources": [
    "https://www.homedepot.com/b/Doors-Windows-Exterior-Doors-Front-Doors-Steel-Doors/Black/N-5yc1vZc945Z1z0vm5i",
    "https://www.homedepot.ca/en/home/categories/windows-and-doors/exterior-doors/front-doors.html",
    "https://domadeco.ca/gutenberg.html"
   ]
  },
  "blackFramePair": {
   "price": 3900,
   "src": "A",
   "unit": "pair",
   "note": "Double slim black-frame full-glass door, ~1.95x the single.",
   "installNote": "Carpenter install, 1 day.",
   "sources": [
    "https://www.homedepot.com/b/Doors-Windows-Exterior-Doors-Front-Doors-Steel-Doors/Black/N-5yc1vZc945Z1z0vm5i"
   ]
  },
  "deckPerM2": {
   "price": 95,
   "src": "A",
   "unit": "m2",
   "note": "Extra entry deck, material only: 5/4x6 PT decking ~$27/m2, 2x8 PT joists @16in + rim ~$22/m2, beam/posts ~$15/m2, share of footings (precast blocks or sonotube + concrete) ~$15/m2, joist hangers/screws/flashing tape ~$10/m2, + rural delivery. No railing or stairs. US DIY materials guides say US$10-25/sq ft, but that includes railings and stairs.",
   "installNote": "DIY-able; contractor labour typically adds $150-250/m2.",
   "sources": [
    "https://remodelcalculators.com/deck-cost",
    "https://www.simplywise.com/blog/cost-to-build-deck/",
    "https://www.decks.com/calculators/cost-to-build-a-deck/"
   ]
  },
  "_baseline": {
   "fullLiteExterior": 950,
   "doublePatio": 2100
  }
 },
 "lighting": {
  "units": {
   "fairySwagPer10m": {
    "price": 16,
    "unit": "10 m",
    "src": "R",
    "note": "IKEA STRÅLA outdoor LED string 20 m $31.99; GETKÅL 15 m $15.19.",
    "sources": [
     "https://www.ikea.com/ca/en/p/strala-led-string-lights-outdoor-black-30635284/",
     "https://www.ikea.com/ca/en/p/getkal-led-string-lights-outdoor-00610058/"
    ]
   },
   "swagTransformerTimer": {
    "price": 15,
    "unit": "each",
    "src": "A",
    "note": "Plug-in timer/extension per swag circuit.",
    "sources": []
   },
   "strutLedTunablePerM": {
    "price": 15,
    "unit": "m",
    "src": "R",
    "note": "24V CCT COB tape 2700-6500K; US$12-60 per 5 m (Woody Walls $65/5 m, Armacost $59.99/5 m) -> ~CAD $15/m mid-grade.",
    "sources": [
     "https://woodywalls.com/product/tunable-white-cob-led-strip/",
     "https://www.armacostlighting.com/products/cct-white-led-cob-tape",
     "https://www.superbrightleds.com/stw-b-h90-o32d-10y5m-24v"
    ]
   },
   "strutLedRgbPerM": {
    "price": 14,
    "unit": "m",
    "src": "A",
    "note": "24V RGB COB tape; RGBCCT (RGB + tunable white) would be ~$20/m.",
    "sources": [
     "https://www.amazon.com/24v-rgb-led-strip/s?k=24v+rgb+led+strip"
    ]
   },
   "opalChannelPerM": {
    "price": 6,
    "unit": "m",
    "src": "A",
    "note": "1 m aluminium U/V channel with milky (opal) diffuser, end caps, clips, sold in 10-packs on Amazon.ca (Muzata U1SW etc.). Architectural channel (Klus) is $15-25/m.",
    "sources": [
     "https://www.amazon.ca/led-aluminum-channel-system/s?k=led+aluminum+channel+system"
    ]
   },
   "driverController": {
    "price": 90,
    "unit": "each",
    "src": "A",
    "note": "24V 150 W PSU (~$45) + Wi-Fi CCT/RGB controller (~$35; LEDSupply 5-in-1 US$24.99). One set per 12 m of ~10 W/m COB.",
    "sources": [
     "https://www.ledsupply.com/led-strips/tunable-white-cob-led-strip-lights"
    ]
   },
   "coveLightPerM": {
    "price": 21,
    "unit": "m",
    "src": "A",
    "note": "Base-ring cove = tunable COB $15/m + opal channel $6/m; drivers extra.",
    "sources": []
   },
   "pendantRattan": {
    "price": 80,
    "unit": "each",
    "src": "R",
    "note": "IKEA NARRKOLV rattan 56 cm $79.99 (sale $63.99); KAPPELAND/HAVSDJUP $55.99-69.99.",
    "sources": [
     "https://www.ikea.com/ca/en/p/narrkolv-pendant-lamp-rattan-10595868/",
     "https://www.ikea.com/ca/en/cat/pendants-18751/"
    ]
   },
   "pendantPaper": {
    "price": 32,
    "unit": "each",
    "src": "R",
    "note": "IKEA RISBYN/HAVSDJUP onion paper pendant $31.99 (shade + cord set).",
    "sources": [
     "https://www.ikea.com/ca/en/p/risbyn-havsdjup-pendant-lamp-onion-shape-white-s49618208/"
    ]
   },
   "pendantLinen": {
    "price": 64,
    "unit": "each",
    "src": "R",
    "note": "IKEA STOCKHOLM 2025 white textile pendant $63.99.",
    "sources": [
     "https://www.ikea.com/ca/en/p/stockholm-2025-pendant-lamp-white-textile-brass-plated-20585996/"
    ]
   },
   "pendantOpalGlass": {
    "price": 79,
    "unit": "each",
    "src": "R",
    "note": "IKEA AKTERSPRING opal white glass 73 cm $79; MUDDERVERK opal $47.99.",
    "sources": [
     "https://www.ikea.com/ca/en/p/akterspring-pendant-lamp-opal-white-glass-brass-plated-00591644/",
     "https://www.ikea.com/ca/en/p/mudderverk-pendant-lamp-brass-opal-white-glass-80577700/"
    ]
   },
   "pendantCluster": {
    "price": 119,
    "unit": "each",
    "src": "R",
    "note": "IKEA HÖGVIND 3-lamp cluster $119; KRANSALG 5-light $63.99.",
    "sources": [
     "https://www.ikea.com/ca/en/p/hoegvind-pendant-lamp-with-3-lamps-nickel-plated-gray-glass-50499266/",
     "https://www.ikea.com/ca/en/p/kransalg-pendant-lamp-with-5-lights-black-10595849/"
    ]
   },
   "ringTrackSpot": {
    "price": 30,
    "unit": "each",
    "src": "A",
    "note": "Per spot incl. share of a curved/flexible monorail ring around the apex hub. IKEA straight track is only $8-13/spot (SKURUP 3-spot $23.99, BÄVE 5-spot $63.99), but a curved ring needs a flexible rail system.",
    "sources": [
     "https://www.ikea.com/ca/en/p/baeve-led-ceiling-track-5-spots-white-00399735/",
     "https://www.ikea.com/ca/en/p/skurup-ceiling-track-3-spotlights-black-10395930/"
    ]
   },
   "strutSconce": {
    "price": 32,
    "unit": "each",
    "src": "R",
    "note": "IKEA MÅNALG sedge wall lamp $31.99; SKURUP $15.99; AKTERSPRING hardwired opal $21.99.",
    "sources": [
     "https://www.ikea.com/ca/en/p/manalg-wall-lamp-sedge-handmade-00505712/",
     "https://www.ikea.com/ca/en/p/akterspring-wall-lamp-hardwire-installation-opal-white-glass-brass-plated-30618821/"
    ]
   },
   "apexLight": {
    "price": 160,
    "unit": "each",
    "src": "R",
    "note": "Statement apex pendant: IKEA STOCKHOLM 2025 glass 54 cm $159; VARMBLIXT smart LED pendant $190.",
    "sources": [
     "https://www.ikea.com/ca/en/p/stockholm-2025-pendant-lamp-glass-brass-plated-20585958/",
     "https://www.ikea.com/ca/en/p/varmblixt-led-pendant-lamp-dimmable-smart-white-glass-white-spectrum-80625367/"
    ]
   },
   "netFairy": {
    "price": 35,
    "unit": "each",
    "src": "A",
    "note": "LED net light ~3x2 m, warm white, plug-in.",
    "sources": []
   },
   "doorLantern": {
    "price": 90,
    "unit": "each",
    "src": "R",
    "note": "Dark-sky black wall lantern: IKEA BÄCKFRÄNE outdoor hardwired $47.99; Home Depot US dark-sky lanterns US$69.97-199.99.",
    "sources": [
     "https://www.ikea.com/ca/en/p/baeckfraene-wall-lamp-hardwire-installation-outdoor-black-10555990/",
     "https://www.homedepot.com/b/Lighting-Outdoor-Lighting/Dark-Sky/N-5yc1vZc7qvZ1z0u5mk"
    ]
   },
   "pathBollard": {
    "price": 55,
    "unit": "each",
    "src": "R",
    "note": "Hampton Bay Helena low-voltage LED bollard US$39.97 x1.38.",
    "sources": [
     "https://www.homedepot.com/p/Hampton-Bay-Helena-19-Lumen-Black-Integrated-LED-Round-Low-Voltage-Outdoor-Landscape-Path-Bollard-Light-ISV1801L-3/206265494"
    ]
   },
   "lowVoltageTransformer": {
    "price": 90,
    "unit": "each",
    "src": "A",
    "note": "120 W LV landscape transformer with timer/photocell, shared by bollards + uplights; plus LV cable.",
    "sources": []
   },
   "festoonPer10m": {
    "price": 27,
    "unit": "10 m",
    "src": "R",
    "note": "Feit 48 ft (14.6 m) commercial LED string $39.99 at Costco (Calgary listing, CAD). IKEA SVARTRÅ 20-bulb $47.99.",
    "sources": [
     "https://www.instagram.com/reel/DIpXrSbzJ5U/",
     "https://www.costco.com/p/-/feit-48-led-string-light/4000385994",
     "https://www.ikea.com/ca/en/p/svartra-led-string-light-with-20-bulbs-outdoor-black-40611536/"
    ]
   },
   "baseUplight": {
    "price": 35,
    "unit": "each",
    "src": "A",
    "note": "Low-voltage LED spike uplight, warm white.",
    "sources": []
   },
   "treeStringPerTree": {
    "price": 55,
    "unit": "each",
    "src": "R",
    "note": "~30 m of outdoor fairy string per mid-size tree (1.5x IKEA STRÅLA 20 m $31.99) + outdoor extension/timer.",
    "sources": [
     "https://www.ikea.com/ca/en/p/strala-led-string-lights-outdoor-black-30635284/"
    ]
   },
   "fireBowl": {
    "price": 400,
    "unit": "each",
    "src": "R",
    "note": "Steel wood-burning round fire pit/bowl $398 at Home Depot Canada; Canadian Tire fire columns from ~$100. Check local fire bans and clearances.",
    "sources": [
     "https://www.homedepot.ca/en/home/categories/outdoors/patio-furniture/outdoor-heating/outdoor-fire-pits.html",
     "https://www.canadiantire.ca/en/cat/outdoor-living/outdoor-heating/firepits-fire-bowls-DC0001552.html"
    ]
   }
  },
  "kits": {
   "acorn": {
    "_geometry": {
     "diameterM": 3.0,
     "strutsAssumed": 70,
     "strutLenM": 1.2,
     "allStrutMetres": 84,
     "mainRibs": 7,
     "mainRibMetres": 18,
     "note": "main ribs = one helical strut chain per symmetry sector, base to apex, ~0.86 x D each"
    },
    "fairySwags": {
     "qty": {
      "swags": 7,
      "metres": 23,
      "per10mUnits": 3,
      "timers": 1
     },
     "total": 63
    },
    "strutLedTunableRibs": {
     "qty": {
      "stripM": 18,
      "channelM": 18,
      "driverController": 2
     },
     "total": 558
    },
    "strutLedTunableAllStruts": {
     "qty": {
      "stripM": 84,
      "channelM": 84,
      "driverController": 7
     },
     "total": 2394
    },
    "strutLedRgbRibs": {
     "qty": {
      "stripM": 18,
      "channelM": 18,
      "driverController": 2
     },
     "total": 540
    },
    "strutLedRgbAllStruts": {
     "qty": {
      "stripM": 84,
      "channelM": 84,
      "driverController": 7
     },
     "total": 2310
    },
    "baseCove": {
     "qty": {
      "coveM": 9,
      "driverController": 1
     },
     "total": 279
    },
    "pendantsRattan": {
     "qty": {
      "pendants": 2
     },
     "total": 160
    },
    "pendantsPaper": {
     "qty": {
      "pendants": 2
     },
     "total": 64
    },
    "pendantsLinen": {
     "qty": {
      "pendants": 2
     },
     "total": 128
    },
    "pendantsOpalGlass": {
     "qty": {
      "pendants": 2
     },
     "total": 158
    },
    "pendantsCluster": {
     "qty": {
      "clusters": 1
     },
     "total": 119
    },
    "ringTrackSpots": {
     "qty": {
      "spots": 4
     },
     "total": 120
    },
    "strutSconces": {
     "qty": {
      "sconces": 3
     },
     "total": 96
    },
    "apexLight": {
     "qty": {
      "apex": 1
     },
     "total": 160
    },
    "netFairyLights": {
     "qty": {
      "nets": 2
     },
     "total": 70
    },
    "doorLantern": {
     "qty": {
      "lanterns": 1,
      "noteForPairDoors": "use 2"
     },
     "total": 90
    },
    "pathBollards": {
     "qty": {
      "bollards": 4,
      "lvTransformer": 1
     },
     "total": 310
    },
    "deckFestoon": {
     "qty": {
      "metres": 10,
      "per10mUnits": 1
     },
     "total": 27
    },
    "baseUplights": {
     "qty": {
      "uplights": 3,
      "note": "shares bollard transformer"
     },
     "total": 105
    },
    "treeLights": {
     "qty": {
      "trees": 1
     },
     "total": 55
    },
    "fireBowl": {
     "qty": {
      "fireBowl": 1
     },
     "total": 400
    }
   },
   "z5": {
    "_geometry": {
     "diameterM": 5.0,
     "strutsAssumed": 100,
     "strutLenM": 1.5,
     "allStrutMetres": 150,
     "mainRibs": 10,
     "mainRibMetres": 43,
     "note": "main ribs = one helical strut chain per symmetry sector, base to apex, ~0.86 x D each"
    },
    "fairySwags": {
     "qty": {
      "swags": 10,
      "metres": 56,
      "per10mUnits": 6,
      "timers": 1
     },
     "total": 111
    },
    "strutLedTunableRibs": {
     "qty": {
      "stripM": 43,
      "channelM": 43,
      "driverController": 4
     },
     "total": 1263
    },
    "strutLedTunableAllStruts": {
     "qty": {
      "stripM": 150,
      "channelM": 150,
      "driverController": 13
     },
     "total": 4320
    },
    "strutLedRgbRibs": {
     "qty": {
      "stripM": 43,
      "channelM": 43,
      "driverController": 4
     },
     "total": 1220
    },
    "strutLedRgbAllStruts": {
     "qty": {
      "stripM": 150,
      "channelM": 150,
      "driverController": 13
     },
     "total": 4170
    },
    "baseCove": {
     "qty": {
      "coveM": 16,
      "driverController": 2
     },
     "total": 516
    },
    "pendantsRattan": {
     "qty": {
      "pendants": 3
     },
     "total": 240
    },
    "pendantsPaper": {
     "qty": {
      "pendants": 3
     },
     "total": 96
    },
    "pendantsLinen": {
     "qty": {
      "pendants": 3
     },
     "total": 192
    },
    "pendantsOpalGlass": {
     "qty": {
      "pendants": 3
     },
     "total": 237
    },
    "pendantsCluster": {
     "qty": {
      "clusters": 1
     },
     "total": 119
    },
    "ringTrackSpots": {
     "qty": {
      "spots": 6
     },
     "total": 180
    },
    "strutSconces": {
     "qty": {
      "sconces": 5
     },
     "total": 160
    },
    "apexLight": {
     "qty": {
      "apex": 1
     },
     "total": 160
    },
    "netFairyLights": {
     "qty": {
      "nets": 3
     },
     "total": 105
    },
    "doorLantern": {
     "qty": {
      "lanterns": 1,
      "noteForPairDoors": "use 2"
     },
     "total": 90
    },
    "pathBollards": {
     "qty": {
      "bollards": 6,
      "lvTransformer": 1
     },
     "total": 420
    },
    "deckFestoon": {
     "qty": {
      "metres": 15,
      "per10mUnits": 2
     },
     "total": 54
    },
    "baseUplights": {
     "qty": {
      "uplights": 5,
      "note": "shares bollard transformer"
     },
     "total": 175
    },
    "treeLights": {
     "qty": {
      "trees": 2
     },
     "total": 110
    },
    "fireBowl": {
     "qty": {
      "fireBowl": 1
     },
     "total": 400
    }
   },
   "z6": {
    "_geometry": {
     "diameterM": 6.0,
     "strutsAssumed": 110,
     "strutLenM": 1.7,
     "allStrutMetres": 187,
     "mainRibs": 10,
     "mainRibMetres": 52,
     "note": "main ribs = one helical strut chain per symmetry sector, base to apex, ~0.86 x D each"
    },
    "fairySwags": {
     "qty": {
      "swags": 10,
      "metres": 67,
      "per10mUnits": 7,
      "timers": 1
     },
     "total": 127
    },
    "strutLedTunableRibs": {
     "qty": {
      "stripM": 52,
      "channelM": 52,
      "driverController": 5
     },
     "total": 1542
    },
    "strutLedTunableAllStruts": {
     "qty": {
      "stripM": 187,
      "channelM": 187,
      "driverController": 16
     },
     "total": 5367
    },
    "strutLedRgbRibs": {
     "qty": {
      "stripM": 52,
      "channelM": 52,
      "driverController": 5
     },
     "total": 1490
    },
    "strutLedRgbAllStruts": {
     "qty": {
      "stripM": 187,
      "channelM": 187,
      "driverController": 16
     },
     "total": 5180
    },
    "baseCove": {
     "qty": {
      "coveM": 19,
      "driverController": 2
     },
     "total": 579
    },
    "pendantsRattan": {
     "qty": {
      "pendants": 4
     },
     "total": 320
    },
    "pendantsPaper": {
     "qty": {
      "pendants": 4
     },
     "total": 128
    },
    "pendantsLinen": {
     "qty": {
      "pendants": 4
     },
     "total": 256
    },
    "pendantsOpalGlass": {
     "qty": {
      "pendants": 4
     },
     "total": 316
    },
    "pendantsCluster": {
     "qty": {
      "clusters": 2
     },
     "total": 238
    },
    "ringTrackSpots": {
     "qty": {
      "spots": 8
     },
     "total": 240
    },
    "strutSconces": {
     "qty": {
      "sconces": 6
     },
     "total": 192
    },
    "apexLight": {
     "qty": {
      "apex": 1
     },
     "total": 160
    },
    "netFairyLights": {
     "qty": {
      "nets": 4
     },
     "total": 140
    },
    "doorLantern": {
     "qty": {
      "lanterns": 1,
      "noteForPairDoors": "use 2"
     },
     "total": 90
    },
    "pathBollards": {
     "qty": {
      "bollards": 6,
      "lvTransformer": 1
     },
     "total": 420
    },
    "deckFestoon": {
     "qty": {
      "metres": 20,
      "per10mUnits": 2
     },
     "total": 54
    },
    "baseUplights": {
     "qty": {
      "uplights": 6,
      "note": "shares bollard transformer"
     },
     "total": 210
    },
    "treeLights": {
     "qty": {
      "trees": 2
     },
     "total": 110
    },
    "fireBowl": {
     "qty": {
      "fireBowl": 1
     },
     "total": 400
    }
   },
   "z75": {
    "_geometry": {
     "diameterM": 7.5,
     "strutsAssumed": 130,
     "strutLenM": 2.0,
     "allStrutMetres": 260,
     "mainRibs": 10,
     "mainRibMetres": 64,
     "note": "main ribs = one helical strut chain per symmetry sector, base to apex, ~0.86 x D each"
    },
    "fairySwags": {
     "qty": {
      "swags": 10,
      "metres": 84,
      "per10mUnits": 9,
      "timers": 1
     },
     "total": 159
    },
    "strutLedTunableRibs": {
     "qty": {
      "stripM": 64,
      "channelM": 64,
      "driverController": 6
     },
     "total": 1884
    },
    "strutLedTunableAllStruts": {
     "qty": {
      "stripM": 260,
      "channelM": 260,
      "driverController": 22
     },
     "total": 7440
    },
    "strutLedRgbRibs": {
     "qty": {
      "stripM": 64,
      "channelM": 64,
      "driverController": 6
     },
     "total": 1820
    },
    "strutLedRgbAllStruts": {
     "qty": {
      "stripM": 260,
      "channelM": 260,
      "driverController": 22
     },
     "total": 7180
    },
    "baseCove": {
     "qty": {
      "coveM": 24,
      "driverController": 2
     },
     "total": 684
    },
    "pendantsRattan": {
     "qty": {
      "pendants": 5
     },
     "total": 400
    },
    "pendantsPaper": {
     "qty": {
      "pendants": 5
     },
     "total": 160
    },
    "pendantsLinen": {
     "qty": {
      "pendants": 5
     },
     "total": 320
    },
    "pendantsOpalGlass": {
     "qty": {
      "pendants": 5
     },
     "total": 395
    },
    "pendantsCluster": {
     "qty": {
      "clusters": 2
     },
     "total": 238
    },
    "ringTrackSpots": {
     "qty": {
      "spots": 10
     },
     "total": 300
    },
    "strutSconces": {
     "qty": {
      "sconces": 8
     },
     "total": 256
    },
    "apexLight": {
     "qty": {
      "apex": 1
     },
     "total": 160
    },
    "netFairyLights": {
     "qty": {
      "nets": 5
     },
     "total": 175
    },
    "doorLantern": {
     "qty": {
      "lanterns": 1,
      "noteForPairDoors": "use 2"
     },
     "total": 90
    },
    "pathBollards": {
     "qty": {
      "bollards": 8,
      "lvTransformer": 1
     },
     "total": 530
    },
    "deckFestoon": {
     "qty": {
      "metres": 25,
      "per10mUnits": 3
     },
     "total": 81
    },
    "baseUplights": {
     "qty": {
      "uplights": 7,
      "note": "shares bollard transformer"
     },
     "total": 245
    },
    "treeLights": {
     "qty": {
      "trees": 3
     },
     "total": 165
    },
    "fireBowl": {
     "qty": {
      "fireBowl": 1
     },
     "total": 400
    }
   },
   "z9": {
    "_geometry": {
     "diameterM": 9.0,
     "strutsAssumed": 150,
     "strutLenM": 2.4,
     "allStrutMetres": 360,
     "mainRibs": 12,
     "mainRibMetres": 93,
     "note": "main ribs = one helical strut chain per symmetry sector, base to apex, ~0.86 x D each"
    },
    "fairySwags": {
     "qty": {
      "swags": 12,
      "metres": 121,
      "per10mUnits": 13,
      "timers": 1
     },
     "total": 223
    },
    "strutLedTunableRibs": {
     "qty": {
      "stripM": 93,
      "channelM": 93,
      "driverController": 8
     },
     "total": 2673
    },
    "strutLedTunableAllStruts": {
     "qty": {
      "stripM": 360,
      "channelM": 360,
      "driverController": 30
     },
     "total": 10260
    },
    "strutLedRgbRibs": {
     "qty": {
      "stripM": 93,
      "channelM": 93,
      "driverController": 8
     },
     "total": 2580
    },
    "strutLedRgbAllStruts": {
     "qty": {
      "stripM": 360,
      "channelM": 360,
      "driverController": 30
     },
     "total": 9900
    },
    "baseCove": {
     "qty": {
      "coveM": 28,
      "driverController": 3
     },
     "total": 858
    },
    "pendantsRattan": {
     "qty": {
      "pendants": 6
     },
     "total": 480
    },
    "pendantsPaper": {
     "qty": {
      "pendants": 6
     },
     "total": 192
    },
    "pendantsLinen": {
     "qty": {
      "pendants": 6
     },
     "total": 384
    },
    "pendantsOpalGlass": {
     "qty": {
      "pendants": 6
     },
     "total": 474
    },
    "pendantsCluster": {
     "qty": {
      "clusters": 3
     },
     "total": 357
    },
    "ringTrackSpots": {
     "qty": {
      "spots": 12
     },
     "total": 360
    },
    "strutSconces": {
     "qty": {
      "sconces": 10
     },
     "total": 320
    },
    "apexLight": {
     "qty": {
      "apex": 1
     },
     "total": 160
    },
    "netFairyLights": {
     "qty": {
      "nets": 6
     },
     "total": 210
    },
    "doorLantern": {
     "qty": {
      "lanterns": 1,
      "noteForPairDoors": "use 2"
     },
     "total": 90
    },
    "pathBollards": {
     "qty": {
      "bollards": 10,
      "lvTransformer": 1
     },
     "total": 640
    },
    "deckFestoon": {
     "qty": {
      "metres": 30,
      "per10mUnits": 3
     },
     "total": 81
    },
    "baseUplights": {
     "qty": {
      "uplights": 8,
      "note": "shares bollard transformer"
     },
     "total": 280
    },
    "treeLights": {
     "qty": {
      "trees": 4
     },
     "total": 220
    },
    "fireBowl": {
     "qty": {
      "fireBowl": 1
     },
     "total": 400
    }
   }
  },
  "_kitNotes": "Kits are material only. Strut LED totals include tape + opal channel + one 24V driver/controller per 12 m. Hardwired fixtures (pendants, sconces, track, lantern) need an electrician; plug-in strings and LV landscape lights are DIY."
 },
 "styles": {
  "_baseline": {
   "queenBed": 1050,
   "sofa": 749,
   "sofaBed": 1099,
   "armchair": 399,
   "chair": 80,
   "coffeeTable": 170,
   "roundTable": 350,
   "desk": 480,
   "bookshelf": 200,
   "wardrobe": 600,
   "rug": 250,
   "note": "Multipliers apply to these. They assume style-true pieces from mid-to-upper Canadian retailers (Structube, Article, EQ3, West Elm, Simons, Crate & Barrel), not designer or custom pieces. Lighting/decor multipliers apply to loose decor, not the lighting kits above."
  },
  "bohemian": {
   "beds": 1.0,
   "seating": 1.0,
   "tables": 1.1,
   "storage": 1.05,
   "textiles": 1.35,
   "decor": 1.25,
   "note": "Furniture prices sit at baseline (Structube/IKEA rattan); the cost is in layered rugs, throws, cushions, plants and rattan lights.",
   "examples": [
    {
     "item": "Structube queen upholstered/wood bed",
     "price": 599,
     "url": "https://www.structube.com/en_ca/furniture/bedroom/beds"
    },
    {
     "item": "Structube Teresa 3-seater sofa",
     "price": 749,
     "url": "https://www.structube.com/en_ca/teresa-contemporary-3seater-sofa-31-76-64?pid=23560"
    },
    {
     "item": "Simons plain pure wool handcrafted rug, from",
     "price": 279,
     "url": "https://www.simons.ca/en/rugs/area-rugs/up-to-9-x-12/plain-pure-wool-handcrafted-rug-see-available-sizes--15674-25202055"
    },
    {
     "item": "IKEA NARRKOLV rattan pendant 56 cm",
     "price": 79.99,
     "url": "https://www.ikea.com/ca/en/p/narrkolv-pendant-lamp-rattan-10595868/"
    }
   ]
  },
  "modernContemporary": {
   "beds": 1.4,
   "seating": 1.8,
   "tables": 1.5,
   "storage": 1.4,
   "textiles": 1.3,
   "decor": 1.4,
   "examples": [
    {
     "item": "Structube Charlie modern contemporary sofa",
     "price": 1399,
     "url": "https://www.structube.com/en_ca/charlie-modern-contemporary-sofa-36-66-93?pid=53487"
    },
    {
     "item": "Article Timber 90in sofa (price as shown on article.com; may be USD)",
     "price": 1299,
     "url": "https://www.article.com/product/24178/sven-88-tufted-leather-sofa-charme-tan"
    },
    {
     "item": "EQ3 Cello sectional, from (CAD)",
     "price": 2799,
     "url": "https://www.eq3.com/collections/cello"
    }
   ]
  },
  "japandi": {
   "beds": 1.3,
   "seating": 1.6,
   "tables": 1.6,
   "storage": 1.5,
   "textiles": 1.4,
   "decor": 1.2,
   "note": "Solid oak drives tables/storage up; decor stays cheap (paper lanterns, ceramics).",
   "examples": [
    {
     "item": "MUJI oak lean-back wooden bed, queen (US$600 x1.38, frame only)",
     "price": 828,
     "url": "https://www.muji.us/collections/bed-frames-mattresses"
    },
    {
     "item": "Simons plain pure wool rug, from",
     "price": 279,
     "url": "https://www.simons.ca/en/rugs/area-rugs/up-to-9-x-12/plain-pure-wool-handcrafted-rug-see-available-sizes--15674-25202055"
    },
    {
     "item": "Structube Hillary low-back sofa",
     "price": 1399,
     "url": "https://www.structube.com/en_ca/hillary-modern-low-back-96-luxury-sofa-64-85-93?pid=47978"
    }
   ]
  },
  "nordicLodge": {
   "beds": 1.6,
   "seating": 2.4,
   "tables": 1.7,
   "storage": 1.6,
   "textiles": 1.8,
   "decor": 1.5,
   "note": "Leather seating, heavy solid wood, sheepskin and wool. The most expensive style for seating and textiles.",
   "examples": [
    {
     "item": "Crate & Barrel Canada Lounge sofa range (CAD)",
     "price": 2249,
     "url": "https://www.crateandbarrel.ca/furniture/lounge-collection/1/filters/sofas-128"
    },
    {
     "item": "Structube Rowan 100% leather 3-seater (sale)",
     "price": 1999,
     "url": "https://www.structube.com/en_ca/rowan-midcentury-modern-100-leather-3seater-sofa-19-46-33?pid=22601"
    },
    {
     "item": "Pottery Barn Canada 5x8 wool rug, from",
     "price": 674,
     "url": "https://www.potterybarn.ca/shop/rugs/5--x-8-+wool-rugs/rugsize-m-rug-size-ff0a1115fe2720202720-1/"
    }
   ]
  },
  "midCenturyWarm": {
   "beds": 1.8,
   "seating": 2.6,
   "tables": 1.8,
   "storage": 1.8,
   "textiles": 1.5,
   "decor": 1.6,
   "note": "Walnut/teak and tufted leather; West Elm/EQ3 pricing is 2-4x baseline. A Structube MCM route would be ~1.5x.",
   "examples": [
    {
     "item": "West Elm Canada Mid-Century platform bed (sale CAD, frame only)",
     "price": 1948.5,
     "url": "https://www.westelm.ca/products/mid-century-bedframe-acorn-h001/"
    },
    {
     "item": "EQ3 Reverie sofa (US$2,973 x1.38)",
     "price": 4103,
     "url": "https://www.eq3.com/products/reverie-sofa"
    },
    {
     "item": "Structube Rowan MCM leather sofa (regular)",
     "price": 2399,
     "url": "https://www.structube.com/en_ca/rowan-midcentury-modern-100-leather-3seater-sofa-19-46-33?pid=22601"
    }
   ]
  }
 },
 "sedumBuildable": "Partly. Pre-grown sedum mats work on panels up to about 40-45 degrees (FLL guidance tops out at 40; pitched systems like Sempergreen's go to 45) if each panel has an eave restraint, an anti-shear grid or battens, and a fully adhered membrane, so the 33-37 degree rows can be done. Panels steeper than ~45 degrees and the near-vertical base cannot hold a roof system and would need a living-wall product instead; the panels also have to be engineered for 80-150 kg/m2 saturated load plus snow."
};

// furnishing style multiplier for a furniture kind (1 = the FIT table's mid-range baseline)
const STYLE_GROUP = { king: 'beds', queen: 'beds', double: 'beds', single: 'beds', bunk: 'beds', daybed: 'beds', sofa: 'seating', sofabed: 'seating', loveseat: 'seating', armchair: 'seating', chair: 'seating', stool: 'seating', bench: 'seating', lounger: 'seating',
  rtable: 'tables', ctable: 'tables', lowtable: 'tables', bistro: 'tables', table: 'tables', desk: 'tables', longdesk: 'tables', kidtable: 'tables', bookshelf: 'storage', wardrobe: 'storage', cabinet: 'storage', rug: 'textiles', cushion: 'textiles', mat: 'textiles', planter: 'decor', hanging: 'decor' };
export function styleFactor(kind, style) { const S = OPTIONS.styles[style], g = STYLE_GROUP[kind]; return S && g ? S[g] : 1; }
