CREATE DATABASE halleydb;

GRANT ALL PRIVILEGES ON DATABASE halleydb TO halley_usr;

\c halleydb

CREATE TABLE "Mortgages" (
  "mortgageID" serial,
  "agreedValue" decimal,
  "remainingValue" decimal,
  "isFractioned" boolean,
  "rate" real,
  "bankName" varchar,
  "installmentAmount" decimal,
  "duration" varchar,
  "installmentFreq" varchar,
  "firstPaymentDate" date,
  "lastPaymentDate" date,
  PRIMARY KEY ("mortgageID")
);

CREATE TABLE "PrivateClients" (
  "privateClientID" serial,
  "fiscalCode" varchar,
  "name" varchar,
  "surname" varchar,
  "address" text,
  "city" varchar,
  "phoneNumber" varchar,
  "email" varchar,
  "birthDate" date,
  "numChildren" integer,
  "numFamilyMembers" integer,
  "maritalStatus" varchar,
  "profession" varchar,
  "workContractType" varchar,
  "workPlace" varchar,
  "startDate" date,
  "sector" varchar,
  "employeeClass" varchar,
  "annualPersonalIncome" decimal,
  "annualFamilyIncome" decimal,
  "avgMonthlyIncome" decimal,
  "registeredAsset" boolean,
  "currentMortgages" boolean,
  "currentFinancing" boolean,
  "bankName" varchar,
  "bankAccNumber" varchar,
  "referenceAgency" varchar,
  "educationLevel" varchar,
  "educationInstitute" varchar,
  "educationDate" date,
  "educationMark" real,
  "hobby" text,
  "hasPet" boolean,
  "note" text,
  "seniority" integer,
  "firstEncounter" text,
  PRIMARY KEY ("privateClientID")
);

CREATE TABLE "Users" (
   "userID" int4 NOT NULL DEFAULT nextval('"Users_userID_seq"'::regclass),
    "password" varchar,
    "role" varchar,
    "salt" varchar,
    "status" bool,
    "name" varchar,
    "surname" varchar,
    "company" varchar,
    "email" varchar NOT NULL,
    "telephone" varchar,
    "cellphone" varchar,
    "photoUrl" varchar,
  PRIMARY KEY ("userID")
);

CREATE TABLE "Contracts" (
  "contractID" serial,
  "proposalID" integer,
  "fileLocation" varchar,
  "paymentStatus" varchar,
  "status" varchar,
  "creationDate" timestamp,
  "startDate" date,
  "expireDate" date,
  "note" text,
  PRIMARY KEY ("contractID")
);

CREATE TABLE "Presales" (
  "presaleID" serial,
  "proposalID" integer,
  "expireDate" date,
  "status" varchar,
  "fileLocation" varchar,
  PRIMARY KEY ("presaleID")
);

CREATE TABLE "Type" (
  "typeID" serial,
  "name" varchar,
  PRIMARY KEY ("typeID")
);

CREATE TABLE "Destinations" (
  "destinationID" serial,
  "name" varchar,
  PRIMARY KEY ("destinationID")
);

CREATE TABLE "SaleDetails" (
  "saleDetailsID" serial,
  "possibleAdvance" text,
  "desiredMortgageInstallment" integer,
  "canBarter" boolean,
  "estimatedClientBarter" integer,
  PRIMARY KEY ("saleDetailsID")
);

CREATE TABLE "BusinessClients" (
  "businessClientID" serial,
  "fiscalCode" varchar,
  "vatNumber" varchar,
  "uniqueCode" varchar,
  "REA" varchar,
  "street" varchar,
  "CAP" varchar,
  "Comune" varchar,
  "Province" varchar,
  "PEC" varchar,
  "phoneNumber" varchar,
  "refName" varchar,
  "refEmail" varchar,
  "refPhoneNumber" varchar,
  "revenue" decimal,
  "numEmployee" varchar,
  "sector" varchar,
  "bankName" varchar,
  "note" text,
  "name" varchar,
  "headedAssets" boolean,
  "ongoingMortgages" boolean,
  "ongoingFunding" boolean,
  "bankAccountNunber" varchar,
  "referringAgency" varchar,
  "firstEncounter" text,
  PRIMARY KEY ("businessClientID")
);

