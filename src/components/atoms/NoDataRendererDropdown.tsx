import React from "react";

interface IItemRenderer {
  item: any;
  itemIndex?: number;
  props: any;
  state?: any;
  methods: any;
}

const ItemRenderer: React.FC<IItemRenderer> = ({
  item,
  props,
  methods,
}: {
  item: any;
  itemIndex?: number;
  props: any;
  state?: any;
  methods: any;
}) => {
  return (
    <div key={item[props.valueField]} onClick={() => methods.addItem(item)}>
      <div className="m-2 text-left">
        {item.emoji} {item[props.labelField]}
      </div>
    </div>
  );
};

const NoDataRendererDropdown: React.FC = () => {
  return (
    <p className="text-center">
      <strong>Ooops!</strong> No data found
    </p>
  );
};

export { NoDataRendererDropdown, ItemRenderer };
