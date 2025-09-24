// /src/utils/filters/FiltersDetailStruk.ts
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";
import { normalizeToArray } from "@/utils/normalizeToArray";

export const FilterDetailStruk = (filters: FilterDetailStrukInput) => {
    const conditions = [];
    const params = [];

    // Filter untuk tanggal (startDate dan endDate)
    if (filters.startDate && filters.endDate) {
        conditions.push(
            `date_trunc('day',dtl_tanggal) BETWEEN $${params.length + 1} AND $${params.length + 2
            }`
        );
        params.push(filters.startDate, filters.endDate);
    } else {
        if (filters.startDate) {
            conditions.push(`date(dtl_tanggal) = $${params.length + 1}`);
            params.push(filters.startDate);
        }
        if (filters.endDate) {
            conditions.push(`date(dtl_tanggal) = $${params.length + 1}`);
            params.push(filters.endDate);
        }
    }
    // Filter Kode Member
    if (filters.noMember && filters.noMember !== "") {
        conditions.push(`dtl_cusno = $${params.length + 1}`);
        params.push(filters.noMember);
    }
    // Filter Nama Member
    if (filters.namaMember && filters.namaMember !== "") {
        conditions.push(`dtl_namamember LIKE $${params.length + 1}`);
        params.push(`%${filters.namaMember}%`);
    }

    // Filter Kode Divisi
    if (filters.div && filters.div !== "") {
        conditions.push(`dtl_k_div = $${params.length + 1}`);
        params.push(filters.div);
    }

    // Filter Kode Departement
    if (filters.dept && filters.dept !== "") {
        conditions.push(`(dtl_k_div||dtl_k_dept) = $${params.length + 1}`);
        params.push(filters.dept);
    }

    // Filter kode Kategori
    if (filters.kat && filters.kat !== "") {
        conditions.push(`(dtl_k_dept||dtl_k_katb) = $${params.length + 1}`);
        params.push(filters.kat);
    }
    // Filter kode Tag
    if (filters.tag && filters.tag !== "") {
        conditions.push(`dtl_k_tag = $${params.length + 1}`);
        params.push(filters.tag);
    }
    // Filter PLU
    if (filters.prdcd && filters.prdcd !== "") {
        conditions.push(`dtl_prdcd_ctn = $${params.length + 1}`);
        params.push(filters.prdcd);
    }

    // Filter Grup PLU
    if (filters.prdcdGrup && filters.prdcdGrup.length > 0) {
        conditions.push(`dtl_prdcd_ctn = ANY($${params.length + 1})`);
        params.push(filters.prdcdGrup);
    }

    // Filter Nama Barang
    if (filters.namaBarang && filters.namaBarang !== "") {
        conditions.push(`dtl_nama_barang LIKE $${params.length + 1}`);
        params.push(`%${filters.namaBarang}%`);
    }

    if (filters.barcode && filters.barcode !== "") {
        conditions.push(
            `dtl_prdcd_ctn = (SELECT substr(brc_barcode,1,6)||'0' FROM tbmaster_barcode WHERE brc_barcode = $${params.length + 1
            })`
        );
        params.push(filters.barcode);
    }

    if (filters.namaMember && filters.namaMember !== "") {
        conditions.push(`dtl_namamember like $${params.length + 1}`);
        params.push(`%${filters.namaMember}%`);
    }
    // Filter Non Tunai
    if (filters.nonTunai === "true") {
        conditions.push(`vir_method ~ '^(ISAKU|GOPAY|SHOPEEPAY|QRIS-)'`);
    }

    // Filter Struk
    if (filters.struk && filters.struk !== "") {
        conditions.push(`dtl_struk = $${params.length + 1}`);
        params.push(filters.struk);
    }

    // Filter Member Khusus
    if (filters.memberKhusus && filters.memberKhusus !== "") {
        conditions.push(`coalesce(dtl_memberkhusus,'N') = $${params.length + 1}`);
        params.push(filters.memberKhusus);
    }
    // Filter Outlet
    if (filters.outlet && filters.outlet !== "") {
        conditions.push(`dtl_outlet = $${params.length + 1}`);
        params.push(filters.outlet);
    }
    // Filter Sub Outlet
    if (filters.subOutlet && filters.subOutlet !== "") {
        conditions.push(`dtl_suboutlet = $${params.length + 1}`);
        params.push(filters.subOutlet);
    }
    // Filter Cash Back
    if (filters.cashback && filters.cashback.length > 0) {
        conditions.push(
            `dtl_struk = ANY(select to_char(tgl_trans,'yyyymmdd')||create_by||trans_no||'S' as cashback_struk from m_promosi_h where kd_promosi = ANY($${params.length + 1
            }))`
        );
        params.push(filters.cashback);
    }

    // Filter Cashback Aktif
    if (filters.cbAktif && filters.cbAktif !== "") {
        conditions.push(
            `dtl_prdcd_ctn = ANY(select cbd_prdcd from tbtr_cashback_dtl where cbd_kodepromosi = $${params.length + 1
            })`
        );
        params.push(filters.cbAktif);
    }
    // Filter Cashback Uc
    if (filters.cbUc && filters.cbUc !== "") {
        conditions.push(
            `dtl_prdcd_ctn = ANY(select cbd_prdcd from tbtr_cashback_dtl where cbd_kodepromosi = $${params.length + 1
            })`
        );
        params.push(filters.cbUc);
    }
    // Filter Cashback Redempoin
    if (filters.cbredempoin && filters.cbredempoin !== "") {
        conditions.push(
            `dtl_prdcd_ctn = ANY(select cbd_prdcd from tbtr_cashback_dtl where cbd_kodepromosi = $${params.length + 1
            })`
        );
        params.push(filters.cbredempoin);
    }
    // Filter Gift Aktif
    if (filters.gift && filters.gift !== "") {
        conditions.push(
            `dtl_prdcd_ctn = ANY(select gfd_prdcd from tbtr_gift_dtl where gfd_kodepromosi = $${params.length + 1
            })`
        );
        params.push(filters.gift);
    }
    // Filter Promo Gift
    if (filters.promo && filters.promo.length > 0) {
        conditions.push(
            `dtl_struk = ANY(select to_char(tgl_trans,'yyyymmdd')||create_by||trans_no||'S' as gift_struk from m_gift_h where kd_promosi = ANY($${params.length + 1
            }))`
        );
        params.push(filters.promo);
    }

    // Filter Kasir
    if (filters.kasir && filters.kasir.length > 0) {
        conditions.push(`dtl_kasir = ANY($${params.length + 1})`);
        params.push(filters.kasir);
    }

    // Filter Kasir Type
    if (filters.kasirType && filters.kasirType === "non-kss") {
        conditions.push(`dtl_kasir NOT LIKE 'IK%'`);
    } else if (filters.kasirType && filters.kasirType === "only-kss") {
        conditions.push(`dtl_kasir LIKE 'IK%'`);
    }
    // Filter Methode Type
    if (filters.methodType === "kum") {
        conditions.push(`dtl_method = 'TLM'`);
    } else if (filters.methodType === "virtual") {
        conditions.push(`dtl_method ~ '^(ISAKU|GOPAY|SHOPEEPAY|QRIS-)'`);
    }
    // Filter PLU Larangan
    if (filters.pluLarangan === "non-larangan") {
        conditions.push(
            `dtl_prdcd_ctn not in (select non_prdcd from tbmaster_plunonpromo)`
        );
    } else if (filters.pluLarangan === "larangan") {
        conditions.push(
            `dtl_prdcd_ctn in (select non_prdcd from tbmaster_plunonpromo)`
        );
    }
    // Filtert Kode supplier
    const kodeSuppliers = normalizeToArray(filters.kode_supplier);
    if (kodeSuppliers.length > 0) {
        conditions.push(`hgb_kodesupplier = ANY($${params.length + 1})`);
        params.push(kodeSuppliers);
    }
    // Filtert Nama Supplier
    if (filters.namaSupplier && filters.namaSupplier !== "") {
        conditions.push(`sup_namasupplier like $${params.length + 1}`);
        params.push(`%${filters.namaSupplier}%`);
    }
    // Filtert Monitoring Supplier
    if (filters.monitoringSupplier && filters.monitoringSupplier !== "") {
        conditions.push(`dtl_kodesupplier = ANY(select distinct msu_kodesupplier 
                                           from tbtr_monitoringsupplier 
                                          where msu_kodemonitoring = $${params.length + 1})`);
        params.push(filters.monitoringSupplier);
    }

    return {
        conditions:
            conditions.length > 0 ? `where ${conditions.join(" AND ")}` : "",
        params,
    };
};

// Fungsi untuk mengubah query menjadi objek
export const parseFiltersDetailStruk = (query: Partial<FilterDetailStrukInput>) => {
    const { ...rest } = query;

    return {
        ...rest,
    };
};