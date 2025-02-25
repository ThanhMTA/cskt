-- engine_room_categories
ALTER TABLE public.organizations add COLUMN code_ex character varying(255), add COLUMN id_ex character varying(255);

INSERT INTO public.directus_fields VALUES (988, 'organizations', 'code_ex', NULL, 'input', NULL, NULL, NULL, false, false, 16, 'full', NULL, NULL, NULL, false, NULL, NULL, NULL);
INSERT INTO public.directus_fields VALUES (989, 'organizations', 'id_ex', NULL, 'input', NULL, NULL, NULL, false, false, 17, 'full', NULL, NULL, NULL, false, NULL, NULL, NULL);
