export const formSoHarianQuery = (
    // conditions: string,
    // params: (string | string[])[] = []
) => {
    return `
        select
        lks_prdcd as plu,
        prd_deskripsipendek as desk,
        prd_unit||'/'||prd_frac as satuan,
        prd_kodetag as tag,
        CASE
            WHEN lks_koderak like 'G%'      THEN 'GUDANG'
            WHEN lks_koderak like 'HDH%'    THEN 'HADIAH'
            ELSE 'TOKO'
        END as area,
        lks_koderak||'.'||lks_kodesubrak||'.'||lks_tiperak||'.'||lks_shelvingrak||'.'||LKS_NOURUT  alamat,
        lks_modify_by as modif_by,
        lks_qty as plano,
        st_saldoakhir as lpp,
        st_avgcost as acost,
        CASE
                WHEN prd_flagnas='Y' AND (prd_flagigr='N' OR prd_flagigr IS NULL) AND (prd_flagomi='N' OR prd_flagomi IS NULL) AND (prd_flagobi='N' OR prd_flagobi IS NULL) AND (prd_flagidm='N' OR prd_flagidm IS NULL) THEN 'NASIONAL'
                WHEN (prd_flagnas='N' OR prd_flagnas IS NULL) AND prd_flagigr='Y' AND (prd_flagomi='N' OR prd_flagomi IS NULL) AND (prd_flagobi='N' OR prd_flagobi IS NULL) AND (prd_flagidm='N' OR prd_flagidm IS NULL) THEN 'IGR'
                WHEN (prd_flagnas='N' OR prd_flagnas IS NULL) AND (prd_flagigr='N' OR prd_flagigr IS NULL) AND prd_flagomi='Y' AND (prd_flagobi='N' OR prd_flagobi IS NULL) AND (prd_flagidm='N' OR prd_flagidm IS NULL) THEN 'OMI'
                WHEN (prd_flagnas='N' OR prd_flagnas IS NULL) AND (prd_flagigr='N' OR prd_flagigr IS NULL) AND (prd_flagomi='N' OR prd_flagomi IS NULL) AND prd_flagobi='Y' AND (prd_flagidm='N' OR prd_flagidm IS NULL) THEN 'K.IGR'
                WHEN (prd_flagnas='N' OR prd_flagnas IS NULL) AND (prd_flagigr='N' OR prd_flagigr IS NULL) AND (prd_flagomi='N' OR prd_flagomi IS NULL) AND (prd_flagobi='N' OR prd_flagobi IS NULL) AND prd_flagidm='Y' THEN 'IDM ONLY'
                WHEN prd_flagnas='Y' AND prd_flagigr='Y' AND (prd_flagomi='N' OR prd_flagomi IS NULL) AND (prd_flagobi='N' OR prd_flagobi IS NULL) AND (prd_flagidm='N' OR prd_flagidm IS NULL) THEN 'NAS+IGR'
                WHEN prd_flagnas='Y' AND (prd_flagigr='N' OR prd_flagigr IS NULL) AND prd_flagomi='Y' AND (prd_flagobi='N' OR prd_flagobi IS NULL) AND (prd_flagidm='N' OR prd_flagidm IS NULL) THEN 'NAS+OMI'
                WHEN prd_flagnas='Y' AND (prd_flagigr='N' OR prd_flagigr IS NULL) AND (prd_flagomi='N' OR prd_flagomi IS NULL) AND prd_flagobi='Y' AND (prd_flagidm='N' OR prd_flagidm IS NULL) THEN 'NAS+K.IGR'
                WHEN prd_flagnas='Y' AND (prd_flagigr='N' OR prd_flagigr IS NULL) AND (prd_flagomi='N' OR prd_flagomi IS NULL) AND (prd_flagobi='N' OR prd_flagobi IS NULL) AND prd_flagidm='Y' THEN 'NAS+IDM'
                WHEN (prd_flagnas='N' OR prd_flagnas IS NULL) AND prd_flagigr='Y' AND prd_flagomi='Y' AND (prd_flagobi='N' OR prd_flagobi IS NULL) AND (prd_flagidm='N' OR prd_flagidm IS NULL) THEN 'IGR+OMI'
                WHEN (prd_flagnas='N' OR prd_flagnas IS NULL) AND prd_flagigr='Y' AND (prd_flagomi='N' OR prd_flagomi IS NULL) AND prd_flagobi='Y' AND (prd_flagidm='N' OR prd_flagidm IS NULL) THEN 'IGR+K.IGR'
                WHEN (prd_flagnas='N' OR prd_flagnas IS NULL) AND prd_flagigr='Y' AND (prd_flagomi='N' OR prd_flagomi IS NULL) AND (prd_flagobi='N' OR prd_flagobi IS NULL) AND prd_flagidm='Y' THEN 'IGR+IDM'
                WHEN (prd_flagnas='N' OR prd_flagnas IS NULL) AND (prd_flagigr='N' OR prd_flagigr IS NULL) AND prd_flagomi='Y' AND prd_flagobi='Y' AND (prd_flagidm='N' OR prd_flagidm IS NULL) THEN 'OMI+K.IGR'
                WHEN (prd_flagnas='N' OR prd_flagnas IS NULL) AND (prd_flagigr='N' OR prd_flagigr IS NULL) AND prd_flagomi='Y' AND (prd_flagobi='N' OR prd_flagobi IS NULL) AND prd_flagidm='Y' THEN 'OMI+IDM'
                WHEN (prd_flagnas='N' OR prd_flagnas IS NULL) AND (prd_flagigr='N' OR prd_flagigr IS NULL) AND (prd_flagomi='N' OR prd_flagomi IS NULL) AND prd_flagobi='Y' AND prd_flagidm='Y' THEN 'K.IGR+IDM'
                WHEN prd_flagnas='Y' AND prd_flagigr='Y' AND prd_flagomi='Y' AND (prd_flagobi='N' OR prd_flagobi IS NULL) AND (prd_flagidm='N' OR prd_flagidm IS NULL) THEN 'NAS+IGR+OMI'
                WHEN prd_flagnas='Y' AND prd_flagigr='Y' AND (prd_flagomi='N' OR prd_flagomi IS NULL) AND prd_flagobi='Y' AND (prd_flagidm='N' OR prd_flagidm IS NULL) THEN 'NAS+IGR+K.IGR'
                WHEN prd_flagnas='Y' AND prd_flagigr='Y' AND (prd_flagomi='N' OR prd_flagomi IS NULL) AND (prd_flagobi='N' OR prd_flagobi IS NULL) AND prd_flagidm='Y' THEN 'NAS+IGR+IDM'
                WHEN (prd_flagnas='N' OR prd_flagnas IS NULL) AND prd_flagigr='Y' AND prd_flagomi='Y' AND prd_flagobi='Y' AND (prd_flagidm='N' OR prd_flagidm IS NULL) THEN 'IGR+OMI+K.IGR'
                WHEN (prd_flagnas='N' OR prd_flagnas IS NULL) AND prd_flagigr='Y' AND prd_flagomi='Y' AND (prd_flagobi='N' OR prd_flagobi IS NULL) AND prd_flagidm='Y' THEN 'IGR+OMI+IDM'
                WHEN (prd_flagnas='N' OR prd_flagnas IS NULL) AND (prd_flagigr='N' OR prd_flagigr IS NULL) AND prd_flagomi='Y' AND prd_flagobi='Y' AND prd_flagidm='Y' THEN 'OMI+K.IGR+IDM'
                WHEN prd_flagnas='Y' AND prd_flagigr='Y' AND prd_flagomi='Y' AND prd_flagobi='Y' AND (prd_flagidm='N' OR prd_flagidm IS NULL) THEN 'NAS+IGR+OMI+K.IGR'
                WHEN prd_flagnas='Y' AND prd_flagigr='Y' AND prd_flagomi='Y' AND (prd_flagobi='N' OR prd_flagobi IS NULL) AND prd_flagidm='Y' THEN 'NAS+IGR+OMI+IDM'
                WHEN (prd_flagnas='N' OR prd_flagnas IS NULL) AND prd_flagigr='Y' AND prd_flagomi='Y' AND prd_flagobi='Y' AND prd_flagidm='Y' THEN 'IGR+OMI+K.IGR+IDM'
                WHEN prd_flagnas='Y' AND prd_flagigr='Y' AND prd_flagomi='Y' AND prd_flagobi='Y' AND prd_flagidm='Y' THEN 'NAS+IGR+OMI+K.IGR+IDM'
                WHEN (prd_flagnas='N' OR prd_flagnas IS NULL) AND (prd_flagigr='N' OR prd_flagigr IS NULL) AND (prd_flagomi='N' OR prd_flagomi IS NULL) AND (prd_flagobi='N' OR prd_flagobi IS NULL) AND (prd_flagidm='N' OR prd_flagidm IS NULL) THEN 'TIDAK ADA FLAG'
                ELSE ' '
            END AS FLAG
        from tbmaster_lokasi
        left join tbmaster_prodmast on lks_prdcd = prd_prdcd
        left join tbmaster_stock on st_prdcd = lks_prdcd
        and st_lokasi = '01'
    `;
}