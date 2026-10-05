// Starting point for a new washing and sluice project: the flowsheet, schedule,
// team roles and proposal wording, with every cost and rate of pay set to zero.
// The repo is public, so no supplier price, commission or pay belongs here.
// For a project priced like an earlier one, copy that project instead.

import type { Project } from './types'

const WASH_SLUICE: Project = {
  "meta": {
    "name": "",
    "client": "",
    "site": "",
    "date": "",
    "validityDays": 30,
    "preparedBy": "Allan Bartholomew, Head of Business Development"
  },
  "inputs": {
    "commission": 0,
    "riskReserve": 0,
    "contingency": 0.1,
    "servicesMarkup": 0,
    "oceanFreightPer40": 4000,
    "oogPremiumPerUnit": 7500,
    "originFeePerUnit": 600,
    "insuranceRate": 0.005,
    "pvocRate": 0.005,
    "pvocMin": 250,
    "pvocMax": 5000,
    "portPerUnit": 700,
    "agencyFee": 1500,
    "inlandPer40": 2500,
    "lowbedPerUnit": 5000,
    "importDuty": 0,
    "importVat": 0.18,
    "crewSize": 1,
    "crewDayRate": 0,
    "crewFlight": 1400,
    "crewVisa": 250,
    "crewLivingPerDay": 40,
    "travelPerEngMonth": 1500,
    "supplierTerms": {
      "deposit": 0.6,
      "bl": 0.4,
      "final": 0
    },
    "clientTerms": {
      "deposit": 0.3,
      "bl": 0.6,
      "final": 0.1
    },
    "pmFee": 0
  },
  "teamRoles": [
    {
      "id": "pm",
      "name": "Project manager",
      "monthlyRate": 0,
      "duties": "Overall delivery, budget and schedule. Single point of contact for the client.",
      "onFee": true
    },
    {
      "id": "process",
      "name": "Process / metallurgical engineer",
      "monthlyRate": 0,
      "duties": "Flowsheet, feed testing, equipment sizing and recovery during commissioning."
    },
    {
      "id": "mech",
      "name": "Mechanical engineer",
      "monthlyRate": 0,
      "duties": "Equipment specification, factory inspection, installation and alignment."
    },
    {
      "id": "elec",
      "name": "Electrical engineer",
      "monthlyRate": 0,
      "duties": "Power supply, MCC and drives, cabling and protection."
    },
    {
      "id": "super",
      "name": "Site construction supervisor",
      "monthlyRate": 0,
      "duties": "Site works, civils, erection crews and daily progress on site."
    },
    {
      "id": "hse",
      "name": "HSE officer",
      "monthlyRate": 0,
      "duties": "Site safety, environmental controls and compliance with permits."
    }
  ],
  "packages": [
    {
      "id": "WS",
      "code": "WS",
      "name": "Washing and Sluice Plant",
      "short": "Washing and Sluice Plant",
      "capacity": 150,
      "power": "200 kW diesel",
      "flowsheet": "washSluice",
      "summary": "150 m³/h washing screen and six sluice boxes, expandable later with fine gold recovery",
      "description": "A double-deck vibrating washing screen with four spray pipes feeds six sluice boxes lined with high-density gold mats. The package includes the wash water pump, the control cabinet, water hoses and a 200 kW diesel generator.",
      "highlights": [
        "Simple, lower-cost first stage that starts producing quickly",
        "Mercury-free: the gold is caught on sluice mats",
        "Laid out so fine gold recovery can be added in Phase 2"
      ],
      "fitIf": [],
      "specs": [
        {
          "label": "Capacity",
          "value": "150 m³/h"
        },
        {
          "label": "Washing",
          "value": "Double-deck vibrating screen with 4 spray pipes"
        },
        {
          "label": "Screen decks",
          "value": "40 mm perforated plate (top), 20 mm manganese wire mesh (second)"
        },
        {
          "label": "Gold recovery",
          "value": "6 sluice boxes, about 1 m × 6 m, with high-density gold mats"
        },
        {
          "label": "Wash water",
          "value": "About 400 m³/h at 35-40 m head"
        },
        {
          "label": "Installed load",
          "value": "About 147 kW (screen 2 × 7.5 kW, pump 132 kW)"
        },
        {
          "label": "Power supply",
          "value": "200 kW diesel generator, or site power where reliable"
        },
        {
          "label": "Warranty",
          "value": "12 months on main equipment, excluding wear parts"
        }
      ],
      "flow": {
        "screen": {
          "sub": "2 decks: 40 mm and 20 mm • 4 spray pipes"
        },
        "waterbox": {
          "sub": "about 1.5 m × 1.5 m"
        },
        "sluices": {
          "sub": "6 × (1 m × 6 m) • gold mats"
        },
        "cleanup": {
          "sub": "concentrate to final recovery"
        },
        "genset": {
          "sub": "200 kW • control cabinet"
        },
        "source": {
          "sub": "river, pond or borehole"
        },
        "pump": {
          "sub": "about 400 m³/h • 132 kW"
        }
      },
      "equipment": [
        {
          "tag": "WS-01",
          "item": "Vibrating gold washing and screening unit, double deck: 40 mm perforated top deck, 20 mm manganese wire second deck, 4 spray pipes, 2 spare sets of second-deck mesh",
          "name": "Vibrating washing screen",
          "qty": "1 set",
          "kw": "2 × 7.5",
          "supplierCost": 0,
          "basis": "",
          "source": "import"
        },
        {
          "tag": "SL-01..06",
          "item": "Gold recovery sluice boxes, about 1 m × 6 m each, 6 mm folded plate, with pressing bars for gold mats and one 1.5 m × 1.5 m distribution box",
          "name": "Sluice boxes",
          "qty": "6 sets",
          "kw": "-",
          "supplierCost": 0,
          "basis": "",
          "source": "import"
        },
        {
          "tag": "GM-01",
          "item": "High-density gold mats, about 15 m × 1 m × 30 mm",
          "name": "Gold mats",
          "qty": "4",
          "kw": "-",
          "supplierCost": 0,
          "basis": "",
          "source": "import"
        },
        {
          "tag": "P-01",
          "item": "Water and slurry pump system, about 400 m³/h at 35-40 m head, high-chrome wet parts (final selection after the site survey)",
          "name": "Water pump",
          "qty": "1 set",
          "kw": "132",
          "supplierCost": 0,
          "basis": "",
          "source": "import"
        },
        {
          "tag": "MC-01",
          "item": "Central control cabinet with overload, short-circuit, under-voltage, phase-loss and alarm protection",
          "name": "Control cabinet",
          "qty": "1 set",
          "kw": "-",
          "supplierCost": 0,
          "basis": "",
          "source": "import"
        },
        {
          "tag": "H-01",
          "item": "High-pressure water hoses, 8 inch × 100 m",
          "name": "Water hoses",
          "qty": "4",
          "kw": "-",
          "supplierCost": 0,
          "basis": "",
          "source": "import"
        },
        {
          "tag": "GE-01",
          "item": "Diesel generator set, 200 kW (can be left out where reliable site power is available)",
          "name": "Diesel generator",
          "qty": "1 set",
          "kw": "-",
          "supplierCost": 0,
          "basis": "",
          "source": "import",
          "optional": true
        }
      ],
      "packageCost": 0,
      "packageBasis": "",
      "params": {
        "containers": 2,
        "installDays": 10,
        "craneDayRate": 600,
        "craneDays": 1,
        "craneMob": 500,
        "civils": 8000,
        "bulkSample": 3000,
        "survey": 2000,
        "inspection": 1500,
        "factoryTrip": 0,
        "permits": 3000,
        "commissioningConsumables": 1500,
        "wearParts": 2500
      },
      "team": {
        "pm": [
          1,
          1,
          1,
          1
        ],
        "process": [
          0.25,
          0,
          0,
          0.5
        ],
        "mech": [
          0.25,
          0.25,
          0,
          0.5
        ],
        "elec": [
          0,
          0,
          0,
          0.25
        ],
        "super": [
          0.25,
          0,
          0.5,
          1
        ],
        "hse": [
          0,
          0,
          0.25,
          0.5
        ]
      },
      "schedule": [
        {
          "id": "sample",
          "label": "Feed sample and site survey",
          "weeks": 2,
          "after": []
        },
        {
          "id": "contract",
          "label": "Contract and scope confirmation",
          "weeks": 2,
          "after": []
        },
        {
          "id": "fab",
          "label": "Manufacturing",
          "weeks": 3,
          "after": [
            "sample",
            "contract"
          ]
        },
        {
          "id": "fat",
          "label": "Inspection, packing and transfer to port",
          "weeks": 1,
          "after": [
            "fab"
          ]
        },
        {
          "id": "ocean",
          "label": "Ocean freight China to Dar es Salaam",
          "weeks": 5,
          "after": [
            "fat"
          ]
        },
        {
          "id": "clear",
          "label": "Customs clearance and PVoC",
          "weeks": 1.5,
          "after": [
            "ocean"
          ]
        },
        {
          "id": "truck",
          "label": "Transport Dar es Salaam to site",
          "weeks": 1,
          "after": [
            "clear"
          ]
        },
        {
          "id": "civils",
          "label": "Site preparation: plinths, sluice supports, water supply (in parallel)",
          "weeks": 3,
          "after": [
            "contract"
          ]
        },
        {
          "id": "erect",
          "label": "Installation and cold commissioning",
          "weeks": 1.5,
          "after": [
            "truck",
            "civils"
          ]
        },
        {
          "id": "hot",
          "label": "Commissioning and operator training",
          "weeks": 1,
          "after": [
            "erect"
          ]
        }
      ],
      "cashflow": {
        "months": 4,
        "supplierDeposit": 0,
        "supplierBL": 1,
        "supplierFinal": 1,
        "clientSigning": 0,
        "clientDeposit": 0,
        "clientBL": 1,
        "clientFinal": 3,
        "freight": [
          0,
          1,
          0,
          0
        ],
        "port": [
          0,
          0,
          1,
          0
        ],
        "civils": [
          0.5,
          0.5,
          0,
          0
        ],
        "install": [
          0,
          0,
          0,
          1
        ],
        "qa": [
          0.7,
          0.3,
          0,
          0
        ],
        "commissioning": [
          0,
          0,
          0,
          1
        ]
      }
    }
  ],
  "combos": [],
  "production": {
    "goldPricePerGram": 132.99,
    "priceDate": "2026-10-02",
    "recovery": 0.7,
    "hoursPerDay": 20,
    "daysPerMonth": 26,
    "grades": [
      0.1,
      0.2,
      0.3
    ]
  },
  "expenses": [],
  "proposal": {
    "kicker": "Technical & commercial proposal • Phase 1 • Gold washing & sluice recovery",
    "title": "150 m³/h Placer Gold Washing and Sluice Recovery Plant",
    "intro": "We propose a 150 m³/h placer gold washing and sluice recovery plant as Phase 1 of your project. A vibrating washing screen cleans and sizes the gravel, and six sluice boxes lined with gold mats recover the free gold. It is a simple, lower-cost first stage that can be expanded later with additional recovery equipment.",
    "overview": "The plant washes run-of-mine gravel on a double-deck vibrating screen fitted with four spray pipes. Stones and gravel over 20 mm are rejected, and the slurry under 20 mm, which carries the free gold, is spread across six 1 m × 6 m sluice boxes lined with high-density gold mats. A 400 m³/h pump supplies the wash water, and a 200 kW diesel generator powers the plant where there is no reliable grid supply. The plant uses no mercury or cyanide.",
    "alternativeTitle": "Phase 2: adding fine gold recovery later",
    "alternative": "Sluice boxes recover coarse and medium free gold well, but they lose part of the very fine gold. Phase 1 is laid out so that centrifugal concentrators, jigs or shaking tables can be added later to capture more of it, once production has shown how your gold behaves. The final connections are confirmed during detailed design.",
    "packageIds": [
      "WS"
    ],
    "expansionId": "",
    "expansionBaseId": "",
    "tradeoff": "",
    "costsIntro": "This chapter sets out the full cost of delivering the plant as a working operation on site: the equipment package plus shipping, installation, site preparation, engineering, testing and commissioning. Execution services are estimates at this stage and are confirmed in the services quotation once the Phase 1 scope is approved.",
    "executionIntro": "Delivery runs from contract to first production. Site preparation, including plinths, sluice supports and the water supply, runs while the equipment is manufactured and shipped, so the site is ready when it arrives.",
    "teamIntro": "A dedicated project team manages delivery from contract to commissioning. Each specialist is involved in the months their work is needed, rather than full time for the whole project.",
    "shippingIntro": "The plant is manufactured in China and shipped to Dar es Salaam in standard containers. After port clearance and the PVoC certificate of conformity, it travels by road to site.",
    "scheduleNote": "Manufacturing takes about 15 to 20 days from the supplier deposit. Site preparation runs in parallel with manufacturing and shipping.",
    "productionNote": "Sluice recovery depends heavily on gold size: coarse and medium free gold is recovered well, fine gold less so. Your head grade and gold size distribution are not yet established, so the bulk sample sets the real figures. Values are gross, before royalties, operating costs and refining.",
    "included": [
      "All equipment listed, new, with two spare sets of second-deck screen mesh and four gold mats",
      "Site layout drawing after order confirmation and receipt of site information",
      "Pre-shipment inspection before the equipment leaves the factory",
      "12-month warranty on the main equipment, excluding normal wear parts",
      "Packing list and equipment documentation"
    ],
    "services": [
      "Factory-to-port transport, ocean freight, insurance, PVoC, port clearance and delivery to site",
      "Installation supervision and commissioning",
      "Operator training",
      "Supervision of site preparation: plinths, sluice supports and the water supply"
    ],
    "clientResponsibilities": [
      "Valid mining licence for duty-exempt import of plant",
      "Import VAT and any statutory charges in Tanzania",
      "Site access, a reliable water source, permits and environmental approvals",
      "A representative bulk sample for testing",
      "Diesel fuel for the generator"
    ],
    "commissioningNote": "Commissioning is signed off after three consecutive shifts at or near the design rate with no critical defects.",
    "steps": [
      {
        "title": "Sign and start testing",
        "text": "On signing, the project management fee starts the work: bulk sample, site survey and water source check."
      },
      {
        "title": "Confirm the scope",
        "text": "The results confirm the Phase 1 scope, the pump selection and the layout, and the first payment is made."
      },
      {
        "title": "Build",
        "text": "Manufacturing starts on the supplier deposit while the site is prepared in parallel."
      }
    ],
    "basis": "Prices are in USD and preliminary. Final equipment details, layout and contract value are confirmed once the Phase 1 scope is approved and the site conditions are known. Pump flow, head and motor size are confirmed against the actual water source distance and elevation. Changes in ore characteristics, feed size, clay content or water conditions may change the configuration and price. The plant uses no mercury or cyanide.",
    "show": {},
    "detail": {
      "equipmentPrices": true,
      "equipmentPhotos": true,
      "costBreakdown": true,
      "importTaxes": true,
      "teamMonths": true,
      "images": true
    },
    "images": {
      "cover": "social/standalone-gravity-sluice.png",
      "overview": "social/ore-sample-selection.jpg",
      "option:WS": "social/small-gravity-plant.png",
      "execution": "social/prepared-equipment-foundations.png",
      "shipping": "social/freight-port.jpg",
      "production": "social/alluvial-fine-screen.png"
    },
    "equipmentPhotos": [
      "equipment/vibrating-screen.jpg",
      "equipment/sluice-box-gold-jig.webp",
      "equipment/slurry-pump.webp",
      "equipment/diesel-generator-mining.jpg"
    ]
  }
}

export function blankProject(name: string, today: string): Project {
  const p = structuredClone(WASH_SLUICE)
  p.meta.name = name
  p.meta.date = today
  return p
}
