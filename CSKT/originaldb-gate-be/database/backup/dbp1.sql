
-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

SELECT pg_catalog.set_config('search_path', '', false);

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

-- CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;
--
-- Name: actors; Type: TABLE; Schema: public; Owner: postgres
--
-- tạo loại dữ liệu thông tin người 
CREATE TYPE public.Thong_Tin_Nguoi AS (
    Ho_ten VARCHAR(255),
    Cap_bac VARCHAR(255),
    Chuc_vu VARCHAR(255)
);
-- tạo bảng biên bản bàn giao 
CREATE TABLE public.Bien_Ban_Ban_Giao (
    id int NOT NULL PRIMARY KEY,
    Noi_Dung varchar(255),
    Thoi_gian date, 
    Loai_ban_giao INT NOT NULL CHECK (Loai_ban_giao IN (0, 1)), 
    Nguoi_giao_nhan public.Thong_Tin_Nguoi, -- gom nhóm họ tên , cấp bậc, chức vụ thành 1 nhóm 
    Ghi_chu varchar(255), 
    id_dv_g int  NOT Null, 
    id_dv_g int  not null, 
    id_CB int not null, -- cán bộ của p1 


);


ALTER TABLE public.Bien_Ban_Ban_Giao OWNER TO postgres;
--  tạo id sinh tự động 
CREATE SEQUENCE public.Bien_Ban_Ban_Giao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.Bien_Ban_Ban_Giao_id_seq OWNER TO postgres;

--
-- Name: actors_directus_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.Bien_Ban_Ban_Giao_id_seq  OWNED BY public.Bien_Ban_Ban_Giao.id;

-- Tạo bảng cán bộ 

CREATE TABLE public.Can_Bo (
    id int NOT NULL PRIMARY KEY,
    Ho_ten VARCHAR(255),
    Cap_bac VARCHAR(255),
    Chuc_vu VARCHAR(255), 
    Dia_Chi VARCHAR(255),
    SDT VARCHAR(10), 
    Que_Quan VARCHAR(255),
    id_TK int not null, -- cán bộ của p1 
);


ALTER TABLE public.Can_Bo OWNER TO postgres;
--  tạo id sinh tự động 
CREATE SEQUENCE public.Can_Bo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.Can_Bo_id_seq OWNER TO postgres;

--
-- Name: actors_directus_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.Can_Bo_id_seq  OWNED BY public.Can_Bo.id;

-- Chi tiết bàn giao 

CREATE TABLE public.Chi_Tiet_Ban_Giao(
    id int NOT NULL PRIMARY KEY,
    id_BBBG int not null,-- biên bản bàn giao 
    id_TB int not null, -- thiết bị
);


ALTER TABLE public.Chi_Tiet_Ban_Giao OWNER TO postgres;
--  tạo id sinh tự động 
CREATE SEQUENCE public.Chi_Tiet_Ban_Giao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.Chi_Tiet_Ban_Giao_id_seq OWNER TO postgres;

--
-- Name: actors_directus_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.Chi_Tiet_Ban_Giao_id_seq  OWNED BY public.Chi_Tiet_Ban_Giao.id;


-- Bảng Công việc 


CREATE TABLE public.Cong_Viec(
    id int NOT NULL PRIMARY KEY,
    Ten VARCHAR(255),
    Thoi_gian date, 
    Tinh_Trang INT NOT NULL CHECK (Loai_ban_giao IN (0, 1, 2)), -- 0 chưa thực hiện, 1 đang thực hiện, 2 hoàn thành  
    id_NCV int , -- thiết bị
);


ALTER TABLE public.Cong_Viec OWNER TO postgres;
--  tạo id sinh tự động 
CREATE SEQUENCE public.Cong_Viec_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.Cong_Viec_id_seq OWNER TO postgres;

--
-- Name: actors_directus_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.Cong_Viec_id_seq  OWNED BY public.Cong_Viec.id;

-- Bảng đầu việc 

