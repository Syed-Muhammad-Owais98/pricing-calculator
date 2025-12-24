30426
[[1,[{
  "targetChange": {
    "targetChangeType": "ADD",
    "targetIds": [
      2
    ]
  }
}
]],[2,[{
  "documentChange": {
    "document": {
      "name": "projects/spoonity-price-calculator/databases/(default)/documents/pricing_configuration/_metadata",
      "fields": {
        "sections": {
          "arrayValue": {
            "values": [
              {
                "stringValue": "plans"
              },
              {
                "stringValue": "connection_fees"
              },
              {
                "stringValue": "transaction_fees"
              },
              {
                "stringValue": "marketing_email_fees"
              },
              {
                "stringValue": "sms_rates"
              },
              {
                "stringValue": "whatsapp_rates"
              },
              {
                "stringValue": "addons"
              },
              {
                "stringValue": "setup_fees"
              },
              {
                "stringValue": "country_dial_codes"
              }
            ]
          }
        },
        "version": {
          "stringValue": "1.0"
        },
        "lastUpdated": {
          "stringValue": "2025-12-19T20:12:11.425Z"
        }
      },
      "createTime": "2025-12-19T20:12:12.624438Z",
      "updateTime": "2025-12-19T20:12:12.624438Z"
    },
    "targetIds": [
      2
    ]
  }
}
]],[3,[{
  "documentChange": {
    "document": {
      "name": "projects/spoonity-price-calculator/databases/(default)/documents/pricing_configuration/addons",
      "fields": {
        "support": {
          "mapValue": {
            "fields": {
              "base_fee": {
                "integerValue": "2000"
              },
              "percentage": {
                "doubleValue": 0.1
              }
            }
          }
        },
        "data_ingestion": {
          "mapValue": {
            "fields": {
              "percentage": {
                "doubleValue": 0.2
              }
            }
          }
        },
        "server": {
          "mapValue": {
            "fields": {
              "base_fee": {
                "integerValue": "500"
              },
              "auto_apply_above_stores": {
                "integerValue": "50"
              }
            }
          }
        },
        "cms": {
          "mapValue": {
            "fields": {
              "base_fee": {
                "integerValue": "530"
              }
            }
          }
        },
        "sla": {
          "mapValue": {
            "fields": {
              "base_fee": {
                "integerValue": "2000"
              }
            }
          }
        },
        "gift_card": {
          "mapValue": {
            "fields": {
              "per_store_fee": {
                "integerValue": "30"
              },
              "base_fee": {
                "integerValue": "500"
              }
            }
          }
        },
        "app": {
          "mapValue": {
            "fields": {
              "pwa": {
                "integerValue": "350"
              },
              "standard": {
                "integerValue": "350"
              },
              "premium": {
                "integerValue": "1080"
              }
            }
          }
        }
      },
      "createTime": "2025-12-19T20:12:12.624438Z",
      "updateTime": "2025-12-19T20:12:12.624438Z"
    },
    "targetIds": [
      2
    ]
  }
}
]],[4,[{
  "documentChange": {
    "document": {
      "name": "projects/spoonity-price-calculator/databases/(default)/documents/pricing_configuration/connection_fees",
      "fields": {
        "tiers": {
          "arrayValue": {
            "values": [
              {
                "mapValue": {
                  "fields": {
                    "price": {
                      "integerValue": "150"
                    },
                    "max": {
                      "integerValue": "10"
                    },
                    "min": {
                      "integerValue": "0"
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "min": {
                      "integerValue": "11"
                    },
                    "max": {
                      "integerValue": "25"
                    },
                    "price": {
                      "integerValue": "135"
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "price": {
                      "doubleValue": 121.5
                    },
                    "min": {
                      "integerValue": "26"
                    },
                    "max": {
                      "integerValue": "40"
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "min": {
                      "integerValue": "41"
                    },
                    "price": {
                      "doubleValue": 109.35
                    },
                    "max": {
                      "integerValue": "55"
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "price": {
                      "doubleValue": 98.42
                    },
                    "min": {
                      "integerValue": "56"
                    },
                    "max": {
                      "integerValue": "100"
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "min": {
                      "integerValue": "101"
                    },
                    "max": {
                      "integerValue": "150"
                    },
                    "price": {
                      "doubleValue": 88.57
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "price": {
                      "doubleValue": 79.72
                    },
                    "max": {
                      "integerValue": "250"
                    },
                    "min": {
                      "integerValue": "151"
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "price": {
                      "doubleValue": 71.74
                    },
                    "max": {
                      "integerValue": "500"
                    },
                    "min": {
                      "integerValue": "251"
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "price": {
                      "doubleValue": 64.57
                    },
                    "min": {
                      "integerValue": "501"
                    },
                    "max": {
                      "integerValue": "1000"
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "price": {
                      "doubleValue": 58.11
                    },
                    "max": {
                      "integerValue": "10000"
                    },
                    "min": {
                      "integerValue": "1001"
                    }
                  }
                }
              }
            ]
          }
        },
        "description": {
          "stringValue": "Per store fees based on total store count"
        }
      },
      "createTime": "2025-12-19T20:12:12.624438Z",
      "updateTime": "2025-12-19T20:12:12.624438Z"
    },
    "targetIds": [
      2
    ]
  }
}
]],[5,[{
  "documentChange": {
    "document": {
      "name": "projects/spoonity-price-calculator/databases/(default)/documents/pricing_configuration/country_dial_codes",
      "fields": {
        "USA": {
          "stringValue": "+1"
        },
        "Australia": {
          "stringValue": "+61"
        },
        "UAE": {
          "stringValue": "+971"
        },
        "El Salvador": {
          "stringValue": "+503"
        },
        "Argentina": {
          "stringValue": "+54"
        },
        "Honduras": {
          "stringValue": "+504"
        },
        "Guatemala": {
          "stringValue": "+502"
        },
        "Costa Rica": {
          "stringValue": "+506"
        },
        "Colombia": {
          "stringValue": "+57"
        },
        "Chile": {
          "stringValue": "+56"
        },
        "Canada": {
          "stringValue": "+1"
        },
        "Mexico": {
          "stringValue": "+52"
        },
        "Ecuador": {
          "stringValue": "+593"
        },
        "Nicaragua": {
          "stringValue": "+505"
        }
      },
      "createTime": "2025-12-19T20:12:12.624438Z",
      "updateTime": "2025-12-19T20:12:12.624438Z"
    },
    "targetIds": [
      2
    ]
  }
}
]],[6,[{
  "documentChange": {
    "document": {
      "name": "projects/spoonity-price-calculator/databases/(default)/documents/pricing_configuration/marketing_email_fees",
      "fields": {
        "description": {
          "stringValue": "Fees for marketing emails"
        },
        "base_fee": {
          "integerValue": "500"
        },
        "push_notification_rate": {
          "doubleValue": 0.0045
        },
        "tiers": {
          "arrayValue": {
            "values": [
              {
                "mapValue": {
                  "fields": {
                    "rate": {
                      "integerValue": "0"
                    },
                    "threshold": {
                      "integerValue": "10000"
                    },
                    "volumeCost": {
                      "integerValue": "0"
                    },
                    "hasBaseFee": {
                      "booleanValue": false
                    },
                    "totalCost": {
                      "integerValue": "0"
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "volumeCost": {
                      "integerValue": "800"
                    },
                    "hasBaseFee": {
                      "booleanValue": true
                    },
                    "rate": {
                      "doubleValue": 0.008
                    },
                    "threshold": {
                      "integerValue": "100000"
                    },
                    "totalCost": {
                      "integerValue": "1300"
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "threshold": {
                      "integerValue": "250000"
                    },
                    "hasBaseFee": {
                      "booleanValue": true
                    },
                    "totalCost": {
                      "integerValue": "2000"
                    },
                    "volumeCost": {
                      "integerValue": "1500"
                    },
                    "rate": {
                      "doubleValue": 0.006
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "volumeCost": {
                      "integerValue": "2250"
                    },
                    "totalCost": {
                      "integerValue": "2750"
                    },
                    "threshold": {
                      "integerValue": "500000"
                    },
                    "hasBaseFee": {
                      "booleanValue": true
                    },
                    "rate": {
                      "doubleValue": 0.0045
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "totalCost": {
                      "integerValue": "3875"
                    },
                    "volumeCost": {
                      "integerValue": "3375"
                    },
                    "threshold": {
                      "integerValue": "1000000"
                    },
                    "hasBaseFee": {
                      "booleanValue": true
                    },
                    "rate": {
                      "doubleValue": 0.0034
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "threshold": {
                      "integerValue": "2500000"
                    },
                    "totalCost": {
                      "integerValue": "6828"
                    },
                    "hasBaseFee": {
                      "booleanValue": true
                    },
                    "volumeCost": {
                      "integerValue": "6328"
                    },
                    "rate": {
                      "doubleValue": 0.0025
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "hasBaseFee": {
                      "booleanValue": true
                    },
                    "totalCost": {
                      "integerValue": "22016"
                    },
                    "threshold": {
                      "integerValue": "10000000"
                    },
                    "rate": {
                      "doubleValue": 0.0022
                    },
                    "volumeCost": {
                      "integerValue": "21516"
                    }
                  }
                }
              }
            ]
          }
        }
      },
      "createTime": "2025-12-19T20:12:12.624438Z",
      "updateTime": "2025-12-19T20:12:12.624438Z"
    },
    "targetIds": [
      2
    ]
  }
}
]],[7,[{
  "documentChange": {
    "document": {
      "name": "projects/spoonity-price-calculator/databases/(default)/documents/pricing_configuration/plans",
      "fields": {
        "loyalty": {
          "mapValue": {
            "fields": {
              "base": {
                "integerValue": "1000"
              },
              "fullDescription": {
                "stringValue": "The Spoonity Loyalty plan provides a complete loyalty platform for your business. It includes a base license fee of $1,000/month plus per-store connection fees that scale based on volume. This plan includes unlimited users, CRM functionality, unlimited earning and spending rules, unlimited members, and standard reporting capabilities."
              },
              "description": {
                "stringValue": "Core loyalty functionality"
              },
              "name": {
                "stringValue": "Spoonity Loyalty"
              }
            }
          }
        },
        "intelligence": {
          "mapValue": {
            "fields": {
              "description": {
                "stringValue": "Includes Loyalty, Marketing + Analytics"
              },
              "fullDescription": {
                "stringValue": "The Spoonity Intelligence plan is our most comprehensive offering. It includes all Loyalty and Marketing features plus advanced analytics. The base license fee is $3,000/month plus per-store connection fees. This plan includes 1 million transactions per month at no additional cost, with data processing fees for higher volumes. It includes comprehensive dashboards for customer analytics, loyalty segments, and cohort analysis."
              },
              "name": {
                "stringValue": "Spoonity Intelligence"
              },
              "base": {
                "integerValue": "3000"
              }
            }
          }
        },
        "marketing": {
          "mapValue": {
            "fields": {
              "description": {
                "stringValue": "Includes Loyalty + Marketing features"
              },
              "base": {
                "integerValue": "1500"
              },
              "name": {
                "stringValue": "Spoonity Marketing"
              },
              "fullDescription": {
                "stringValue": "The Spoonity Marketing plan includes all Loyalty features plus comprehensive marketing capabilities. It starts with a base license fee of $1,500/month plus per-store connection fees. Marketing emails use a licensed-based model with committed volume pricing: $500 base fee plus tier-based costs based on committed volumes."
              }
            }
          }
        }
      },
      "createTime": "2025-12-19T20:12:12.624438Z",
      "updateTime": "2025-12-19T20:12:12.624438Z"
    },
    "targetIds": [
      2
    ]
  }
}
]],[8,[{
  "documentChange": {
    "document": {
      "name": "projects/spoonity-price-calculator/databases/(default)/documents/pricing_configuration/setup_fees",
      "fields": {
        "data_ingestion": {
          "mapValue": {
            "fields": {
              "base": {
                "stringValue": "totalBeforeSupport"
              },
              "percentage": {
                "doubleValue": 0.2
              }
            }
          }
        },
        "app": {
          "mapValue": {
            "fields": {
              "premium": {
                "integerValue": "15000"
              },
              "pwa": {
                "integerValue": "1000"
              },
              "standard": {
                "integerValue": "5000"
              }
            }
          }
        },
        "onboarding": {
          "mapValue": {
            "fields": {
              "rate": {
                "doubleValue": 0.33
              },
              "months": {
                "integerValue": "3"
              }
            }
          }
        }
      },
      "createTime": "2025-12-19T20:12:12.624438Z",
      "updateTime": "2025-12-19T20:12:12.624438Z"
    },
    "targetIds": [
      2
    ]
  }
}
]],[9,[{
  "documentChange": {
    "document": {
      "name": "projects/spoonity-price-calculator/databases/(default)/documents/pricing_configuration/sms_rates",
      "fields": {
        "Nicaragua": {
          "doubleValue": 0.12813
        },
        "UAE": {
          "doubleValue": 0.1243
        },
        "El Salvador": {
          "doubleValue": 0.076
        },
        "Mexico": {
          "doubleValue": 0.06849
        },
        "USA": {
          "doubleValue": 0.01015
        },
        "Argentina": {
          "doubleValue": 0.07967
        },
        "Honduras": {
          "doubleValue": 0.13928
        },
        "Colombia": {
          "doubleValue": 0.00181
        },
        "Ecuador": {
          "doubleValue": 0.20303
        },
        "Guatemala": {
          "doubleValue": 0.2415
        },
        "Chile": {
          "doubleValue": 0.05955
        },
        "Canada": {
          "doubleValue": 0.01015
        },
        "Australia": {
          "doubleValue": 0.039675
        },
        "Costa Rica": {
          "doubleValue": 0.0538
        }
      },
      "createTime": "2025-12-19T20:12:12.624438Z",
      "updateTime": "2025-12-19T20:12:12.624438Z"
    },
    "targetIds": [
      2
    ]
  }
}
]],[10,[{
  "documentChange": {
    "document": {
      "name": "projects/spoonity-price-calculator/databases/(default)/documents/pricing_configuration/transaction_fees",
      "fields": {
        "tiers": {
          "arrayValue": {
            "values": [
              {
                "mapValue": {
                  "fields": {
                    "min": {
                      "integerValue": "0"
                    },
                    "rate": {
                      "doubleValue": 0.005
                    },
                    "max": {
                      "integerValue": "5000"
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "min": {
                      "integerValue": "5001"
                    },
                    "rate": {
                      "doubleValue": 0.003
                    },
                    "max": {
                      "integerValue": "50000"
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "min": {
                      "integerValue": "50001"
                    },
                    "rate": {
                      "doubleValue": 0.002
                    },
                    "max": {
                      "integerValue": "999999999"
                    }
                  }
                }
              }
            ]
          }
        },
        "description": {
          "stringValue": "Fees per transaction based on volume"
        }
      },
      "createTime": "2025-12-19T20:12:12.624438Z",
      "updateTime": "2025-12-19T20:12:12.624438Z"
    },
    "targetIds": [
      2
    ]
  }
}
]],[11,[{
  "documentChange": {
    "document": {
      "name": "projects/spoonity-price-calculator/databases/(default)/documents/pricing_configuration/whatsapp_rates",
      "fields": {
        "store_fee_tiers": {
          "arrayValue": {
            "values": [
              {
                "mapValue": {
                  "fields": {
                    "base": {
                      "integerValue": "0"
                    },
                    "rate": {
                      "integerValue": "9"
                    },
                    "max": {
                      "integerValue": "10"
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "rate": {
                      "doubleValue": 8.1
                    },
                    "prevCount": {
                      "integerValue": "10"
                    },
                    "base": {
                      "integerValue": "90"
                    },
                    "max": {
                      "integerValue": "80"
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "base": {
                      "integerValue": "657"
                    },
                    "rate": {
                      "doubleValue": 7.2
                    },
                    "max": {
                      "integerValue": "149"
                    },
                    "prevCount": {
                      "integerValue": "80"
                    }
                  }
                }
              },
              {
                "mapValue": {
                  "fields": {
                    "rate": {
                      "doubleValue": 6.3
                    },
                    "prevCount": {
                      "integerValue": "149"
                    },
                    "base": {
                      "doubleValue": 1153.8
                    },
                    "max": {
                      "integerValue": "99999"
                    }
                  }
                }
              }
            ]
          }
        },
        "base_fee": {
          "integerValue": "630"
        },
        "country_mappings": {
          "mapValue": {
            "fields": {
              "Costa Rica": {
                "stringValue": "Rest of Latin America"
              },
              "Ecuador": {
                "stringValue": "Rest of Latin America"
              },
              "Nicaragua": {
                "stringValue": "Rest of Latin America"
              },
              "Guatemala": {
                "stringValue": "Rest of Latin America"
              },
              "Honduras": {
                "stringValue": "Rest of Latin America"
              },
              "El Salvador": {
                "stringValue": "Rest of Latin America"
              }
            }
          }
        },
        "country_rates": {
          "mapValue": {
            "fields": {
              "Chile": {
                "mapValue": {
                  "fields": {
                    "marketing": {
                      "doubleValue": 0.12
                    },
                    "otp": {
                      "doubleValue": 0.05
                    },
                    "utility": {
                      "doubleValue": 0.04
                    },
                    "marketTicket": {
                      "doubleValue": 0.0276
                    }
                  }
                }
              },
              "North America": {
                "mapValue": {
                  "fields": {
                    "marketing": {
                      "doubleValue": 0.05
                    },
                    "otp": {
                      "doubleValue": 0.02
                    },
                    "marketTicket": {
                      "doubleValue": 0.0138
                    },
                    "utility": {
                      "doubleValue": 0.03
                    }
                  }
                }
              },
              "Colombia": {
                "mapValue": {
                  "fields": {
                    "marketing": {
                      "doubleValue": 0.04
                    },
                    "utility": {
                      "doubleValue": 0.03
                    },
                    "marketTicket": {
                      "doubleValue": 0.012
                    },
                    "otp": {
                      "doubleValue": 0.01
                    }
                  }
                }
              },
              "Mexico": {
                "mapValue": {
                  "fields": {
                    "marketing": {
                      "doubleValue": 0.07
                    },
                    "marketTicket": {
                      "doubleValue": 0.0138
                    },
                    "otp": {
                      "doubleValue": 0.03
                    },
                    "utility": {
                      "doubleValue": 0.03
                    }
                  }
                }
              },
              "Brazil": {
                "mapValue": {
                  "fields": {
                    "utility": {
                      "doubleValue": 0.02
                    },
                    "otp": {
                      "doubleValue": 0.04
                    },
                    "marketTicket": {
                      "doubleValue": 0.0138
                    },
                    "marketing": {
                      "doubleValue": 0.09
                    }
                  }
                }
              },
              "Rest of Latin America": {
                "mapValue": {
                  "fields": {
                    "marketing": {
                      "doubleValue": 0.11
                    },
                    "otp": {
                      "doubleValue": 0.05
                    },
                    "marketTicket": {
                      "doubleValue": 0.0156
                    },
                    "utility": {
                      "doubleValue": 0.03
                    }
                  }
                }
              },
              "Argentina": {
                "mapValue": {
                  "fields": {
                    "utility": {
                      "doubleValue": 0.06
                    },
                    "marketTicket": {
                      "doubleValue": 0.0469
                    },
                    "otp": {
                      "doubleValue": 0.04
                    },
                    "marketing": {
                      "doubleValue": 0.09
                    }
                  }
                }
              },
              "Peru": {
                "mapValue": {
                  "fields": {
                    "utility": {
                      "doubleValue": 0.04
                    },
                    "otp": {
                      "doubleValue": 0.04
                    },
                    "marketing": {
                      "doubleValue": 0.08
                    },
                    "marketTicket": {
                      "doubleValue": 0.024
                    }
                  }
                }
              }
            }
          }
        }
      },
      "createTime": "2025-12-19T20:12:12.624438Z",
      "updateTime": "2025-12-19T20:12:12.624438Z"
    },
    "targetIds": [
      2
    ]
  }
}
]],[12,[{
  "targetChange": {
    "targetChangeType": "CURRENT",
    "targetIds": [
      2
    ],
    "resumeToken": "CgkIjerG09/TkQM=",
    "readTime": "2025-12-23T12:49:45.829645Z"
  }
}
]],[13,[{
  "targetChange": {
    "resumeToken": "CgkIjerG09/TkQM=",
    "readTime": "2025-12-23T12:49:45.829645Z"
  }
}
]],[14,[{
  "filter": {
    "targetId": 2,
    "count": 10,
    "unchangedNames": {
      "bits": {
        "bitmap": "rZYz9brTU4uTUC4t/IPwepVLHEfLpQE5ivkH",
        "padding": 5
      },
      "hashCount": 15
    }
  }
}
]],[15,[{
  "targetChange": {
    "resumeToken": "CgkI2tjL09/TkQM=",
    "readTime": "2025-12-23T12:49:45.909338Z"
  }
}
]],[16,[{
  "filter": {
    "targetId": 2,
    "count": 10,
    "unchangedNames": {
      "bits": {
        "bitmap": "rZYz9brTU4uTUC4t/IPwepVLHEfLpQE5ivkH",
        "padding": 5
      },
      "hashCount": 15
    }
  }
}
]],[17,[{
  "targetChange": {
    "resumeToken": "CgkI9/vV09/TkQM=",
    "readTime": "2025-12-23T12:49:46.077687Z"
  }
}
]]]104
[[18,[{
  "targetChange": {
    "targetChangeType": "REMOVE",
    "targetIds": [
      2
    ]
  }
}
]]]15
[[19,["noop"]]]

📋 Migration Guide
To replace hardcoded data with Firestore data, use the fetch functions from utils/fetchPricing.ts:

fetchPlans() → Replace planDetails
fetchConnectionFees() → Replace connection fee tiers
fetchTransactionFees() → Replace transaction fee tiers
fetchMarketingEmailFees() → Replace marketing email tiers
fetchSmsRates() → Replace smsRates
fetchWhatsappRates() → Replace whatsappRates
fetchAddons() → Replace addon pricing constants
fetchSetupFees() → Replace setup fee constants
fetchCountryDialCodes() → Replace countryDialCodes
Or use fetchPricingConfig() to get everything at once.