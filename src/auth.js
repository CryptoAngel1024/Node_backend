/**
 * Middleware class that checks the user authorization to access a 
 * specific API method in the application
 */
const {
    poolPromise
} = require('./database/connect')
async function getRole(userId) {
    try {
        const text = `SELECT "role" FROM public."Users" WHERE "userID" = ${userId}`
        const pool = await poolPromise
        const result = await pool.query(text)
        return result.rows[0].role
    } catch (err) {
        console.log("ERROR:", err)
    }
}

module.exports = async function hasPermission(req, res, next) {

    if (req.path === '/users/login' || req.path === '/health') {
        // auth is not required for login
        next()
    } else {

        const userId = req.header("UserId")
        if (!userId) {
            res.status(403).send("Access Forbidden")
            return
        }

        const method = req.method
        const body = req.body | false
        const role = await getRole(userId, () => {})
        const regex = /\d+/g;
        const resource = req.path.replace(regex, "ID")

        const permissions = {
            "ClientManagement": {
                "permittedResources": ["/buildings", "/buildings/ID", "/propunits",
                    "/propunits/ID", "/clients", "/clients/ID", "/proposals", "/proposals/ID"
                ],
                "/buildings": {
                    "permittedMethods": ["GET"]
                },
                "/buildings/ID": {
                    "permittedMethods": ["GET"]
                },
                "/propunits": {
                    "permittedMethods": ["GET"]
                },
                "/propunits/ID": {
                    "permittedMethods": ["GET"]
                },
                "/clients": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/clients/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "*": "*"
                    }
                },
                "/proposals/": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "stage": [0],
                        "*": "*"
                    }
                },
                "/proposals/ID": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "stage": [0],
                        "*": "*"
                    }
                }
            },
            "Sales": {
                "permittedResources": ["/buildings", "/buildings/ID", "/propunits",
                    "/propunits/ID", "/proposals", "/proposals/ID", "/campaigns", "/campaigns/ID"
                ],
                "/buildings": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/buildings/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "*": "*"
                    }
                },
                "/propunits": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/propunits/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "*": "*"
                    }
                },
                "/proposals": {
                    "permittedMethods": ["GET"]
                },
                "/proposals/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "stage": [0, 1, -1],
                        "*": "*"
                    }
                },
                "/campaigns": {
                    "permittedMethods": ["GET"]
                },
                "/campaigns/ID": {
                    "permittedMethods": ["GET"]
                }
            },
            "SalesPro": {
                "permittedResources": ["/buildings", "/buildings/ID", "/propunits",
                    "/propunits/ID", "/proposals", "/proposals/ID", "/campaigns", "/campaigns/ID"
                ],
                "/buildings": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/buildings/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "*": "*"
                    }
                },
                "/propunits": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/propunits/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "*": "*"
                    }
                },
                "/proposals": {
                    "permittedMethods": ["GET"]
                },
                "/proposals/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "stage": [-1, 0, 2, 3],
                        "*": "*"
                    }
                },
                "/campaigns": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/campaigns/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "*": "*"
                    }
                }
            },
            "Committee": {
                "permittedResources": ["/buildings", "/buildings/ID", "/propunits", "/propunits/merge", "/propunits/split",
                    "/propunits/ID", "/proposals", "/proposals/ID", "/campaigns", "/campaigns/ID",
                    "/contracts", "/contracts/ID", "/proposals/ID/votes", "/upload"
                ],
                "/buildings": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/buildings/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "*": "*"
                    }
                },
                "/propunits": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/propunits/merge": {
                    "permittedMethods": ["POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/propunits/ID": {
                    "permittedMethods": ["GET", "PUT", "DELETE"],
                    "PUT": {
                        "*": "*"
                    }
                },
                "/propunits/split": {
                    "permittedMethods": ["POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/proposals": {
                    "permittedMethods": ["GET"]
                },
                "/proposals/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "stage": [],
                        "*": "*"
                    }
                },
                "/campaigns": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/campaigns/ID": {
                    "permittedMethods": ["GET", "PUT", "DELETE"],
                    "PUT": {
                        "*": "*"
                    }
                },
                "/contracts": {
                    "permittedMethods": ["GET"]
                },
                "/contracts/ID": {
                    "permittedMethods": ["GET"]
                },
                "/proposals/ID/votes": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/upload": {
                    "permittedMethods": ["POST"]
                }
            },
            "Chief": {
                "permittedResources": ["/buildings", "/buildings/ID", "/propunits",
                    "/propunits/ID", "/proposals", "/proposals/ID", "/campaigns", "/campaigns/ID",
                    "/contracts", "/contracts/ID", "/proposals/ID/votes"
                ],
                "/buildings": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/buildings/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "*": "*"
                    }
                },
                "/propunits": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/propunits/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "*": "*"
                    }
                },
                "/proposals": {
                    "permittedMethods": ["GET"]
                },
                "/proposals/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "stage": [],
                        "*": "*"
                    }
                },
                "/campaigns": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/campaigns/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "*": "*"
                    }
                },
                "/contracts": {
                    "permittedMethods": ["GET"]
                },
                "/contracts/ID": {
                    "permittedMethods": ["GET"]
                },
                "/proposals/ID/votes": {
                    "permittedMethods": ["GET", "POST", "PUT"],
                    "POST": {
                        "*": "*"
                    },
                    "PUT": {
                        "*": "*"
                    }
                }
            },
            "ContractManagement": {
                "permittedResources": ["/buildings", "/buildings/ID", "/propunits",
                    "/propunits/ID", "/proposals", "/proposals/ID", "/campaigns", "/campaigns/ID",
                    "/contracts", "/contracts/ID"
                ],
                "/buildings": {
                    "permittedMethods": ["GET"]
                },
                "/buildings/ID": {
                    "permittedMethods": ["GET"]
                },
                "/propunits": {
                    "permittedMethods": ["GET"]
                },
                "/propunits/ID": {
                    "permittedMethods": ["GET"]
                },
                "/proposals": {
                    "permittedMethods": ["GET"]
                },
                "/proposals/ID": {
                    "permittedMethods": ["GET"]
                },
                "/campaigns": {
                    "permittedMethods": ["GET"]
                },
                "/campaigns/ID": {
                    "permittedMethods": ["GET"]
                },
                "/contracts": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/contracts/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "*": "*"
                    }
                },
                "/presales": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/presales/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "*": "*"
                    }
                }
            },
            "SellManagement": {
                "permittedResources": ["/buildings", "/buildings/ID", "/propunits",
                    "/propunits/ID", "/proposals", "/proposals/ID", "/campaigns", "/campaigns/ID",
                    "/contracts", "/contracts/ID"
                ],
                "/buildings": {
                    "permittedMethods": ["GET"]
                },
                "/buildings/ID": {
                    "permittedMethods": ["GET"]
                },
                "/propunits": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/propunits/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "*": "*"
                    }
                },
                "/proposals": {
                    "permittedMethods": ["GET"]
                },
                "/proposals/ID": {
                    "permittedMethods": ["GET"]
                },
                "/campaigns": {
                    "permittedMethods": ["GET"]
                },
                "/campaigns/ID": {
                    "permittedMethods": ["GET"]
                },
                "/contracts": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/contracts/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "*": "*"
                    }
                },
                "/presales": {
                    "permittedMethods": ["GET", "POST"],
                    "POST": {
                        "*": "*"
                    }
                },
                "/presales/ID": {
                    "permittedMethods": ["GET", "PUT"],
                    "PUT": {
                        "*": "*"
                    }
                }
            },
            // "Treasury": {
            //     "permittedResources": ["/contracts", "/contracts/ID", "/contracts/ID/payments", "/contracts/ID/payments/ID"],
            //     "/contracts": {
            //         "permittedMethods": ["GET"]
            //     },
            //     "/contracts/ID": {
            //         "permittedMethods": ["GET"]
            //     },
            //     "/contracts/ID/payments": {
            //         "permittedMethods": ["GET"]
            //     },
            //     "/contracts/ID/payments/ID": {
            //         "permittedMethods": ["PUT"],
            //         "PUT": {
            //             "*": "*"
            //         }
            //     }
            // },
            "Admin": {
                "permittedResources": ["/users", "/users/ID", "/users/ID/password", "/users/ID/passwordreset", "/users/roles"],
                "/users": {
                    "permittedMethods": ["GET", "POST"]
                },
                "/users/ID": {
                    "permittedMethods": ["PUT", "DELETE", "GET"]
                },
                "/users/ID/passwordreset": {
                    "permittedMethods": ["POST"]
                },
                "/users/ID/password": {
                    "permittedMethods": ["PUT"]
                },
                "/users/roles": {
                    "permittedMethods": ["GET"]
                }
            }

        }

        // check if resource and method is permitted

        if (!(permissions[role].permittedResources.includes(resource)) ||
            !(permissions[role][resource].permittedMethods.includes(method))) {
            res.status(403).send("Access Forbidden")
            return
        }

        // check if body does not conflict
        if (body) {
            const bodyPermission = permissions[role][resource][method];
            // check specific matching attributes
            for (var key in bodyPermission) {
                if (key !== '*' && bodyPermission.hasOwnProperty(key) && body.hasOwnProperty(key)) {
                    if (!(bodyPermission[key].includes(body[key]))) {
                        res.status(403).send("Access Forbidden")
                        return
                    }
                    // remove the attribute from final wildcard check
                    delete body[key]
                }
            }
            // check for wildcard attribute, need to check only if value is not also wildcard
            if (bodyPermission.hasOwnProperty('*') && bodyPermission['*'] !== '*') {
                for (var key in body) {
                    if (body.hasOwnProperty(key) && !(bodyPermission['*'].includes(body[key]))) {
                        res.status(403).send("Access Forbidden")
                        return
                    }
                }
            }
        }

        next()
    }
}