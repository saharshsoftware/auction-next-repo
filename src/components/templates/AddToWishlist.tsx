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
      const res = (await fetchFavoriteList()) as unknown as IFavouriteList[];
      console.log(res, "list111");
      return res ?? [];
    },
  });

    // const queryClient = useQueryClient();
    const [respError, setRespError] = useState<string>("");

    // Mutations
    const { mutate, isPending } = useMutation({
      mutationFn: addPropertyToFavouriteList,
      onSettled: async (data) => {
        console.log(data);
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

    const addPropertyToFavourite = (values: { wishlist: string }) => {
      const body = {
        listId: values?.wishlist?.toString(),
        propertyId: params?.slug,
      };
      console.log(body)
      mutate(body);
    };

  return (
    <>
      <div className="custom-common-header-detail-class p-4">
        <CustomFormikForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          wantToUseFormikEvent={true}
          handleSubmit={addPropertyToFavourite}
        >
          {({ setFieldValue, values }: any) => (
            <Form>
              <div className="flex flex-col gap-4 ">
                <TextField name={"wishlist"} hasChildren={true}>
                  <Field name="wishlist">
                    {() => (
                      <ReactSelectDropdown
                        noDataRenderer={NoDataRendererDropdown}
                        itemRenderer={ItemRenderer}
                        options={favouriteListData ?? []}
                        placeholder={"Add to list"}
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
                  customClass='w-full'
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