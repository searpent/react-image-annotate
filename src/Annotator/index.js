// @flow

import type {
  Action,
  Image,
  MainLayoutState,
  Mode,
  ToolEnum,
  Metadata,
  MetadataConfig
} from "../MainLayout/types"
import React, { useEffect, useReducer } from "react"
import makeImmutable, { without } from "seamless-immutable"

import type { KeypointsDefinition } from "../ImageCanvas/region-tools"
import MainLayout from "../MainLayout"
import type { Node } from "react"
import SettingsProvider from "../SettingsProvider"
import combineReducers from "./reducers/combine-reducers.js"
import generalReducer from "./reducers/general-reducer.js"
import getFromLocalStorage from "../utils/get-from-local-storage"
import historyHandler from "./reducers/history-handler.js"
import imageReducer from "./reducers/image-reducer.js"
import useEventCallback from "use-event-callback"
import videoReducer from "./reducers/video-reducer.js"

type Props = {
  taskDescription?: string,
  help?: string,
  allowedArea?: { x: number, y: number, w: number, h: number },
  regionTagList?: Array<string>,
  regionClsList?: Array<string>,
  imageTagList?: Array<string>,
  imageClsList?: Array<string>,
  enabledTools?: Array<string>,
  selectedTool?: String,
  showTags?: boolean,
  selectedImage?: string | number,
  images?: Array<Image>,
  showPointDistances?: boolean,
  pointDistancePrecision?: number,
  RegionEditLabel?: Node,
  onExit: (MainLayoutState) => any,
  videoTime?: number,
  videoSrc?: string,
  keyframes?: Object,
  videoName?: string,
  keypointDefinitions: KeypointsDefinition,
  fullImageSegmentationMode?: boolean,
  autoSegmentationOptions?:
  | {| type: "simple" |}
    | {| type: "autoseg", maxClusters ?: number, slicWeightFactor ?: number |},
hideHeader ?: boolean,
  hideHeaderText ?: boolean,
  hideNext ?: boolean,
  hidePrev ?: boolean,
  hideClone ?: boolean,
  hideSettings ?: boolean,
  hideFullScreen ?: boolean,
  hideSave ?: boolean,
  onImagesChange ?: (any) => any,
  groups ?: Array < any >,
  onGroupSelect ?: (any) => any,
  hideHistory ?: boolean,
  hideNotEditingLabel ?: boolean,
  showEditor ?: boolean,
  showPageSelector ?: boolean,
  clsColors ?: Object,
  groupColors ?: Array < string >,
  onRecalc ?: (any) => any,
  onSave ?: (any) => any,
  albumMetadata ?: Array < Metadata >,
  metadataConfigs ? : Array < MetadataConfig >,
  lockedImages ?: Array < string >
}

