/**
 * This class handles all the connection to the various API services handled by the application
 */
const {
    Router
} = require('express')

// IMPORTS

// Halley section

const BuildingRoutes = require('./buildings.routes/buildings.routes')
const CampaignRoutes = require('./campaigns.routes/campaigns.routes')
const ClientRoutes = require('./clients.routes/clients.routes')

const ContractRoutes = require('./contracts.routes/contracts.routes')
const PresaleRoutes = require('./presales.routes/presales.routes')
const ProposalRoutes = require('./proposals.routes/proposals.routes')

const PropunitRoutes = require('./propunits.routes/propunit.routes')
const UserRoutes = require('./users.routes/users.routes')
const RoleRoutes = require('./dropdowns.routes/roles.routes')
const DestinationRoutes = require('./dropdowns.routes/destinations.routes')
const TypeRoutes = require('./dropdowns.routes/types.routes')
const CategoryRoutes = require('./dropdowns.routes/categories.routes')
const AddressRoutes = require('./dropdowns.routes/addresses.routes')

const FileUploadRoutes = require('./uploads.routes/files.uploads.routes')

const HealthRoutes = require('./health.routes/health.routes')
// ...

const router = new Router()

// URI path build section

router.use('/buildings', BuildingRoutes)
router.use('/campaigns', CampaignRoutes)
router.use('/clients', ClientRoutes)
router.use('/contracts', ContractRoutes)
router.use('/presales', PresaleRoutes)
router.use('/proposals', ProposalRoutes)
router.use('/propunits', PropunitRoutes)
router.use('/users', UserRoutes)
router.use('/roles', RoleRoutes)
router.use('/destinations', DestinationRoutes)
router.use('/types', TypeRoutes)
router.use('/categories', CategoryRoutes)
router.use('/addresses', AddressRoutes)

router.use('/upload', FileUploadRoutes) // upload files endpoint

router.use('/health', HealthRoutes)

module.exports = router