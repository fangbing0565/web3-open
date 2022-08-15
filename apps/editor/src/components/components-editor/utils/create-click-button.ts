import { IBody, IFormPage, IField, ISection } from '@oec-open/ttspc-render';
import { EDITOR_TYPE } from '..';
import { CLASS_NAMES } from '../constants/class-name';
import { SchemaActionType, SCHEMA_ACTION } from './set-schema-json';

const createDiv = () => {
  return document.createElement('div');
};

export const getRelationFieldIds = (
  schemaJson: IFormPage,
  currentTargetNodeId?: string,
  currentTargetFieldId?: string,
): string[] => {
  if (!currentTargetNodeId) {
    return [];
  }

  const relationFieldIds = new Set<string>();

  schemaJson.body.sections.forEach((section: ISection) => {
    if (section.visible) {
      const matchs = `${section.visible}`
        ?.match(/values\.[a-zA-Z_0-9]+\s?/g)
        ?.map(i => i?.split('.')?.pop()?.trim());
      matchs?.forEach(match => {
        if (!match) {
          return;
        }
        console.log({
          currentTargetFieldId,
          match,
          section,
          currentTargetNodeId,
        });
        // if self
        if (section?.nodeId === currentTargetNodeId) {
          // match is not self
          if (match !== currentTargetFieldId) {
            const nodeId = getCurrentNodeIdByField(schemaJson, match)?.nodeId;
            if (nodeId) {
              relationFieldIds.add(nodeId);
            }
          }
        } else if (match === currentTargetFieldId) {
          console.log(section.nodeId, 'section node id !!!');
          // if others
          if (section.nodeId) {
            relationFieldIds.add(section.nodeId);
          }
        }
      });
    }
    section.children?.forEach((field: IField) => {
      if (field.disabled || field.visible) {
        const matchs = `${field.disabled} ${field.visible}`
          ?.match(/values\.[a-zA-Z_0-9]+\s?/g)
          ?.map(i => i?.split('.')?.pop()?.trim());
        matchs?.forEach(match => {
          if (!match) {
            return;
          }
          // if self
          if (field?.nodeId === currentTargetNodeId) {
            // match is not self
            if (match !== currentTargetFieldId) {
              const nodeId = getCurrentNodeIdByField(schemaJson, match)?.nodeId;
              if (nodeId) {
                relationFieldIds.add(nodeId);
              }
            }
          } else if (match === currentTargetFieldId) {
            // if others
            relationFieldIds.add(field.nodeId);
          }
        });
      }
    });
  });

  return Array.from(relationFieldIds);
};

export const getCurrentNodeIdByField = (
  schemaJson: IFormPage,
  fieldId?: string,
) => {
  if (!fieldId) {
    return {
      nodeId: null,
    };
  }

  let nodeId;

  schemaJson.body.sections.find(section => {
    return section.children?.find((field: IField) => {
      if (field?.field === fieldId) {
        nodeId = field.nodeId;
        return true;
      }
      return false;
    });
  });

  return {
    nodeId,
  };
};

export const getCurrentTargetById = (
  schemaJson: IFormPage,
  currentTargetId?: string,
) => {
  let currentItem: IField | ISection | undefined;
  let parentItem: IBody | ISection | undefined;
  let currentType: 'section' | 'field' | undefined;
  let currentFieldIndex = 0;
  let currentSectionIndex = 0;

  if (!currentTargetId) {
    return {
      currentSectionIndex,
      currentFieldIndex,
      currentType,
      current: currentItem,
      parent: parentItem,
    };
  }

  schemaJson.body.sections.find((section, sectionIndex) => {
    if (section?.nodeId === currentTargetId) {
      currentSectionIndex = sectionIndex;
      currentType = 'section';
      parentItem = schemaJson.body;
      currentItem = section;
      return true;
    }
    return section.children?.find((field: IField, fieldIndex) => {
      if (field?.nodeId === currentTargetId) {
        currentType = 'field';
        parentItem = section;
        currentItem = field;
        currentFieldIndex = fieldIndex;
        currentSectionIndex = sectionIndex;
        return true;
      }
      return false;
    });
  });
  return {
    currentSectionIndex,
    currentFieldIndex,
    currentType,
    current: currentItem,
    parent: parentItem,
  };
};

let tout: any;
let disabledHover = false;
let disabledClick = false;