CREATE TABLE "RentDetails" (
  "rentDetailsID" serial,
  "furnished" varchar,
  "possibleRedemption" integer,
  "numBathroom" integer,
  "bathroomType" text,
  "ownsPet" boolean,
  "paymentFreq" varchar,
  "contractDurationType" varchar,
  PRIMARY KEY ("rentDetailsID")
);

CREATE TABLE "Campaigns" (
  "campaignID" serial,
  "name" varchar,
  "percentDiscount" decimal,
  "expireDate" timestamp,
  "creationDate" timestamp,
  "campaignType" varchar ,
  "discountedMonths" integer,
  "note" text,
  PRIMARY KEY ("campaignID")
);

CREATE TABLE "Addresses" (
  "addressID" serial,
  "province" varchar,
  "CAP" varchar,
  "comune" varchar,
  "street" varchar,
  "region" varchar,
  PRIMARY KEY ("addressID")
);

CREATE TABLE "Categories" (
  "categoryID" serial,
  "name" varchar,
  PRIMARY KEY ("categoryID")
);

CREATE TABLE "Clients" (
  "clientID" serial,
  "customCode" varchar,
  "type" varchar,
  "interest" varchar,
  "privateClientID" integer,
  "businessClientID" integer,
  "creationDate" timestamp,
  "documentLocation" varchar,
  PRIMARY KEY ("clientID"),
  CONSTRAINT "FK_Clients.businessClientID"
    FOREIGN KEY ("businessClientID")
      REFERENCES "BusinessClients"("businessClientID"),
  CONSTRAINT "FK_Clients.privateClientID"
    FOREIGN KEY ("privateClientID")
      REFERENCES "PrivateClients"("privateClientID")
);

CREATE TABLE "Proposals" (
  "proposalID" serial,
  "ownerID" integer,
  "customCode" varchar,
  "proposalType" text,
  "proposalReason" text,
  "knowledgePath" text,
  "preferences" text,
  "observationsOnClient" text,
  "saleDetailsID" integer,
  "rentDetailsID" integer,
  "creationDate" timestamp,
  "lastEdit" timestamp,
  "stage" varchar,
  "committeeVoteResult" varchar,
  PRIMARY KEY ("proposalID"),
  CONSTRAINT "FK_Proposals.rentDetailsID"
    FOREIGN KEY ("rentDetailsID")
      REFERENCES "RentDetails"("rentDetailsID"),
  CONSTRAINT "FK_Proposals.ownerID"
    FOREIGN KEY ("ownerID")
      REFERENCES "Users"("userID"),
  CONSTRAINT "FK_Proposals.saleDetailsID"
    FOREIGN KEY ("saleDetailsID")
      REFERENCES "SaleDetails"("saleDetailsID")
);

CREATE TABLE "Buildings" (
  "buildingID" serial,
  "customCode" varchar,
  "initiative" varchar,
  "company" varchar,
  "accessories" text,
  "geoArea" varchar,
  "numFloors" integer,
  "destinationID" integer,
  "mortgageID" integer,
  PRIMARY KEY ("buildingID"),
  CONSTRAINT "FK_Buildings.destinationID"
    FOREIGN KEY ("destinationID")
      REFERENCES "Destinations"("destinationID"),
  CONSTRAINT "FK_Buildings.mortgageID"
    FOREIGN KEY ("mortgageID")
      REFERENCES "Mortgages"("mortgageID")
);