CREATE TABLE public.Dau_Viec(
    id int NOT NULL PRIMARY KEY,
    Ten VARCHAR(255),
    Thoi_gian date, 
    Tinh_Trang INT NOT NULL CHECK (Loai_ban_giao IN (0, 1, 2)), -- 0 chưa thực hiện, 1 đang thực hiện, 2 hoàn thành  
    id_DV_C int , -- đầu việc cha 
    id_CB int not null, 
    id_HS int, 
    id_CV int not null
);


ALTER TABLE public.Dau_Viec OWNER TO postgres;
--  tạo id sinh tự động 
CREATE SEQUENCE public.Dau_Viec_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.Dau_Viec_id_seq OWNER TO postgres;

--
-- Name: actors_directus_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.Dau_Viec_id_seq  OWNED BY public.Dau_Viec.id;


-- Bảng đơn vị 

CREATE TABLE public.Don_Vi(
    id int NOT NULL PRIMARY KEY,
    Ten VARCHAR(255),
    Dia_Chi VARCHAR(255),
    id_DV_C int , -- đơn vị cha 
    
);


ALTER TABLE public.Don_Vi OWNER TO postgres;
--  tạo id sinh tự động 
CREATE SEQUENCE public.Don_Vi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.Don_Vi_id_seq OWNER TO postgres;

--
-- Name: actors_directus_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.Don_Vi_id_seq  OWNED BY public.Don_Vi.id;


-- Bảng hồ sơ  
CREATE TABLE public.Ho_So(
    id int NOT NULL PRIMARY KEY,
    Ten VARCHAR(255),
    Tom_tat VARCHAR(255),
    Thoi_gian timestamp, 
    id_NHS int , 
    id_TB int, -- thiết bị có hồ sơ liên quan ( có thể có hoặc không)
    
);


ALTER TABLE public.Ho_So OWNER TO postgres;
--  tạo id sinh tự động 
CREATE SEQUENCE public.Ho_So_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.Ho_So_id_seq OWNER TO postgres;

--
-- Name: actors_directus_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.Ho_So_id_seq  OWNED BY public.Ho_So.id;

-- bảng loại trang bị ( ví dụ: loại ECI, Máy tính... )
CREATE TABLE public.Loai_Trang_Bi(
    id int NOT NULL PRIMARY KEY,
    Ten VARCHAR(255),
   
    
);


ALTER TABLE public.Loai_Trang_Bi OWNER TO postgres;
--  tạo id sinh tự động 
CREATE SEQUENCE public.Loai_Trang_Bi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.Loai_Trang_Bi_id_seq OWNER TO postgres;

--
-- Name: actors_directus_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.Loai_Trang_Bi_id_seq  OWNED BY public.Loai_Trang_Bi.id;

--  bảng Nhóm công việc 
 
 CREATE TABLE public.Nhom_Cong_Viec(
    id int NOT NULL PRIMARY KEY,
    Ten VARCHAR(255),
    Ghi_chu VARCHAR(255),
    id_NCV_C int -- nhóm công việc cha    
    
);


ALTER TABLE public.Nhom_Cong_Viec OWNER TO postgres;
--  tạo id sinh tự động 
CREATE SEQUENCE public.Nhom_Cong_Viec_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.Nhom_Cong_Viec_id_seq OWNER TO postgres;

--
-- Name: actors_directus_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.Nhom_Cong_Viec_id_seq  OWNED BY public.Nhom_Cong_Viec.id;



-- Bảng nhóm hồ sơ 


 CREATE TABLE public.Nhom_Ho_So(
    id int NOT NULL PRIMARY KEY,
    Ten VARCHAR(255),
    Ghi_chu VARCHAR(255),
    id_NHS_C int -- nhóm hồ sơ cha    
    
);


ALTER TABLE public.Nhom_Ho_So OWNER TO postgres;
--  tạo id sinh tự động 
CREATE SEQUENCE public.Nhom_Ho_So_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.Nhom_Ho_So_id_seq OWNER TO postgres;

--
-- Name: actors_directus_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.Nhom_Ho_So_id_seq  OWNED BY public.Nhom_Ho_So.id;

-- Bảng nhóm trang bị ( ví dụ dự phòng ...)
 CREATE TABLE public.Nhom_Trang_Bi(
    id int NOT NULL PRIMARY KEY,
    Ten VARCHAR(255),
    
);