export const createClickButton = ({
  currentTarget,
  setSchemaJson,
  setCurrentTargetId,
  setHoverTargetId,
  editorType,
  fieldType,
  sectionIndex = 0,
}: {
  currentTarget: any;
  setSchemaJson: (action: SchemaActionType) => void;
  setCurrentTargetId: any;
  setHoverTargetId: any;
  editorType: EDITOR_TYPE;
  fieldType: 'field' | 'section';
  sectionIndex?: number;
}) => {
  currentTarget.onclick = (e: any) => {
    // e.stopPropagation();
    if (disabledClick) {
      return;
    }
    disabledClick = true;
    setTimeout(() => {
      disabledClick = false;
    });
    const id = currentTarget.dataset.nodeId;
    setCurrentTargetId?.(String(id));
  };

  currentTarget.onmouseout = () => {
    if (disabledHover) {
      return;
    }
    clearTimeout(tout);
    tout = setTimeout(() => {
      setHoverTargetId(null);
    }, 100);
  };
  currentTarget.onmouseover = () => {
    // simulator stopPropagation
    // stopPropagation will be stop select hover
    if (disabledHover) {
      return;
    }
    disabledHover = true;
    setTimeout(() => {
      disabledHover = false;
    });
    clearTimeout(tout);
    const nodeId = currentTarget.dataset.nodeId;
    setHoverTargetId?.(String(nodeId));
  };
  currentTarget.ondragstart = () => {
    disabledHover = true;
  };
  currentTarget.ondragend = () => {
    disabledHover = false;
  };

  const children = currentTarget?.children;
  if (children?.length) {
    for (const item of children) {
      if (item?.classList?.contains?.(CLASS_NAMES.BIZ_CLICK_BUTTON_GROUP)) {
        currentTarget.removeChild(item);
      }
    }
  }

  const nodeId = currentTarget?.dataset?.nodeId;
  const $warpper = createDiv();
  $warpper.classList.add(CLASS_NAMES.BIZ_CLICK_BUTTON_GROUP);

  if (
    editorType === EDITOR_TYPE.BIZ_PAGE ||
    fieldType === 'field' ||
    sectionIndex > 0
  ) {
    const $deleteItem = createDiv();
    $deleteItem.classList.add(CLASS_NAMES.BIZ_CLICK_BUTTON_DELETE);
    $deleteItem.classList.add(CLASS_NAMES.BIZ_CLICK_BUTTON);
    $deleteItem.innerHTML = 'DELETE';
    $deleteItem.onclick = (e: any) => {
      e.stopPropagation();
      setSchemaJson({
        type: SCHEMA_ACTION.DELETE_BY_NODEID,
        payload: {
          nodeId,
        },
      });
    };
    $warpper.appendChild($deleteItem);
  }

  if (editorType === EDITOR_TYPE.BIZ_PAGE) {
    const $moveUp = createDiv();
    $moveUp.classList.add(CLASS_NAMES.BIZ_CLICK_BUTTON_UP);
    $moveUp.classList.add(CLASS_NAMES.BIZ_CLICK_BUTTON);
    $moveUp.innerHTML = 'MOVE UP';
    $moveUp.onclick = (e: any) => {
      e.stopPropagation();
      setSchemaJson({
        type: SCHEMA_ACTION.MOVE_UP,
        payload: {
          nodeId,
        },
      });
    };
    $warpper.appendChild($moveUp);

    const $moveDown = createDiv();
    $moveDown.classList.add(CLASS_NAMES.BIZ_CLICK_BUTTON_DOWN);
    $moveDown.classList.add(CLASS_NAMES.BIZ_CLICK_BUTTON);
    $moveDown.innerHTML = 'MOVE DOWN';
    $moveDown.onclick = (e: any) => {
      e.stopPropagation();

      setSchemaJson({
        type: SCHEMA_ACTION.MOVE_DOWN,
        payload: {
          nodeId,
        },
      });
    };
    $warpper.appendChild($moveDown);
  }

  return $warpper;
};

let clickWindowEvt: any;

export const onWindowClick = ({
  setCurrentTargetId,
}: {
  setCurrentTargetId: any;
}) => {
  window.removeEventListener('click', clickWindowEvt);
  clickWindowEvt = () => {
    if (disabledClick) {
      return;
    }
    setCurrentTargetId?.(null);
  };
  window.addEventListener('click', clickWindowEvt);
};
