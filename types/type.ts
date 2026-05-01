import { StaticImageData } from 'next/image';

export type ImageType = {
  src: string | StaticImageData;
  alt: string;
};

export type IconType = React.ReactNode;

export type LinkType = {
  href: string;
  target?: string;
};

export type WysiwygType = {
  html?: string;
  jsx?: React.ReactNode;
};

export type ChartConfigType = Record<
  string,
  {
    label?: string;
    color?: string;
  }
>;

export type FormFieldValue = string | number | boolean | File | null | undefined;

export type FormData = Record<string, FormFieldValue>;

export type FormType = {
  schema: {
    type: 'object';
    properties: Record<
      string,
      {
        type: string;
        title?: string;
        description?: string;
        default?: FormFieldValue;
        enum?: (string | number)[];
        required?: boolean;
        validation?: {
          min?: number;
          max?: number;
          minLength?: number;
          maxLength?: number;
          pattern?: string;
          message?: string;
        };
        [key: string]: unknown;
      }
    >;
    required?: string[];
  };
  fields?: Array<{
    id: string;
    type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file' | 'hidden';
    name: string;
    label?: string;
    placeholder?: string;
    description?: string;
    required?: boolean;
    defaultValue?: FormFieldValue;
    options?: Array<{ label: string; value: string | number }>;
    validation?: {
      min?: number;
      max?: number;
      minLength?: number;
      maxLength?: number;
      pattern?: string;
      message?: string;
    };
    [key: string]: unknown;
  }>;
  uiSchema?: {
    columns?: number;
    spacing?: number;
    submitButtonText?: string;
    [key: string]: unknown;
  };
  submission?: {
    connectorId?: string;
    endpointId?: string;
    successMessage?: string;
  };
};

export type ApiResponse<T> = {
  message: string;
  statusCode: number;
  data: T;
  processID: string;
  duration: string;
};
