CREATE DATABASE treasury;

\c treasury

CREATE TABLE divise (
    codiceDivise integer,
    descrizione varchar,
    cambio decimal,
    predefinita boolean,
    codiceIndustria integer,
    PRIMARY KEY (codiceDivise, codiceIndustria)
);

CREATE TABLE banche (
    codiceBanca integer,
    regioneSociale varchar,
    indirizzo varchar,
    citta varchar,
    cap varchar,
    partitaIva varchar,
    codiceFiscale varchar,
    codiceABI varchar,
    codiceCAB varchar,
    provincia varchar,
    gruppo integer,
    conto integer,
    gruppoexap integer,
    contoexap integer,
    codiceIndustria integer,
    PRIMARY KEY (codiceBanca, codiceIndustria)
);

CREATE TABLE societa (
    codiceSocieta integer,
    regioneSociale varchar,
    indirizzo varchar,
    citta varchar,
    cap varchar,
    provincia varchar,
    partitaIva varchar,
    codiceFiscale varchar,
    codiceSIA varchar,
    finanziatrice boolean,
    annullato boolean,
    progressivoFile integer,
    meseexap integer,
    codiceIndustria integer,
    PRIMARY KEY (codiceSocieta, codiceIndustria)
);

CREATE TABLE contiCorrenti (
    codiceSocieta integer,
    codiceBanca integer,
    codiceConto varchar,
    descrizioneConto varchar,
    fido integer,
    divisa integer,
    saldo decimal,
    IBAN varchar,
    sottoconto integer,
    nuovoconto varchar,
    appogio varchar,
    chiuso boolean,
    studio varchar,
    conto_expertup integer,
    sottoconto_expertup integer,
    lettera varchar,
    codiceIndustria integer,
    PRIMARY KEY (codiceSocieta, codiceBanca, codiceConto, codiceIndustria),
    CONSTRAINT FK_contiCorrenti_codiceSocieta FOREIGN KEY (codiceSocieta, codiceIndustria) REFERENCES societa(codiceSocieta, codiceIndustria),
    CONSTRAINT FK_contiCorrenti_codiceBanca FOREIGN KEY (codiceBanca, codiceIndustria) REFERENCES banche(codiceBanca, codiceIndustria),
    CONSTRAINT FK_contiCorrenti_divisa FOREIGN KEY (divisa, codiceIndustria) REFERENCES divise(codiceDivise, codiceIndustria)
);

CREATE TABLE causali (
    codiceCausali integer,
    descrizione varchar,
    flagRimborso boolean,
    causalePrassi integer,
    numeroFile integer,
    gruppoDare integer,
    contoDare integer,
    sottocontoDare integer,
    gruppoAvere integer,
    contoAvere integer,
    sottocontoAvere integer,
    gruppoDareEXAP integer,
    contoDareEXAP integer,
    sottocontoDareEXAP integer,
    gruppoAvereEXAP integer,
    contoAvereEXAP integer,
    sottocontoAvereEXAP integer,
    causaleEXAP integer,
    codiceIndustria integer,
    PRIMARY KEY (codiceCausali, codiceIndustria)
);

CREATE TABLE causali_OLD (
    codiceCausali integer,
    codiceIndustria integer,
    descrizione varchar,
    flagRimborso boolean,
    PRIMARY KEY (codiceCausali, codiceIndustria)
);

CREATE TABLE movimenti (
    codiceSocieta integer,
    codiceBanca integer,
    codiceConto integer,
    progressivo serial,
    dataOperazione date,
    causale integer,
    descrizioneOperazione varchar,
    importoDare decimal,
    divisaDare integer,
    importoAvere decimal,
    divisaAvere integer,
    dataValuta date,
    cambio integer,
    bonificoSocieta integer,
    bonificoBanca varchar,
    bonificoConto varchar,
    flagPregresso boolean,
    controValore decimal,
    tipoValuta varchar,
    genericoSoggetto varchar,
    genericoBanca varchar,
    genericoConto varchar,
    descrizioneAggiuntiva varchar,
    movimentoInviato boolean,
    utenteIns varchar,
    utenteMod varchar,
    autoriz varchar,
    codiceIndustria integer,
    PRIMARY KEY (codiceSocieta, codiceBanca, codiceConto, codiceIndustria, progressivo),
    CONSTRAINT FK_movimenti_codiceSocieta FOREIGN KEY (codiceSocieta, codiceIndustria) REFERENCES societa(codiceSocieta, codiceIndustria),
    CONSTRAINT FK_movimenti_codiceBanca FOREIGN KEY (codiceBanca, codiceIndustria) REFERENCES banche(codiceBanca, codiceIndustria),
    CONSTRAINT FK_movimenti_causale FOREIGN KEY (causale, codiceIndustria) REFERENCES causali_OLD(codiceCausali, codiceIndustria)
);

CREATE TABLE autoriz (
    codiceAutoriz integer,
    codiceIndustria integer,
    descrizione varchar,
    PRIMARY KEY (codiceAutoriz, codiceIndustria)
);

CREATE TABLE dataLimite (
    id integer PRIMARY KEY,
    dataLimite date,
    saldoFinale decimal
);

CREATE TABLE saldoPrecedente (
    codiceSocieta integer,
    codiceBanca integer,
    codiceConto integer,
    anno integer,
    saldo decimal,
    codiceIndustria integer,
    PRIMARY KEY(codiceSocieta, codiceBanca, codiceConto, codiceIndustria)
);


CREATE TABLE tipoValuta (
    codiceTipoValuta integer,
    descrizione varchar,
    codiceIndustria integer,
    PRIMARY KEY (codiceTipoValuta, codiceIndustria)
);

CREATE TABLE copiaMovimenti (
    codiceSocieta integer,
    codiceBanca integer,
    codiceConto integer,
    progressivo serial,
    dataOperazione date,
    causale integer,
    descrizioneOperazione varchar,
    importoDare decimal,
    divisaDare integer,
    importoAvere decimal,
    divisaAvere integer,
    dataValuta date,
    cambio integer,
    bonificoSocieta integer,
    bonificoBanca varchar,
    bonificoConto varchar,
    flagPregresso boolean,
    controValore decimal,
    tipoValuta varchar,
    genericoSoggetto varchar,
    genericoBanca varchar,
    genericoConto varchar,
    descrizioneAggiuntiva varchar,
    movimentoInviato boolean,
    utenteIns varchar,
    utenteMod varchar,
    autoriz varchar,
    codiceIndustria integer,
    PRIMARY KEY (codiceSocieta, codiceBanca, codiceConto, codiceIndustria, progressivo)
);

CREATE TABLE copiaContiCorrenti (
    codiceSocieta integer,
    codiceBanca integer,
    codiceConto varchar,
    descrizioneConto varchar,
    fido integer,
    divisa integer,
    saldo decimal,
    IBAN varchar,
    sottoconto integer,
    nuovoconto varchar,
    codiceIndustria integer,
    PRIMARY KEY (codiceSocieta, codiceBanca, codiceConto, codiceIndustria)
);

CREATE TABLE industrie (
    codiceIndustria integer PRIMARY KEY,
    descrizione varchar
);