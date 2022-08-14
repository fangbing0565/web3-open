import styles from './index.scss';
import { Input } from '@m4b-design/components';
import { useRegionList } from '@oec-open/ttspc-kits';
import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IconDown, IconSearch } from '@arco-design/web-react/icon';
import { List } from '@arco-design/web-react';
import Dropdown from '@m4b-design/dropdown';
import ProForm from '@m4b-design/pearl-pro-form';
import { ErrorMessageType } from '@/containers/login-page/sign-up';
import { LOGIN_FORM_FIELD } from '@/constants/error-code';

const SearchInput = ({
  regionList,
  setCountryCode,
  setVisible,
  getRegionListByKeywords,
}) => {
  const [keyword, setKeyword] = useState('');
  const [filterRegionList, setFilterRegionList] = useState(regionList);

  useEffect(() => {
    if (keyword) {
      setFilterRegionList(getRegionListByKeywords(keyword));
    } else {
      setFilterRegionList(regionList);
    }
  }, [keyword]);

  const sortRegionList = useMemo(() => {
    const list: { code: string; children: any[] }[] = [];
    const regionListCopy = [...filterRegionList];
    regionListCopy.sort((a, b) => (a.name > b.name ? 1 : -1));
    regionListCopy.forEach(region => {
      const firstLetter = region.name?.[0]?.toLocaleUpperCase();
      const item = list.find(i => i.code === firstLetter);
      if (item) {
        item.children.push(region);
      } else {
        list.push({
          code: firstLetter,
          children: [region],
        });
      }
    });
    list.sort((a, b) => (a.code > b.code ? 1 : -1));
    return list;
  }, [filterRegionList]);

  return (
    <div
      className={styles.searchInputWrapper}
      onClick={e => {
        e.stopPropagation();
      }}>
      <div>
        <Input
          prefix={<IconSearch className={styles.iconSearch} />}
          placeholder="Search"
          onChange={val => setKeyword(val)}
          size="default"></Input>
        <div>
          <List
            dataSource={sortRegionList}
            className={styles.listWrapper}
            virtualListProps={{
              height: 200,
            }}
            render={group => (
              <List.Item key={group.code} className={styles.listItem}>
                <div className={styles.countryCode}>{group.code}</div>
                <List
                  className={styles.listWrapper}
                  dataSource={group.children}
                  render={country => (
                    <List.Item key={country.code} className={styles.listItem}>
                      <div
                        className={styles.countryName}
                        onClick={e => {
                          e.stopPropagation();
                          setVisible(false);
                          setCountryCode(country.code);
                        }}>
                        {country.name} {country?.properties?.dial_code}
                      </div>
                    </List.Item>
                  )}></List>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

type PhoneInputType = {
  placeholder: string;
  label: string;
  field: string;
  required?: boolean;
  codeField: string;
  formRef?: any;
  phoneValidator?: any;
  onChange?: (val: string) => void;
  errorMessage?: ErrorMessageType;
  onChangeForm?: () => void;
};

const PhoneInput: React.FC<PropsWithChildren<PhoneInputType>> = ({
  placeholder,
  label,
  field,
  required,
  codeField,
  formRef,
  phoneValidator,
  onChange,
  errorMessage,
  onChangeForm,
}) => {
  const { regionList, getRegionInfoByCode, getRegionListByKeywords } =
    useRegionList();
  const [countryCode, setCountryCode] = useState('ID');
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<any>();
  const currentCountry = useMemo(
    () => getRegionInfoByCode(countryCode),
    [regionList, countryCode],
  );

  useEffect(() => {
    formRef.setFieldValue(
      'phoneDialCode',
      currentCountry?.properties?.dial_code || '',
    );
    onChangeForm?.();
  }, [currentCountry]);

  useEffect(() => {
    document.addEventListener('click', () => {
      setVisible(false);
    });
  }, []);

  return (
    <ProForm.Item
      label={label}
      field={field}
      required={required}
      rules={[
        {
          validator(val, cb) {
            if (
              errorMessage?.field === field ||
              errorMessage?.field === codeField
            ) {
              return cb(errorMessage?.content);
            }
            if (required && !val) {
              return cb(
                `Please enter your ${label.toLocaleLowerCase()} to continue the process.`,
              );
            }

            if (val && !/^\d*$/.test(val)) {
              return cb('Wrong format. Please type in again.');
            }

            if (phoneValidator) {
              return cb(phoneValidator?.(val));
            }

            return cb();
          },
        },
      ]}>
      <Input
        id="search-input"
        placeholder={placeholder}
        onChange={onChange}
        style={{ fontSize: 0 }}
        prefix={
          <Dropdown
            popupVisible={visible}
            unmountOnExit={false}
            droplist={
              <SearchInput
                regionList={regionList}
                setCountryCode={setCountryCode}
                setVisible={setVisible}
                getRegionListByKeywords={getRegionListByKeywords}
              />
            }
            trigger="click"
            getPopupContainer={() => inputRef.current}>
            <ProForm.Item
              field={codeField}
              style={{ margin: 0 }}
              showOptional={false}
              labelCol={{ style: { display: 'none' } }}>
              <div
                className={styles.preFixDropdown}
                ref={inputRef}
                onClick={e => {
                  e.stopPropagation();
                  setVisible(true);
                }}>
                <div className={styles.codeWrapper}>
                  <div>{countryCode}</div>
                  {currentCountry?.properties?.dial_code ? (
                    currentCountry?.properties?.dial_code
                  ) : (
                    <></>
                  )}
                </div>
                <IconDown />
              </div>
            </ProForm.Item>
          </Dropdown>
        }
      />
    </ProForm.Item>
  );
};

export default PhoneInput;
