import { useCallback, useEffect, useState } from "react";
import { getDistrictList, getProvinceList, getWardList } from "./index.action";

export enum CurrentAddressLevel {
  Province = "province",
  District = "district",
  Ward = "ward",
}

interface AddressState {
  provinces: any[];
  districts: any[];
  wards: any[];
  selectedProvince: string | null;
  selectedDistrict: string | null;
  selectedWard: string | null;
  currentLevel: CurrentAddressLevel;
  showDropdown: boolean;
  setSelectedProvince: (provinceId: string | null) => Promise<void>;
  setSelectedDistrict: (districtId: string | null) => Promise<void>;
  setSelectedWard: (wardId: string | null) => void;
  goBack: () => void;
  setShowDropdown: (show: boolean) => void;
  setCurrentLevel: (level: CurrentAddressLevel) => void;
}

const useAddress = (): AddressState => {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvinceState] = useState<string | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrictState] = useState<string | null>(
    null
  );
  const [selectedWard, setSelectedWardState] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState<CurrentAddressLevel>(
    CurrentAddressLevel.Province
  );
  const [showDropdown, setShowDropdownState] = useState<boolean>(false);

  const getProvinces = useCallback(async () => {
    const provinces = await getProvinceList();
    setProvinces(provinces);
  }, []);

  useEffect(() => {
    getProvinces();
  }, [getProvinces]);

  const setSelectedProvince = async (provinceId: string | null) => {
    setSelectedProvinceState(provinceId);
    setSelectedDistrictState(null);
    setSelectedWardState(null);
    setCurrentLevel(CurrentAddressLevel.District);

    if (provinceId !== null) {
      const districts = await getDistrictList(provinceId);
      setDistricts(districts);
      setWards([]);
    } else {
      setDistricts([]);
      setWards([]);
    }

    setShowDropdownState(true);
  };

  const setSelectedDistrict = async (districtId: string | null) => {
    setSelectedDistrictState(districtId);
    setSelectedWardState(null);
    setCurrentLevel(CurrentAddressLevel.Ward);

    if (districtId !== null) {
      const wards = await getWardList(districtId);
      setWards(wards);
    } else {
      setWards([]);
    }

    setShowDropdownState(true);
  };

  const setSelectedWard = (wardId: string | null) => {
    setSelectedWardState(wardId);
    setShowDropdownState(false);
  };

  const goBack = () => {
    if (currentLevel === CurrentAddressLevel.District) {
      setCurrentLevel(CurrentAddressLevel.Province);
      // setSelectedProvinceState(null);
      setSelectedDistrictState(null);
      setDistricts([]);
      setShowDropdownState(true);
    } else if (currentLevel === CurrentAddressLevel.Ward) {
      setCurrentLevel(CurrentAddressLevel.District);
      setSelectedDistrictState(null);
      setSelectedWardState(null);
      setWards([]);
      setShowDropdownState(true);
    }
  };

  const setShowDropdown = (show: boolean) => {
    setShowDropdownState(show);
  };

  return {
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    currentLevel,
    setCurrentLevel,
    showDropdown,
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedWard,
    goBack,
    setShowDropdown,
  };
};

export default useAddress;
