import { LeftOutlined } from '@ant-design/icons';
import { Input, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { getDistrictList, getWardList } from './index.action';
import useAddress, { CurrentAddressLevel } from './useAddress';

export interface AddressValue {
    province: string | null;
    district: string | null;
    ward: string | null;
}

interface AddressComponentProps {
    value?: AddressValue;
    onChange?: (value: AddressValue) => void;
    placeholder?: string;
}

const { Option } = Select;
const { Search } = Input;

const AddressComponent: React.FC<AddressComponentProps> = ({
    value = { province: '', district: '', ward: '' },
    onChange,
    placeholder = 'Tỉnh/TP, Quận/huyện, Phường/xã',
}) => {
    const searchRef = useRef<any>(null);
    const { Province, District, Ward } = CurrentAddressLevel;
    const {
        provinces,
        districts,
        wards,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        setSelectedProvince,
        setSelectedDistrict,
        setSelectedWard,
        setCurrentLevel,
        currentLevel,
        goBack,
        showDropdown,
        setShowDropdown,
    } = useAddress();

    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        if (value) {
            if (value.province && value.province !== selectedProvince) {
                setSelectedProvince(value.province);
                getDistrictList(value.province).then(() => {
                    if (value.district) {
                        setSelectedDistrict(value.district);
                        getWardList(value.district).then(() => {
                            if (value.ward) {
                                setSelectedWard(value.ward);
                            }
                        });
                    }
                });
            }
        } else {
            setSelectedProvince(null);
            setSelectedDistrict(null);
            setSelectedWard(null);
        }
    }, [
        value,
        setSelectedProvince,
        setSelectedDistrict,
        setSelectedWard,
        selectedProvince,
        setCurrentLevel,
        Ward,
    ]);

    const handleSelectChange = (selectedValue: any) => {
        switch (currentLevel) {
            case Province:
                setSelectedProvince(selectedValue);
                if (onChange) {
                    onChange({
                        province: selectedValue,
                        district: null,
                        ward: null,
                    });
                }
                setShowDropdown(true);
                break;
            case District:
                setSelectedDistrict(selectedValue);
                setShowDropdown(true);
                if (onChange) {
                    onChange({ ...value, district: selectedValue, ward: null });
                }
                break;
            case Ward:
                setSelectedWard(selectedValue);
                setShowDropdown(false);
                if (onChange) {
                    onChange({ ...value, ward: selectedValue });
                }
                break;
            default:
                break;
        }
        setSearchText('');
    };

    const handleDropdownVisibleChange = (open: boolean) => {
        if (!open) {
            setShowDropdown(false);
        } else {
            setTimeout(() => {
                if (searchRef.current) {
                    searchRef.current.focus();
                }
            }, 100); // Adjust the timeout as needed
            setShowDropdown(true);
        }
    };

    const removeDiacritics = (str: string) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const filteredOptions = () => {
        const normalizedSearchText = removeDiacritics(searchText.toLowerCase());

        switch (currentLevel) {
            case Province:
                return provinces.filter((province) =>
                    removeDiacritics(province.name.toLowerCase()).includes(
                        normalizedSearchText
                    )
                );
            case District:
                return districts.filter((district) =>
                    removeDiacritics(district.name.toLowerCase()).includes(
                        normalizedSearchText
                    )
                );
            case Ward:
                return wards.filter((ward) =>
                    removeDiacritics(ward.name.toLowerCase()).includes(
                        normalizedSearchText
                    )
                );
            default:
                return [];
        }
    };

    const renderBackNavigation = () => {
        if (currentLevel === District) {
            return (
                <div
                    className="flex items-center cursor-pointer p-2 bg-[#E6F7FF]"
                    onClick={goBack}
                >
                    <LeftOutlined className="mr-2" />
                    <span>
                        {provinces.find((p) => p.id === selectedProvince)?.name}
                    </span>
                </div>
            );
        }
        if (currentLevel === Ward) {
            return (
                <div>
                    <div
                        className="flex items-center cursor-pointer p-2 bg-[#E6F7FF]"
                        onClick={() => {
                            goBack();
                        }}
                    >
                        <LeftOutlined className="mr-2" />
                        <span>
                            {
                                districts.find((d) => d.id === selectedDistrict)
                                    ?.name
                            }
                            ,{' '}
                            {
                                provinces.find((d) => d.id === selectedProvince)
                                    ?.name
                            }
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    };

    const renderSelectedAddress = () => {
        if (selectedProvince && selectedDistrict && selectedWard) {
            const provinceName = provinces.find(
                (p) => p.id === selectedProvince
            )?.name;
            const districtName = districts.find(
                (d) => d.id === selectedDistrict
            )?.name;
            const wardName = wards.find((w) => w.id === selectedWard)?.name;
            return `${wardName}, ${districtName}, ${provinceName}`;
        }
        return undefined;
    };

    return (
        <div className="max-w-md mx-auto w-full">
            <Select
                className='w-full'
                style={{ width: '100%' }}
                allowClear
                onClear={() => {
                    setCurrentLevel(CurrentAddressLevel.Province);
                }}
                value={renderSelectedAddress()}
                onChange={handleSelectChange}
                placeholder={placeholder}
                open={showDropdown}
                onDropdownVisibleChange={handleDropdownVisibleChange}
                popupClassName="rounded-md shadow-lg max-h-60 overflow-auto"
                dropdownRender={(menu) => (
                    <>
                        {renderBackNavigation()}
                        <div className="p-2">
                            <Search
                                placeholder={`Tìm kiếm ${currentLevel === Province
                                    ? 'tỉnh/TP'
                                    : currentLevel === District
                                        ? 'quận/huyện'
                                        : 'phường/xã'
                                    }`}
                                ref={searchRef}
                                onChange={(e) => setSearchText(e.target.value)}
                                value={searchText}
                                suffix={null}
                            />
                        </div>
                        {menu}
                    </>
                )}
            >
                {filteredOptions().map((option) => (
                    <Option key={option.id} value={option.id}>
                        {option.name}
                    </Option>
                ))}
            </Select>
        </div>
    );
};

export default AddressComponent;
