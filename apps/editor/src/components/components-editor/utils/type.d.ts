import { IPage } from '@oec-open/ttspc-render';

export interface EditorIPage extends IPage {
  page_options?: {
    i18n_key?: string;
    name_space?: string;
  };
}