ALTER TABLE public.Nhom_Trang_Bi OWNER TO postgres;
--  tạo id sinh tự động 
CREATE SEQUENCE public.Nhom_Trang_Bi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.Nhom_Trang_Bi_id_seq OWNER TO postgres;

--
-- Name: actors_directus_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.Nhom_Trang_Bi_id_seq  OWNED BY public.Nhom_Trang_Bi.id;


-- Bảng sự cố 
 CREATE TABLE public.Su_Co(
    id int NOT NULL PRIMARY KEY,
    Ten VARCHAR(255),
    Noi_Dung VARCHAR(255), 
    Thoi_gian timestamp, 
    Tinh_Trang VARCHAR(255), 
    id_TB int
    
);


ALTER TABLE public.Su_Co OWNER TO postgres;
--  tạo id sinh tự động 
CREATE SEQUENCE public.Su_Co_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.Su_Co_id_seq OWNER TO postgres;

--
-- Name: actors_directus_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.Su_Co_id_seq  OWNED BY public.Su_Co.id;
-- Bang Hồ sơ_sự cố ( gom nhóm các hồ sơ liên quan đến sự cố)

 CREATE TABLE public.Ho_So_Su_Co(
    id int NOT NULL PRIMARY KEY,
    id_HS int not null, -- hố sơ
    id_SC int not null -- sự cố 
    
);


ALTER TABLE public.Ho_So_Su_Co OWNER TO postgres;
--  tạo id sinh tự động 
CREATE SEQUENCE public.Ho_So_Su_Co_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.Ho_So_Su_Co_id_seq OWNER TO postgres;

--
-- Name: actors_directus_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.Ho_So_Su_Co_id_seq  OWNED BY public.Ho_So_Su_Co.id;

-- Bảng tài khoản người dùng 

 CREATE TABLE public.Tai_Khoan(
    id int NOT NULL PRIMARY KEY,
    Ten_TK VARCHAR(255), 
    Mk VARCHAR(255)
    
);


ALTER TABLE public.Tai_Khoan OWNER TO postgres;
--  tạo id sinh tự động 
CREATE SEQUENCE public.Tai_Khoan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.Tai_Khoan_id_seq OWNER TO postgres;

--
-- Name: actors_directus_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.Tai_Khoan_id_seq  OWNED BY public.Tai_Khoan.id;

-- Bang Thiet Bị 
 CREATE TABLE public.Thiet_Bi(
    id int NOT NULL PRIMARY KEY,
    Ten VARCHAR(255),
    Ky_Hieu VARCHAR(255),
    Serial VARCHAR(255),
    Tinh_Trang VARCHAR(255),
    So_luong int, 
    Phan_Cap int, 
    Nguon_dau_tu VARCHAR(255), 
    Don_Vi_tinh VARCHAR(255),
    Hang_san_xuat VARCHAR(255),
    id_CB int , -- can bo quan ly trang thiet bi
    id_VT int , -- vi trí hiện tại của trang thiết bị 
    id_DV int, -- đơn vị biên chế trang bị 
    id_NTB int, -- nhóm thiết bị 
    id_LTB int not null, -- loại thiết bị 
    
    
);


ALTER TABLE public.Thiet_Bi OWNER TO postgres;
--  tạo id sinh tự động 
CREATE SEQUENCE public.Thiet_Bi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.Thiet_Bi_id_seq OWNER TO postgres;

--
-- Name: actors_directus_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.Thiet_Bi_id_seq  OWNED BY public.Thiet_Bi.id;


-- Bảng vị trí 
 CREATE TABLE public.Vi_Tri(
    id int NOT NULL PRIMARY KEY,
    Ten VARCHAR(255),
    id_VT_C int -- vị trí cha 
    
    
    
);


ALTER TABLE public.Vi_Tri OWNER TO postgres;
--  tạo id sinh tự động 
CREATE SEQUENCE public.Vi_Tri_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.Vi_Tri_id_seq OWNER TO postgres;

--
-- Name: actors_directus_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.Vi_Tri_id_seq  OWNED BY public.Vi_Tri

