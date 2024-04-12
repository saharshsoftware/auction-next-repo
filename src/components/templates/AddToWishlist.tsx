"use client"
import React, { useState } from 'react'
import TextField from '../atoms/TextField';
import ReactSelectDropdown from '../atoms/ReactSelectDropdown';
import { ItemRenderer, NoDataRendererDropdown } from '../atoms/NoDataRendererDropdown';
import { Field, Form } from 'formik';
import CustomFormikForm from '../atoms/CustomFormikForm';
import * as Yup from "yup";
import { ERROR_MESSAGE, REACT_QUERY, STRING_DATA } from '@/shared/Constants';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addPropertyToFavouriteList, fetchFavoriteList } from '@/server/actions/favouriteList';
import { IFavouriteList } from '@/types';
import { handleOnSettled } from '@/shared/Utilies';
import { useParams } from "next/navigation";
import ActionButton from '../atoms/ActionButton';
import { addPropertyToFavouriteListClient, fetchFavoriteListClient } from '@/services/favouriteList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCross } from '@fortawesome/free-solid-svg-icons';

const validationSchema = Yup.object({
  wishlist: Yup.string().required(ERROR_MESSAGE.LIST_REQUIRED),
});

const initialValues = {
  wishlist: STRING_DATA.EMPTY
};

const AddToWishlist = () => {
  const params = useParams<{ slug: string; item: string }>();

  const { data: favouriteListData, isLoading: isLoadingFavourite } = useQuery({
    queryKey: [REACT_QUERY.FAVOURITE_LIST],
    queryFn: async () => {
      const res = (await fetchFavoriteListClient()) as unknown as IFavouriteList[];
      return res ?? []
    },
  });

  // const queryClient = useQueryClient();
  const [respError, setRespError] = useState<string>("");

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: addPropertyToFavouriteListClient,
    onSettled: async (data) => {
      const response = {
        data,
        success: () => {
          // queryClient.invalidateQueries({
          //   queryKey: [REACT_QUERY.FAVOURITE_LIST],
          // });
        },
        fail: (error: any) => {
          const { message } = error;
          setRespError(message);
        },
      };
      handleOnSettled(response);
    },
  });

  const addPropertyToFavourite = (values: any) => {
    const body = {
      listId: values?.wishlist?.toString(),
      propertyId: params?.slug,
    };
    console.log(body);
    mutate(body);
    // resetForm();
  };

  const clearWishlist = (methods: any) => {
    methods.clearAll();
  };

  return (
    <>
      <div className="custom-common-header-class">
        {STRING_DATA.ADD_TO_LIST}
      </div>
      <div className="custom-common-header-detail-class p-4">
        <CustomFormikForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          wantToUseFormikEvent={true}
          enableReinitialize={true}
          handleSubmit={(values: any, actions: any) => {
            addPropertyToFavourite({ ...values });
            // document.getElementById("clear-dropdown-button")?.click();
            // actions.resetForm();
            setTimeout(() => {
              actions.setFieldValue("wishlist", null);
            }, 1000);
          }}
        >
          {({ setFieldValue }: any) => (
            <Form>
              <div className="flex flex-col gap-4 ">
                {/* {JSON.stringify(values?.wishlist)} */}
                <TextField name={"wishlist"} hasChildren={true}>
                  <Field name="wishlist">
                    {() => (
                      <ReactSelectDropdown
                        noDataRenderer={NoDataRendererDropdown}
                        itemRenderer={ItemRenderer}
                        options={favouriteListData ?? []}
                        placeholder={"Add to list"}
                        name={"wishlist"}
                        clearRenderer={({ methods }:{methods:any}) => (
                          <div id="clear-dropdown-button" onClick={()=>clearWishlist(methods)} className='hidden'><FontAwesomeIcon icon={faCross}/></div>
                        )}
                        clearable={true}
                        loading={isLoadingFavourite}
                        customClass="w-full "
                        onChange={(e: any) => {
                          setFieldValue("wishlist", e?.[0]?.id);
                        }}
                      />
                    )}
                  </Field>
                </TextField>
                <ActionButton
                  isSubmit={true}
                  text="Add"
                  isLoading={isPending}
                  disabled={isLoadingFavourite}
                  customClass="w-full"
                />
              </div>
            </Form>
          )}
        </CustomFormikForm>
      </div>
    </>
  );
}

export default AddToWishlist