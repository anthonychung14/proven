import {
  getSnaps,
  getPresentIndex,
  stillProcessing,
  isProcessing
} from "../selectors";
/* 
    I'm pretty sure that even mapStateToProps can be composed
*/

export const mapSnapsAndIndex = state => ({
  numActions: getSnaps(state).size - 1 || 1,
  presentSnapIndex: getPresentIndex(state),
  disabledSlider: isProcessing(state)
});