export const Annotator = ({
  images,
  allowedArea,
  selectedImage = images && images.length > 0 ? 0 : undefined,
  showPointDistances,
  pointDistancePrecision,
  showTags = getFromLocalStorage("showTags", true),
  enabledTools = [
    "select",
    "create-point",
    "create-box",
    "create-polygon",
    "create-line",
    "create-expanding-line",
    "show-mask",
  ],
  selectedTool = "select",
  regionTagList = [],
  regionClsList = [],
  imageTagList = [],
  imageClsList = [],
  keyframes = {},
  taskDescription = "",
  help = "",
  fullImageSegmentationMode = false,
  RegionEditLabel,
  videoSrc,
  videoTime = 0,
  videoName,
  onExit,
  onNextImage,
  onPrevImage,
  keypointDefinitions,
  autoSegmentationOptions = { type: "autoseg" },
  hideHeader,
  hideHeaderText,
  hideNext,
  hidePrev,
  hideClone,
  hideSettings,
  hideFullScreen,
  hideSave,
  allowComments,
  onImagesChange,
  groups,
  onGroupSelect,
  hideHistory,
  hideNotEditingLabel,
  showEditor,
  showPageSelector,
  clsColors = {},
  groupColors,
  onRecalc,
  onSave,
  albumMetadata,
  metadataConfigs,
  lockedImages = []
}: Props) => {
  if (typeof selectedImage === "string") {
    selectedImage = (images || []).findIndex((img) => img.src === selectedImage)
    if (selectedImage === -1) selectedImage = undefined
  }
  const annotationType = images ? "image" : "video"
  const [state, dispatchToReducer] = useReducer(
    historyHandler(
      combineReducers(
        annotationType === "image" ? imageReducer : videoReducer,
        generalReducer
      )
    ),
    makeImmutable({
      annotationType,
      showTags,
      allowedArea,
      showPointDistances,
      pointDistancePrecision,
      selectedTool,
      fullImageSegmentationMode: fullImageSegmentationMode,
      autoSegmentationOptions,
      mode: null,
      taskDescription,
      help,
      showMask: true,
      labelImages: imageClsList.length > 0 || imageTagList.length > 0,
      regionClsList,
      regionTagList,
      imageClsList,
      imageTagList,
      currentVideoTime: videoTime,
      enabledTools,
      history: [],
      videoName,
      keypointDefinitions,
      allowComments,
      ...(annotationType === "image"
        ? {
          selectedImage,
          images,
          selectedImageFrameTime:
            images && images.length > 0 ? images[0].frameTime : undefined,
        }
        : {
          videoSrc,
          keyframes,
        }),
      imagesUpdatedAt: null,
      imagesSavedAt: null,
      albumMetadata,
      metadataConfigs
    })
  )

  const dispatch = useEventCallback((action: Action) => {
    if (action.type === "HEADER_BUTTON_CLICKED") {
      if (["Exit", "Done", "Save", "Complete"].includes(action.buttonName)) {
        return onExit(without(state, "history"))
      } else if (action.buttonName === "Next" && onNextImage) {
        return onNextImage(without(state, "history"))
      } else if (action.buttonName === "Prev" && onPrevImage) {
        return onPrevImage(without(state, "history"))
      }
    }
    dispatchToReducer(action)
  })

  const onRegionClassAdded = useEventCallback((cls) => {
    dispatchToReducer({
      type: "ON_CLS_ADDED",
      cls: cls,
    })
  })

  const handleSaveClick = async (e) => {
    const createdAt = new Date();
    e.preventDefault()
    if (onSave) {
      await onSave({
        images: state.images,
        albumMetadata: state.albumMetadata,
        createdAt,
        selectedImage: state?.selectedImage,
      })
      dispatchToReducer({
        type: "IMAGES_SAVED",
        savedAt: createdAt
      })
    }
  }

  const handleRecalcClick = async (e) => {
    const createdAt = new Date();
    e.preventDefault()
    if (onRecalc) {
      await onRecalc({
        images: state.images,
        albumMetadata: state.albumMetadata,
        createdAt,
        selectedImage: state?.selectedImage,
      })
      dispatchToReducer({
        type: "IMAGES_RECALCULATED",
        recalculatedAt: createdAt
      })
    }
  }

  const handleMetadataChange = (params) => {
    dispatchToReducer({
      type: "UPDATE_METADATA",
      ...params
    })
  }

  const handleAddGroup = (group) => {
    dispatchToReducer({
      type: "ADD_GROUP",
      group
    })
  }

  // trigger this on every BBox manipulation (there is currently no way to detect adding of new box!)
  useEffect(() => {
    if (!state.lastAction || !["BEGIN_BOX_TRANSFORM", "CHANGE_REGION", "DELETE_REGION", "DELETE_SELECTED_REGION", "UPDATE_METADATA", "SELECT_CLASSIFICATION"].includes(state.lastAction.type)) { return }
    if (onImagesChange) {
      onImagesChange(state.images)
    }
    dispatchToReducer({
      type: "IMAGES_UPDATED",
      updatedAt: new Date()
    })
  }, [onImagesChange, state.images, state.lastAction])

  useEffect(() => {
    if (selectedImage === undefined) return
    dispatchToReducer({
      type: "SELECT_IMAGE",
      imageIndex: selectedImage,
      image: state.images[selectedImage],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onImagesChange, selectedImage])

  if (!images && !videoSrc)
    return 'Missing required prop "images" or "videoSrc"'


  const [recalcActive, saveActive] = state.imagesSavedAt < state.imagesUpdatedAt ? [true, true] : [false, false];

  return (
    <SettingsProvider clsColors={clsColors} groupColors={groupColors}>
      <MainLayout
        RegionEditLabel={RegionEditLabel}
        alwaysShowNextButton={Boolean(onNextImage)}
        alwaysShowPrevButton={Boolean(onPrevImage)}
        state={state}
        dispatch={dispatch}
        onRegionClassAdded={onRegionClassAdded}
        hideHeader={hideHeader}
        hideHeaderText={hideHeaderText}
        hideNext={hideNext}
        hidePrev={hidePrev}
        hideClone={hideClone}
        hideSettings={hideSettings}
        hideFullScreen={hideFullScreen}
        hideSave={hideSave}
        groups={groups}
        onGroupSelect={onGroupSelect}
        hideHistory={hideHistory}
        hideNotEditingLabel={hideNotEditingLabel}
        showEditor={showEditor}
        showPageSelector={showPageSelector}
        onRecalc={handleRecalcClick}
        onSave={handleSaveClick}
        saveActive={recalcActive}
        recalcActive={saveActive}
        onMetadataChange={handleMetadataChange}
        onAddGroup={handleAddGroup}
        lockedImages={lockedImages}
      />
    </SettingsProvider>
  )
}

export default Annotator
