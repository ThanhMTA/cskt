import dm_quocgia from "@app/assets/svg/Ban_CNTT/dm_quocgia.svg";
import dm_donvihanhchinh from "@app/assets/svg/Ban_CNTT/dm_donvihanhchinh.svg";
import dm_vung from "@app/assets/svg/Ban_CNTT/dm_vung.svg";
import dm_quankhu from "@app/assets/svg/Ban_CNTT/dm_quankhu.svg";
import dm_tinh from "@app/assets/svg/Ban_CNTT/dm_tinh.svg";
import dm_huyen from "@app/assets/svg/Ban_CNTT/dm_huyen.svg";
import dm_xa from "@app/assets/svg/Ban_CNTT/dm_xa.svg";
import dm_binhchung from "@app/assets/svg/Ban_CNTT/dm_xa.svg";
import dm_phongmaycntt from "@app/assets/svg/Ban_CNTT/dm_phongmaycntt.svg";
import dm_chucvu from "@app/assets/svg/Cuc_CB/dm_chucvu.svg";
import dm_capbac from "@app/assets/svg/Cuc_CB/dm_capbac.svg";
import dm_trinhdohocvan from "@app/assets/svg/Cuc_CB/dm_trinhdohocvan.svg";
import dm_donvi from "@app/assets/svg//Phong_QL/dm_donvi.svg";
import dm_donvitinh from "@app/assets/svg//Phong_QL/dm_donvitinh.svg";
import dm_lydotanggiam from "@app/assets/svg//Phong_QL/dm_lydotanggiam.svg";
import dm_tinhtrang from "@app/assets/svg//Phong_QL/dm_tinhtrang.svg";
import dm_trangbikythuat from "@app/assets/svg/Phong_QL/dm_trangbikythuat.svg";
import dm_chuyennganh from "@app/assets/svg/Phong_QL/dm_chuyennganh.svg";
import dm_nguyennhanhonghoc from "@app/assets/svg/Cuc_KT/dm_nguyennhanhonghoc.svg";
import dm_tosuachuacodong from "@app/assets/svg/Cuc_KT/dm_tosuachuacodong.svg";
import dm_mangxong from "@app/assets/svg/Cuc_KT/dm_mangxong.svg";
import dm_phanloaisuco from "@app/assets/svg/Cuc_KT/dm_phanloaisuco.svg";
import dm_khuvuc from "@app/assets/svg/Cuc_KT/dm_khuvuc.svg";
import dm_loainha from "@app/assets/svg/Cuc_HC/dm_loainha.svg";
import dm_loaivatchat from "@app/assets/svg/Cuc_HC/dm_loaivatchat.svg";
import dm_capquyetdinh from "@app/assets/svg/Cuc_HC/dm_capquyetdinh.svg";
import dm_loaitram from "@app/assets/svg/Cuc_TC/dm_loaitram.svg";
import dm_tram from "@app/assets/svg/Cuc_TC/dm_tram.svg";
import dm_cong from "@app/assets/svg/Cuc_TC/dm_cong.svg";
import dm_hopcap from "@app/assets/svg/Cuc_TC/dm_hopcap.svg";
import dm_xecodong from "@app/assets/svg/Cuc_TC/dm_xecodong.svg";
import dm_tuyencapquang from "@app/assets/svg/Cuc_TC/dm_tuyencapquang.svg";
import dm_dokhan from "@app/assets/svg/Cuc_VTBM/dm_dokhan.svg";
import dm_domat from "@app/assets/svg/Cuc_VTBM/dm_domat.svg";
import dm_loaivanban from "@app/assets/svg/Cuc_VTBM/dm_loaivanban.svg";
import ic_kieubang from "@app/assets/svg/XLSC/ic_kieubang.svg";
import ic_kieudanhsach from "@app/assets/svg/XLSC/ic_kieudanhsach.svg";
import ic_printer from "@app/assets/svg/XLSC/ic_printer.svg";
import ic_khaibaosc from "@app/assets/svg/XLSC/ic_khaibaosc.svg";
import ic_chuyennganh from "@app/assets/svg/XLSC/ic_chuyennganh.svg";
import ic_donvikhacphuc from "@app/assets/svg/XLSC/ic_donvikhacphuc.svg";
import ic_dukien from "@app/assets/svg/XLSC/ic_dukien.svg";
import ic_dvbdkt from "@app/assets/svg/XLSC/ic_dvbdkt.svg";
import ic_dvhtkt from "@app/assets/svg/XLSC/ic_dvhtkt.svg";
import ic_hientuong from "@app/assets/svg/XLSC/ic_hientuong.svg";
import ic_huongxuly from "@app/assets/svg/XLSC/ic_huongxuly.svg";
import ic_ketqua from "@app/assets/svg/XLSC/ic_ketqua.svg";
import ic_mucdohuhong from "@app/assets/svg/XLSC/ic_mucdohuhong.svg";
import ic_nguoilienhe from "@app/assets/svg/XLSC/ic_nguoilienhe.svg";
import ic_nguyennhan from "@app/assets/svg/XLSC/ic_nguyennhan.svg";
import ic_nguyennhankhachquan from "@app/assets/svg/XLSC/ic_nguyennhankhachquan.svg";
import ic_nguyennnhanchuquan from "@app/assets/svg/XLSC/ic_nguyennnhanchuquan.svg";
import ic_phanloaisuco from "@app/assets/svg/XLSC/ic_phanloaisuco.svg";
import ic_thietbihuhong from "@app/assets/svg/XLSC/ic_thietbihuhong.svg";
import ic_thoigianphanloaisc from "@app/assets/svg/XLSC/ic_thoigianphanloaisc.svg";
import ic_thoigiansc from "@app/assets/svg/XLSC/ic_thoigiansc.svg";
import ic_tinhchatsuco from "@app/assets/svg/XLSC/ic_tinhchatsuco.svg";
import ic_tramtuyen from "@app/assets/svg/XLSC/ic_tramtuyen.svg";
import ic_trangthai from "@app/assets/svg/XLSC/ic_trangthai.svg";
import ic_trucchihuy from "@app/assets/svg/XLSC/ic_trucchihuy.svg";
import ic_trucdbkt from "@app/assets/svg/XLSC/ic_trucdbkt.svg";
import ic_geo from "@app/assets/svg/CSBDKT/geo.svg";

