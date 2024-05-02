import React from 'react'
import CustomFormikForm from './CustomFormikForm';
import { Field, Form } from 'formik';
import { STRING_DATA } from '@/shared/Constants';
import TextField from './TextField';
import { useRouter } from 'next/navigation';
import { setDataInQueryParams } from '@/shared/Utilies';
import { ROUTE_CONSTANTS } from '@/shared/Routes';
import SearchSvg from '../svgIcons/SearchSvg';

const SearchKeywordComp = (props: {handleClick?: ()=>void }) => {
  const { handleClick=()=>{} } = props;
  const router = useRouter();

    const getFilterQuery = (values: {
      keyword?: string;
    }) => {
      // console.log(values, "Vakyes");
      const { keyword } = values;
      const filter = {
        page: 1,
        keyword,
      };
      // console.log(filter, "hero-filter");
      // debugger
      return setDataInQueryParams(filter);
    };

  const handleKeywordSearch = (values: any) => {

    handleClick?.()
    
    // console.log(values, "clicket")
    const q = getFilterQuery(values);
    console.log(q, values)
    router.push(`${ROUTE_CONSTANTS.AUCTION}?q=${q}`);
  };
  
  
  return (
    <>
      <CustomFormikForm
        initialValues={{ keyword: STRING_DATA.EMPTY }}
        handleSubmit={handleKeywordSearch}
        wantToUseFormikEvent={true}
      >
        {({ setFieldValue, values }: any) => (
          <Form>
            <TextField
              name={"keyword"}
              hasChildren={true}
            >
              <Field name="keyword">
                {() => (
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-[0.55rem] pointer-events-none text-base sm:text-sm">
                      <SearchSvg />
                    </div>
                    <input
                      type="text"
                      value={values.keyword}
                      name={"keyword"}
                      className="bg-gray-50 border border-brand-color text-gray-900 sm:text-sm hover:bg-gray-100 block w-full p-2 ps-[2rem] rounded"
                      autoComplete="false"
                      placeholder="Search"
                      onChange={(e) => {
                        setFieldValue("keyword", e.target.value);
                      }}
                    />
                  </div>
                )}
              </Field>
            </TextField>
          </Form>
        )}
      </CustomFormikForm>
    </>
  );
}

export default SearchKeywordComp