CREATE TABLE "PropertyUnits" (
  "propertyUnitID" serial,
  "customCode" varchar,
  "buildingID" integer,
  "destinationID" integer,
  "typeID" integer,
  "categoryID" integer,
  "mortgageID" integer,
  "addressID" integer,
  "civicNumber" varchar,
  "floor" varchar,
  "internalNumber" varchar,
  "stair" varchar,
  "unitCode" varchar,
  "creationDate" timestamp,
  "lastUpdate" timestamp,
  "description" text,
  "areaBalcony" real,
  "areaTerrace" real,
  "areaMezzanine" real,
  "areaLoggia" real,
  "areaGarden" real,
  "areaGarret" real,
  "areaOmoTotal" real,
  "areaTotal" real,
  "areaOmoCoeff" real,
  "energyClass" varchar,
  "overlooking" text,
  "photoLocation" varchar[],
  "blueprintLocation" varchar[],
  "status" varchar,
  "assignedTo" varchar,
  "mngmtCost" decimal,
  "priceSaleInitial" decimal,
  "priceSaleListing" decimal,
  "priceRentMonthly" decimal,
  "priceRentAnnual" decimal,
  "ctsFoglio" varchar,
  "ctsParticella" varchar,
  "ctsSubalterno" varchar,
  "ctsIMU" decimal,
  "ctsRendita" decimal,
  "ctsNoteRendita" text,
  "isObsolete" boolean,
  "areaOther" real,
  PRIMARY KEY ("propertyUnitID"),
  CONSTRAINT "FK_PropertyUnits.destinationID"
    FOREIGN KEY ("destinationID")
      REFERENCES "Destinations"("destinationID"),
  CONSTRAINT "FK_PropertyUnits.mortgageID"
    FOREIGN KEY ("mortgageID")
      REFERENCES "Mortgages"("mortgageID"),
  CONSTRAINT "FK_PropertyUnits.buildingID"
    FOREIGN KEY ("buildingID")
      REFERENCES "Buildings"("buildingID"),
  CONSTRAINT "FK_PropertyUnits.typeID"
    FOREIGN KEY ("typeID")
      REFERENCES "Type"("typeID"),
  CONSTRAINT "FK_PropertyUnits.categoryID"
    FOREIGN KEY ("categoryID")
      REFERENCES "Categories"("categoryID"),
  CONSTRAINT "FK_PropertyUnits.addressID"
    FOREIGN KEY ("addressID")
      REFERENCES "Addresses"("addressID")
);


CREATE TABLE "ClientTimelineEntries" (
  "entryID" serial,
  "clientID" integer,
  "date" date,
  "timelineText" text,
  "proposalID" integer,
  "propertyUnitID" integer,
  "contractID" integer,
  PRIMARY KEY ("entryID"),
  CONSTRAINT "FK_ClientTimelineEntries.clientID"
    FOREIGN KEY ("clientID")
      REFERENCES "Clients"("clientID"),
  CONSTRAINT "FK_ClientTimelineEntries.proposalID"
    FOREIGN KEY ("proposalID")
      REFERENCES "Proposals"("proposalID"),
  CONSTRAINT "FK_ClientTimelineEntries.contractID"
    FOREIGN KEY ("contractID")
      REFERENCES "Contracts"("contractID"),
  CONSTRAINT "FK_ClientTimelineEntries.propertyUnitID"
    FOREIGN KEY ("propertyUnitID")
      REFERENCES "PropertyUnits"("propertyUnitID")
);

CREATE TABLE "ProposalPropertyUnits" (
  "proposalID" integer,
  "propertyUnitID" integer,
  "proposedPrice" decimal,
  "isPertinence" boolean,
  PRIMARY KEY ("proposalID", "propertyUnitID"),
  CONSTRAINT "FK_ProposalPropertyUnits.propertyUnitID"
    FOREIGN KEY ("propertyUnitID")
      REFERENCES "PropertyUnits"("propertyUnitID"),
  CONSTRAINT "FK_ProposalPropertyUnits.proposalID"
    FOREIGN KEY ("proposalID")
      REFERENCES "Proposals"("proposalID")
);

