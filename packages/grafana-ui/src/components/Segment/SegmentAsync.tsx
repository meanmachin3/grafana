import React, { useState } from 'react';
import { SelectableValue } from '@grafana/data';
import { SegmentSelect } from './SegmentSelect';
import { OptionType, useExpandableLabel, SegmentProps } from '.';

export interface SegmentAsyncProps<T> extends SegmentProps<T> {
  loadOptions: () => Promise<Array<SelectableValue<T>>>;
}

export function SegmentAsync<T>({
  value,
  onChange,
  loadOptions,
  Component,
}: React.PropsWithChildren<SegmentAsyncProps<T>>) {
  const [selectPlaceholder, setSelectPlaceholder] = useState<string>('');
  const [loadedOptions, setLoadedOptions] = useState<OptionType<T>>([]);
  const [Label, width, expanded, setExpanded] = useExpandableLabel(false);

  if (!expanded) {
    return (
      <Label
        onClick={async () => {
          setSelectPlaceholder('Loading options...');
          const opts = await loadOptions();
          setLoadedOptions(opts);
          setSelectPlaceholder(opts.length ? '' : 'No options found');
        }}
        Component={Component || <a className="gf-form-label query-part">{value}</a>}
      />
    );
  }

  return (
    <SegmentSelect
      width={width}
      options={loadedOptions}
      noOptionsMessage={selectPlaceholder}
      onClickOutside={() => {
        setSelectPlaceholder('');
        setLoadedOptions([]);
        setExpanded(false);
      }}
      onChange={value => {
        setSelectPlaceholder('');
        setLoadedOptions([]);
        setExpanded(false);
        onChange(value);
      }}
    />
  );
}
