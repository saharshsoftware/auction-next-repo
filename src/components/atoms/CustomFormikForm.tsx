import { Form, Formik } from "formik";
import React from "react";

interface ICustomFormikForm {
  initialValues?: any;
  validationSchema?: any;
  handleSubmit: any;
  children: any;
  wantToUseFormikEvent?: boolean;
  formikRef?: any;
  enableReinitialize?: boolean;
}

const CustomFormikForm: React.FC<ICustomFormikForm> = (props) => {
  const {
    initialValues,
    validationSchema,
    handleSubmit,
    children,
    wantToUseFormikEvent = false,
    formikRef,
    enableReinitialize = false,
  } = props;

  const renderData = () => {
    if (wantToUseFormikEvent) {
      return children;
    }
    return <Form>{children}</Form>;
  };
  return (
    <>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={enableReinitialize}
      >
        {renderData()}
      </Formik>
    </>
  );
};

export default CustomFormikForm;