CREATE TABLE "Payments" (
  "paymentID" serial,
  "contractID" integer,
  "expectedDate" date,
  "status" varchar,
  "amount" decimal,
  "paymentDate" date,
  PRIMARY KEY ("paymentID"),
  CONSTRAINT "FK_Payments.contractID"
    FOREIGN KEY ("contractID")
      REFERENCES "Contracts"("contractID")
);

CREATE TABLE "ProposalNotes" (
  "noteID" serial,
  "proposalID" integer,
  "userID" integer,
  "note" text,
  "creationDate" timestamp,
  "isCommittee" boolean,
  PRIMARY KEY ("noteID"),
  CONSTRAINT "FK_ProposalNotes.userID"
    FOREIGN KEY ("userID")
      REFERENCES "Users"("userID"),
  CONSTRAINT "FK_ProposalNotes.proposalID"
    FOREIGN KEY ("proposalID")
      REFERENCES "Proposals"("proposalID")
);

CREATE TABLE "CommiteeVote" (
  "proposalID" integer,
  "userID" integer,
  "vote" varchar,
  PRIMARY KEY ("proposalID", "userID"),
  CONSTRAINT "FK_CommiteeVote.userID"
    FOREIGN KEY ("userID")
      REFERENCES "Users"("userID"),
  CONSTRAINT "FK_CommiteeVote.proposalID"
    FOREIGN KEY ("proposalID")
      REFERENCES "Proposals"("proposalID")
);

CREATE TABLE "CampaignPropertyUnits" (
  "campaignID" integer,
  "propertyUnitID" integer,
  PRIMARY KEY ("campaignID", "propertyUnitID"),
  CONSTRAINT "FK_CampaignPropertyUnits.campaignID"
    FOREIGN KEY ("campaignID")
      REFERENCES "Campaigns"("campaignID"),
  CONSTRAINT "FK_CampaignPropertyUnits.propertyUnitID"
    FOREIGN KEY ("propertyUnitID")
      REFERENCES "PropertyUnits"("propertyUnitID")
);

CREATE TABLE "BuildingAddresses" (
  "buildingID" integer,
  "addressID" integer,
  PRIMARY KEY ("buildingID", "addressID"),
  CONSTRAINT "FK_BuildingAddresses.addressID"
    FOREIGN KEY ("addressID")
      REFERENCES "Addresses"("addressID"),
  CONSTRAINT "FK_BuildingAddresses.buildingID"
    FOREIGN KEY ("buildingID")
      REFERENCES "Buildings"("buildingID")
);

CREATE TABLE "ClientProposal" (
  "clientID" integer,
  "proposalID" integer,
  "role" varchar,
  PRIMARY KEY ("clientID", "proposalID"),
  CONSTRAINT "FK_ClientProposal.proposalID"
    FOREIGN KEY ("proposalID")
      REFERENCES "Proposals"("proposalID"),
  CONSTRAINT "FK_ClientProposal.clientID"
    FOREIGN KEY ("clientID")
      REFERENCES "Clients"("clientID")
);

CREATE TABLE "PropertyUnitPertinences" (
  "propertyUnitID" integer,
  "pertinenceID" integer,
  PRIMARY KEY ("propertyUnitID", "pertinenceID"),
  CONSTRAINT "FK_PropertyUnitPertinences.propertyUnitID"
    FOREIGN KEY ("propertyUnitID")
      REFERENCES "PropertyUnits"("propertyUnitID"),
  CONSTRAINT "FK_PropertyUnitPertinences.pertinenceID"
    FOREIGN KEY ("pertinenceID")
      REFERENCES "PropertyUnits"("propertyUnitID")
);


CREATE TABLE "PropertyUnitsOperations" (
  "propertyUnitOperationsID" serial,
  "propertyUnitID" integer,
  "operationType" varchar,
  "parentPUs" int[],
  PRIMARY KEY ("propertyUnitOperationsID"),
  CONSTRAINT "FK_PropertyUnitsOperations.propertyUnitID"
    FOREIGN KEY ("propertyUnitID")
      REFERENCES "PropertyUnits"("propertyUnitID")
);