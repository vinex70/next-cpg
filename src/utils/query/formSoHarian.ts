export const formSoHarianQuery = (
    // conditions: string,
    // params: (string | string[])[] = []
) => {
    return `
        select
        l.lks_prdcd as prdcd,
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
        coalesce(st_saldoakhir,0) as lpp,
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
            END AS FLAG,
            COALESCE(PQTY,0) AS plano_qty,
            COALESCE(Omi_recid4,0) AS omi_recid4,
            COALESCE(qty_rom,0) AS qty_rom
        from tbmaster_lokasi l
        left join tbmaster_prodmast on lks_prdcd = prd_prdcd
        left join tbmaster_stock on st_prdcd = l.lks_prdcd
            and st_lokasi = '01'
        LEFT JOIN (
                    SELECT LKS_PRDCD, SUM(LKS_QTY) AS PQTY
                    FROM TBMASTER_LOKASI
                    WHERE lks_prdcd NOT IN (
                        SELECT DISTINCT prd_prdcd
                        FROM tbmaster_prodmast
                        JOIN TBMASTER_STOCK ON prd_prdcd = ST_PRDCD
                        WHERE st_lokasi='01'
                        AND ST_SALDOAKHIR = 0
                        AND PRD_KODETAG IN ('A','H')
                    )
                    GROUP BY LKS_PRDCD
                ) lks ON PRD_PRDCD = lks.LKS_PRDCD

        LEFT JOIN (
                    SELECT SUBSTRING(pbo_pluigr FROM 1 FOR 6)||'0' AS PLUPB,
                        SUM(pbo_qtyrealisasi) AS Omi_recid4
                    FROM tbmaster_pbomi
                    LEFT JOIN tbtr_omikoli
                        ON okl_nokoli = pbo_nokoli
                    WHERE TO_CHAR(pbo_create_dt,'YYYY-MM') = TO_CHAR(CURRENT_DATE,'YYYY-MM')
                        AND pbo_recordid = '4'
                        AND okl_nokoli IS NULL
                    GROUP BY SUBSTRING(pbo_pluigr FROM 1 FOR 6)||'0'
                ) pb_omi ON PLUPB = PRD_PRDCD

        LEFT JOIN (
                    SELECT rom_prdcd AS plu_rom,
                        SUM(rom_qty) AS qty_rom
                    FROM tbtr_returomi
                    WHERE rom_tgldokumen::date >= CURRENT_DATE - INTERVAL '1 day'
                        AND rom_qty <> 0
                    GROUP BY rom_prdcd
                ) retur_omi ON prd_prdcd = plu_rom
    `;
}