export const GenerateIconDM = (key: string) => {
  switch (key) {
    case "/danh-muc-cntt/quoc-gia":
      return dm_quocgia;
    case "/danh-muc-cntt/don-vi-hanh-chinh":
      return dm_donvihanhchinh;
    case "/danh-muc-cntt/vung":
      return dm_vung;
    case "/danh-muc-cntt/quan-khu":
      return dm_quankhu;
    case "/danh-muc-cntt/tinh":
      return dm_tinh;
    case "/danh-muc-cntt/huyen":
      return dm_huyen;
    case "/danh-muc-cntt/xa":
      return dm_xa;
    case "/danh-muc-cntt/phong-may-cntt":
      return dm_phongmaycntt;
    case "/danh-muc-cntt/binh-chung":
      return dm_binhchung;
    case "/danh-muc-can-bo/chuc-vu":
      return dm_chucvu;
    case "/danh-muc-can-bo/cap-bac":
      return dm_capbac;
    case "/danh-muc-can-bo/trinh-do-hoc-van":
      return dm_trinhdohocvan;
    case "/danh-muc-quan-luc/don-vi-tinh":
    case "/danh-muc-ky-thuat/don-vi-tinh":
      return dm_donvitinh;
    case "/danh-muc-quan-luc/ly-do-tang-giam-trang-thiet-bi":
    case "/danh-muc-ky-thuat/ly-do-tang-giam-trang-thiet-bi":
      return dm_lydotanggiam;
    case "/danh-muc-quan-luc/tinh-trang-trang-thiet-bi":
    case "/danh-muc-ky-thuat/tinh-trang-trang-thiet-bi":
      return dm_tinhtrang;
    case "/danh-muc-quan-luc/chuyen-nganh":
    case "/danh-muc-ky-thuat/danh-muc-chuyen-nganh":
      return dm_chuyennganh;
    case "/danh-muc-ky-thuat/chung-loai-trang-thiet-bi":
      return dm_trangbikythuat;
    case "/danh-muc-quan-luc/loai-thiet-bi":
      return dm_lydotanggiam;
    case "/danh-muc-quan-luc/don-vi":
      return dm_donvi;
    case "/danh-muc-quan-luc/trang-bi-ky-thuat-nhom-I-II":
    case "/danh-muc-ky-thuat/trang-bi-ky-thuat-nhom-I-II":
    case "/danh-muc-cuc-chinh-tri/trang-bi-ky-thuat-nhom-I-II":
    case "/danh-muc-cuc-hau-can/trang-bi-ky-thuat-nhom-I-II":
      return dm_trangbikythuat;
    case "/danh-muc-ky-thuat/nguyen-nhan-hong-hoc":
      return dm_nguyennhanhonghoc;
    case "/danh-muc-ky-thuat/to-sua-chua-co-dong":
      return dm_tosuachuacodong;
    case "/danh-muc-ky-thuat/xu-ly-su-co":
      return dm_mangxong;
    case "/danh-muc-ky-thuat/phan-loai-su-co":
    case "/danh-muc-ky-thuat/nhom-trang-thiet-bi":

      return dm_phanloaisuco;
    case "/danh-muc-ky-thuat/mang-xong":
      return dm_mangxong;
    case "/danh-muc-ky-thuat/danh-muc-khu-vuc":
      return dm_khuvuc;
    case "/danh-muc-cuc-hau-can/loai-nha":
    case "/danh-muc-ky-thuat/hang-san-xuat":
      return dm_loainha;
    case "/danh-muc-cuc-hau-can/loai-vat-chat":
      return dm_loaivatchat;
    case "/danh-muc-cuc-hau-can/cap-quyet-dinh":
      return dm_capquyetdinh;
    case "/danh-muc-tac-chien/loai-tram-thong-tin":
      return dm_loaitram;
    case "/danh-muc-tac-chien/diem-dat-quoc-phong":
      return dm_loaitram;
    case "/danh-muc-tac-chien/tram-thong-tin":
    case "/danh-muc-quan-luc/vi-tri":
      return dm_tram;
    case "/danh-muc-tac-chien/tuyen-cap":
      return dm_tuyencapquang;
    case "/danh-muc-tac-chien/xe-co-dong":
      return dm_xecodong;
    case "/danh-muc-tac-chien/hop-cap-tu-cap":
      return dm_hopcap;
    case "/danh-muc-tac-chien/cong-be":
      return dm_cong;
    case "/danh-muc-tac-chien/cot":
      return dm_mangxong;
    case "/danh-muc-tac-chien/tuyen-cap-quang":
    case "/danh-muc-ky-thuat/nguon-dau-tu":
      return dm_tuyencapquang;
    case "/danh-muc-tac-chien/tuyen-cap-dong":
      return dm_tram;
    case "/danh-muc-tac-chien/tuyen-viba":
      return dm_mangxong;
    case "/van-thu-bao-mat/do-khan":
    case "/danh-muc-can-bo/can-bo":
      return dm_dokhan;
    case "/van-thu-bao-mat/do-mat":
      return dm_domat;
    case "/van-thu-bao-mat/loai-van-ban":
      return dm_loaivanban;
    default:
      return "";
  }
};

export {
  ic_kieubang,
  ic_kieudanhsach,
  ic_printer,
  ic_khaibaosc,
  ic_chuyennganh,
  ic_donvikhacphuc,
  ic_dukien,
  ic_dvbdkt,
  ic_dvhtkt,
  ic_hientuong,
  ic_huongxuly,
  ic_ketqua,
  ic_mucdohuhong,
  ic_nguoilienhe,
  ic_nguyennhan,
  ic_nguyennhankhachquan,
  ic_nguyennnhanchuquan,
  ic_phanloaisuco,
  ic_thietbihuhong,
  ic_thoigianphanloaisc,
  ic_thoigiansc,
  ic_tinhchatsuco,
  ic_tramtuyen,
  ic_trangthai,
  ic_trucchihuy,
  ic_trucdbkt,
  ic_geo,
};
