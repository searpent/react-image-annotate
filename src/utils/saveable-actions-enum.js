const reacalcActionsEnum = ["MOUSE_UP_RESIZE_BOX", "DELETE_REGION", "DELETE_GROUP", "MOUSE_UP_MOVE_REGION", "SELECT_CLASSIFICATION", "CHANGE_REGION"]

const saveableActionsEnum = [reacalcActionsEnum, "UPDATE_REGIONS", "UPDATE_METADATA", "UPDATE_ALBUM_METADATA", "ADD_METADATA"];

export { saveableActionsEnum, reacalcActionsEnum };