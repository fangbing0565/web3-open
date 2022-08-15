import { DefaultRegion } from '@/constants/constant';
import {
  AdjustFeCategorySequenceRequest,
  categoryRuleAPIClient,
  CreateFeCategoryRequest,
  SearchFeCategoryTreeRequest,
  SearchFeCategoryTreeVersionRequest,
  UpdateFeCategoryRequest,
} from '@/api/operation/serv/oec_operation_category_rule_api';
import { Message } from '@arco-design/web-react';
import { DEFAULT_PAGE_SIZE } from './Tree/config';

export const GetCategoryTree = async (
  region: string = DefaultRegion,
  query: Record<string, any>,
) => {
  const { tree_name, tree_id, creator_name, version } = query;

  const cursor = (query.current - 1).toString();
  const size = query.pageSize;
  const create_time = query.create_time;
  const start_time = (create_time ? create_time[0] : 0) * 1000;
  const end_time = (create_time ? create_time[1] : 0) * 1000;

  const request: SearchFeCategoryTreeRequest = {
    tree_name,
    cursor,
    creator_name,
    start_time,
    end_time,
    size,
    version,
  };
  if (tree_id) {
    request.tree_id = tree_id;
  }
  try {
    const res = await categoryRuleAPIClient.SearchFeCategoryTree(request);
    return {
      total: res.data?.total || 0,
      data: res.data?.fe_category_trees || [],
    };
  } catch (err) {
    Message.error(err.message);
    return {
      total: 0,
      data: [],
    };
  }
};
export const GetCategoryTreeVersion = async (
  region: string = DefaultRegion,
  query: Record<string, any>,
) => {
  const cursor = query.current ? (query.current - 1).toString() : '0';
  const size = query.pageSize || DEFAULT_PAGE_SIZE;
  const { tree_id, version_name, version } = query;
  const create_time = query.create_time;
  const version_id = query.version_id;
  const start_time = (create_time ? create_time[0] : 0) * 1000;
  const end_time = (create_time ? create_time[1] : 0) * 1000;
  const request: SearchFeCategoryTreeVersionRequest = {
    tree_id,
    start_time,
    end_time,
    version_id,
    version,
    cursor,
    size,
  };

  if (version_name) {
    request.version_name = version_name;
  }
  try {
    const res = await categoryRuleAPIClient.SearchFeCategoryTreeVersion(
      request,
    );
    return {
      total: res.data?.total || 0,
      data: res.data?.fe_category_tree_versions || [],
    };
  } catch (err) {
    Message.error(err.message);
    return {
      total: 0,
      data: [],
    };
  }
};

/**  类目接口  */

export const addCategory = async (query: CreateFeCategoryRequest) => {
  const {
    tree_id,
    version_id,
    name,
    local_names,
    parent_id,
    front_category_id,
    image,
    is_leaf,
    be_category_ids,
  } = query;
  const request = {
    tree_id,
    version_id,
    name,
    local_names,
    parent_id,
    /** 排在前面的类目id */
    front_category_id,
    image,
    is_leaf,
    be_category_ids,
  };
  try {
    const res = await categoryRuleAPIClient.CreateFeCategory(request);
    return {
      message: res.message,
      code: res.code,
    };
  } catch (err) {
    Message.error(err.message);
    return {
      message: err.message,
      code: err.code,
    };
  }
};
export const updateCategory = async (query: UpdateFeCategoryRequest) => {
  const { tree_id, version_id, category_id, local_name, image } = query;
  const request = {
    tree_id,
    version_id,
    category_id,
    local_name,
    image,
  };
  try {
    const res = await categoryRuleAPIClient.UpdateFeCategory(request);
    return {
      message: res.message,
      code: res.code,
    };
  } catch (err) {
    Message.error(err.message);
    return {
      message: err.message,
      code: err.code,
    };
  }
};

export const deleteCategory = async (query: Record<string, any>) => {
  const { tree_id, version_id, category_id } = query;
  const request = {
    tree_id,
    version_id,
    category_id,
  };
  try {
    const res = await categoryRuleAPIClient.DeleteFeCategory(request);
    return {
      message: res.message,
      code: res.code,
    };
  } catch (err) {
    Message.error(err.message);
    return {
      total: 0,
      data: [],
    };
  }
};

export const listFirstLevelCategory = async (query: Record<string, any>) => {
  const { tree_id, version_id, version } = query;

  const request = {
    tree_id,
    version_id,
    version,
  };

  try {
    const res = await categoryRuleAPIClient.ListFirstLevelCategory(request);
    return {
      total: res.data?.fe_category_metas?.length || 0,
      data: res.data?.fe_category_metas || [],
    };
  } catch (err) {
    Message.error(err.message);
    return {
      total: 0,
      data: [],
    };
  }
};
export const CreateFeCategoryTree = async (query: Record<string, any>) => {
  const { name, desc, version } = query;

  const request = {
    name,
    desc,
    version,
  };

  try {
    const res = await categoryRuleAPIClient.CreateFeCategoryTree(request);
    return {
      message: res.message,
    };
  } catch (err) {
    Message.error(err.message);
    return {
      total: 0,
      data: [],
    };
  }
};

export const adjustFeCategorySequence = async (query: Record<string, any>) => {
  const { tree_id, version_id, category_id, front_category_id } = query;
  const request: AdjustFeCategorySequenceRequest = {
    tree_id,
    version_id,
    category_id,
    /** 前一个类目id(放第一个传0) */
    front_category_id,
  };
  try {
    const res = await categoryRuleAPIClient.AdjustFeCategorySequence(request);
    return {
      message: res.message,
    };
  } catch (err) {
    Message.error(err.message);
    return {
      total: 0,
      data: [],
    };
  }
};
